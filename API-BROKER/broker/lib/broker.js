"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const process_1 = __importDefault(require("process"));
const config_1 = __importDefault(require("config"));
const aedes_1 = __importDefault(require("aedes"));
const axios_1 = __importDefault(require("axios"));
const net = __importStar(require("net"));
const Hub_1 = require("./providers/Hub");
const logger_1 = __importDefault(require("./logger"));
const Database_1 = __importDefault(require("./providers/Database"));
const version = '1.0';
class Broker {
    constructor() {
        this.port = config_1.default.get('port');
        this._process = process_1.default;
        this.aedes = aedes_1.default();
        this.service = net.createServer(this.aedes.handle);
        this.login = async () => {
            const { data } = await axios_1.default.post('http://api:3030/authentication', {
                email: 'admin@admin.be',
                password: 'admin',
                strategy: 'local',
            });
            return data.accessToken;
        };
        this.sensorInHub = async (hubId, newSensor) => {
            const token = await this.login();
            axios_1.default
                .get('http://api:3030/api/v1/hubs', {
                params: {
                    hub_id: hubId,
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
                .then((response) => {
                const { sensors } = response.data.data[0];
                console.log(sensors);
                if (sensors.length === 0) {
                    sensors.push(newSensor);
                    axios_1.default.patch('http://api:3030/api/v1/hubs', {
                        sensors,
                    }, {
                        params: {
                            hub_id: hubId,
                        },
                        headers: {
                            authorization: `Bearer ${token}`,
                        },
                    });
                }
                else {
                    if (sensors.includes(newSensor)) {
                        console.log("Sensor already exists in hub!");
                    }
                    else {
                        console.log('Sensor creating ...');
                        sensors.push(newSensor);
                        axios_1.default.patch('http://api:3030/api/v1/hubs', {
                            sensors,
                        }, {
                            params: {
                                hub_id: hubId,
                            },
                            headers: {
                                authorization: `Bearer ${token}`,
                            },
                        });
                    }
                }
                ;
            })
                .catch((error) => {
                console.log(error);
            });
        };
        console.log(`\n*****************************************\n*\tIntelliflow broker V${version}\t*\n*****************************************\n`);
        logger_1.default.info('Starting Intelliflow MQTT broker');
        this.service.once('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                logger_1.default.error('Port is already in use.');
                this.shutdown('Shutting due to port already in use !');
            }
        });
        this._process.on('SIGINT', () => {
            this.shutdown();
        });
        this._process.on('SIGTERM', () => {
            this.shutdown();
        });
    }
    async init() {
        try {
            logger_1.default.info('Initializing broker ... ');
            await Database_1.default.connect();
            await Database_1.default.init();
            this.listen();
        }
        catch (error) {
            logger_1.default.error(error);
            this.shutdown();
        }
    }
    run() {
        this.aedes.on('publish', (packet) => {
            console.log("New Packet:");
            console.log(packet);
            if (packet.topic == 'intelliflow>connected>hub>') {
                hubChecker(packet);
                console.log(packet);
                async function hubChecker(packet) {
                    try {
                        const hubExists = await Database_1.default.checkHubStatus(packet.payload.toString());
                        console.log(hubExists);
                        if (hubExists) {
                            logger_1.default.notice('Hub already exists in database');
                        }
                        else {
                            await Database_1.default.createNewHub(new Hub_1.Hub(packet.payload.toString()));
                            console.log('Creating new hub');
                        }
                    }
                    catch (error) {
                        console.log(error);
                    }
                    console.log(`Client connected:  ${packet.payload.toString()}`);
                }
            }
            else if ((packet.topic).includes(">data>")) {
                let topicfields = (packet.topic).split('>');
                for (let i = 0; i < topicfields.length; i++) {
                    console.log(`Value = ${i}: ${topicfields[i]}`);
                }
                this.sensorInHub(topicfields[1], topicfields[2]);
                if (topicfields.length > 3) {
                    try {
                        axios_1.default.post('http://api:3030/api/v1/data', {
                            hubId: topicfields[1],
                            sensorId: topicfields[2],
                            value: Number(packet.payload.toString()),
                            extraId: topicfields[4],
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                else {
                    try {
                        axios_1.default.post('http://api:3030/api/v1/data', {
                            hubId: topicfields[1],
                            sensorId: topicfields[2],
                            value: Number(packet.payload.toString()),
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
            else if ((packet.topic).includes(">esp_config>")) {
                let topicfields = (packet.topic).split('>');
                for (let i = 0; i < topicfields.length; i++) {
                    console.log(`Value = ${i}: ${topicfields[i]}`);
                }
                if (topicfields.length > 3) {
                    try {
                        axios_1.default.post('http://api:3030/api/v1/esp_config', {
                            hubId: topicfields[1],
                            sensorId: topicfields[2],
                            pinMap: packet.payload.toString(),
                            extraConfig: topicfields[4],
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
                else {
                    try {
                        axios_1.default.post('http://api:3030/api/v1/esp_config', {
                            hubId: topicfields[1],
                            sensorId: topicfields[2],
                            pinMap: packet.payload.toString(),
                        });
                    }
                    catch (error) {
                        console.log(error);
                    }
                }
            }
        });
    }
    listen() {
        this.service.listen(this.port, () => {
            logger_1.default.info(`Service is listening on http://api:${this.port}`);
        });
    }
    shutdown(message = 'Shutting down broker gracefully') {
        logger_1.default.warning(message);
        this._process.exit();
    }
}
exports.default = Broker;
