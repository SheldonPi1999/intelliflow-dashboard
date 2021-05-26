/**
 * Broker module
 * @module broker
 */
import process from 'process';
import config from 'config';
// import aedes, { Client } from 'aedes';
import aedes from 'aedes';
import axios from 'axios';
import * as net from 'net';
import { Hub } from './providers/Hub';
import Logger from './logger';
import { ErrnoException } from './interfaces/index';
import Database from './providers/Database';

const version = '1.0';

class Broker {
    // Server
    private readonly port: number = config.get('port');
    private _process = process;
    public aedes = aedes();
    public service = net.createServer(this.aedes.handle);

    /**
     * Create a Broker.
     */
    public constructor() {
        console.log(
            `\n*****************************************\n*\tIntelliflow broker V${version}\t*\n*****************************************\n`,
        );
        Logger.info('Starting Intelliflow MQTT broker');

        this.service.once('error', (error: ErrnoException) => {
            if (error.code === 'EADDRINUSE') {
                Logger.error('Port is already in use.');
                this.shutdown('Shutting due to port already in use !');
            }
        });
        // Listen for shut down signals
        this._process.on('SIGINT', () => {
            this.shutdown();
        });
        this._process.on('SIGTERM', () => {
            this.shutdown();
        });
    }

    /**
     * Initialize a broker instance
     */
    public async init() {
        try {
            Logger.info('Initializing broker ... ');
            // Try to connect to database
            await Database.connect();

            // Create database and tables
            await Database.init();

            this.listen();
        } catch (error) {
            Logger.error(error);
            this.shutdown();
        }
    }

    public run(): void {
        this.aedes.on('publish', (packet) => {
            /* eslint-disable */
            console.log("New Packet:");
            console.log(packet);

            if(packet.topic == 'intelliflow>connected>hub>') {
                hubChecker(packet);
                console.log(packet);

                async function hubChecker(packet: any) {
                    try {
                        const hubExists = await Database.checkHubStatus(packet.payload.toString());
                        console.log(hubExists);
                        if (hubExists) {
                            Logger.notice('Hub already exists in database');
                        } else {
                            await Database.createNewHub(new Hub(packet.payload.toString()));
                            console.log('Creating new hub');
                        }
                    } catch (error) {
                        console.log(error);
                    }

                    console.log( `Client connected:  ${packet.payload.toString()}`);
                }

            } else if ((packet.topic).includes(">data>")) {

                /*
                    broker_1   | Value = 0: intelliflow
                    broker_1   | Value = 1: TEST_001
                    broker_1   | Value = 2: testTask0
                    broker_1   | Value = 3: data
                    broker_1   | Value = 4: 
                */

                let topicfields = (packet.topic).split('>');

                for (let i = 0; i < topicfields.length; i++) {
                    console.log(`Value = ${i}: ${topicfields[i]}`)
                }

                this.sensorInHub(topicfields[1], topicfields[2]);

                if(topicfields.length > 3) {
                    try {
                        axios.post('http://api:3030/api/v1/data', {
                            // @ts-ignore
                            hubId: topicfields[1],
                            // @ts-ignore
                            sensorId: topicfields[2],
                            // @ts-ignore
                            value: Number(packet.payload.toString()),
                            // @ts-ignore
                            extraId: topicfields[4],
                        })
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    try {
                        axios.post('http://api:3030/api/v1/data', {
                            // @ts-ignore
                            hubId: topicfields[1],
                            // @ts-ignore
                            sensorId: topicfields[2],
                            // @ts-ignore
                            value: Number(packet.payload.toString()),
                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
            } else if ((packet.topic).includes(">esp_config>")) {
                
                let topicfields = (packet.topic).split('>');

                for (let i = 0; i < topicfields.length; i++) {
                    console.log(`Value = ${i}: ${topicfields[i]}`)
                }

                if(topicfields.length > 3) {
                    try {
                        axios.post('http://api:3030/api/v1/esp_config', {
                            // @ts-ignore
                            hubId: topicfields[1],
                            // @ts-ignore
                            sensorId: topicfields[2],
                            // @ts-ignore
                            pinMap: packet.payload.toString(),
                            // @ts-ignore
                            extraConfig: topicfields[4],
                        })
                    } catch (error) {
                        console.log(error);
                    }
                } else {
                    try {
                        axios.post('http://api:3030/api/v1/esp_config', {
                            // @ts-ignore
                            hubId: topicfields[1],
                            // @ts-ignore
                            sensorId: topicfields[2],
                            // @ts-ignore
                            pinMap: packet.payload.toString(),
                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
            }
        });
    }

    private login = async () => {
        const { data } = await axios.post('http://api:3030/authentication', {
            email: 'admin@admin.be',
            password: 'admin',
            strategy: 'local',
        });
        return data.accessToken;
    };

    private sensorInHub = async (hubId: string, newSensor: any) => {
        const token = await this.login();
        axios
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
                    axios.patch(
                        'http://api:3030/api/v1/hubs',
                        {
                            sensors,
                        },
                        {
                            params: {
                                hub_id: hubId,
                            },
                            headers: {
                                authorization: `Bearer ${token}`,
                            },
                        },
                    );
                } else {
                    if (sensors.includes(newSensor)) {
                        console.log("Sensor already exists in hub!");
                    } else {
                            console.log('Sensor creating ...');
                            sensors.push(newSensor);
                            axios.patch(
                                'http://api:3030/api/v1/hubs',
                                {
                                    sensors,
                                },
                                {
                                    params: {
                                        hub_id: hubId,
                                    },
                                    headers: {
                                        authorization: `Bearer ${token}`,
                                    },
                                },
                            );
                    }
                };
            })
            .catch((error) => {
                console.log(error);
            });
    };

    /**
     * listen
     */
    private listen(): void {
        this.service.listen(this.port, (): void => {
            Logger.info(`Service is listening on http://api:${this.port}`);
        });
    }

    /**
     * shutdown
     * @param {String} message : Optional message for shutting down the broker
     */
    private shutdown(message: string = 'Shutting down broker gracefully'): void {
        Logger.warning(message);
        this._process.exit();
    }
}

export default Broker;
