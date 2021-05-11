/**
 * Broker module
 * @module broker
 */
import process from 'process';
import config from 'config';
import aedes, { Client } from 'aedes';
import { load, Type } from 'protobufjs';
import axios from 'axios';
import * as net from 'net';
import { Hub } from './providers/Hub';
import Logger from './logger';
import { ErrnoException } from './interfaces/index';
import { version } from '../package.json';
import Database from './providers/Database';

class Broker {
    // Server
    private readonly port: number = config.get('port');
    private _protoType!: Type | undefined;
    private _process = process;
    public aedes = aedes();
    public service = net.createServer(this.aedes.handle);

    /**
     * Create a Broker.
     */
    public constructor() {
        console.log(
            `\n*****************************************\n*\tData pixel broker v${version}\t*\n*****************************************\n`,
        );
        Logger.info('Starting Data-Pixel MQTT broker');

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

            // Read protofile
            await this.readProtoFile();

            this.listen();
        } catch (error) {
            Logger.error(error);
            this.shutdown();
        }
    }

    private readProtoFile() {
        return new Promise<string | void>((resolve, reject) => {
            load('./src/proto/message.proto', (err, root) => {
                if (err) {
                    reject(new Error(err.message));
                } else {
                    this._protoType = root?.lookupType('Sensors.Sensor');
                    Logger.info('Protobuffer config file loaded succesfully !');
                    resolve();
                }
            });
        });
    }

    public run(): void {
        this.aedes.on('publish', (packet, client) => {
            /* eslint-disable */
            console.log("New Packet:");
            console.log(packet);

            switch (packet.topic) {
                case 'datapixel>sensors>':
                    console.log('Olla');
                    if (this._protoType) {
                        /* eslint-disable */
                        // @ts-ignore
                        const decoded = this._protoType.decode(packet.payload);
                        console.log(`${client.id}: Decoded = ${JSON.stringify(decoded)}`);
                        /* eslint-disable */
                        // @ts-ignore
                        this.sensorInHub(client.id, decoded);

                        /* eslint-disable */
                        try {
                            axios.post('http://localhost:3030/api/v1/data', {
                                // @ts-ignore
                                sensorId: decoded.id,
                                // @ts-ignore
                                value: decoded.value,
                            })
                        } catch (error) {
                            console.log(error);
                        }

                    }
                case 'datapixel>sensors>testTask>': {
                    console.log(`${client.id}-> \ndecoded = ${Number(packet.payload.toString())}\ntopic = ${packet.topic}`);

                    try {
                        axios.post('http://localhost:3030/api/v1/data', {
                            // @ts-ignore
                            sensorId: "TestSensor",
                            // @ts-ignore
                            value: Number(packet.payload.toString()),
                        })
                    } catch (error) {
                        console.log(error);
                    }
                }
                case 'datapixel>connected>hub>': {
                    async function hubChecker(packet: any) {
                        try {
                            const hubExists = await Database.checkHubStatus(packet.payload.toString());
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
                    hubChecker(packet);
                }
            }
            /* eslint-enable */
        });
    /*
        this.aedes.on(
            'client',
            async (client: Client): Promise<void> => {
                try {
                    const hubExists = await Database.checkHubStatus(client.id);
                    if (hubExists) {
                        Logger.notice('Hub already exists in database');
                    } else {
                        await Database.createNewHub(new Hub(client.id));
                        console.log('Creating new hub');
                    }
                } catch (error) {
                    console.log(error);
                }

                console.log(
                    `Client connected:  ${client.id}
                `,
                );
            },
        );
    */
    }

    private login = async () => {
        const { data } = await axios.post('http://localhost:3030/authentication', {
            email: 'admin@admin.be',
            password: 'admin',
            strategy: 'local',
        });
        return data.accessToken;
    };

    private sensorInHub = async (hubId: string, newSensor: any) => {
        const token = await this.login();
        axios
            .get('http://localhost:3030/api/v1/hubs', {
                params: {
                    hub_id: hubId,
                },
                headers: {
                    authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                const { sensors } = response.data.data[0];
                if (sensors.length === 0) {
                    sensors.push(newSensor);
                    axios.patch(
                        'http://localhost:3030/api/v1/hubs',
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
                    sensors.forEach(() => {
                        if (sensors.some((e: any) => e.id === newSensor.id)) {
                            console.log('Sensor exists in hub');
                        } else {
                            console.log('Sensor creating ...');
                            sensors.push(newSensor);
                            axios.patch(
                                'http://localhost:3030/api/v1/hubs',
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
                    });
                }
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
            Logger.info(`Proto service is listening on http://localhost:${this.port}`);
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
