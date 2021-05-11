import config from 'config';
import r, { Connection, CreateResult, WriteResult } from 'rethinkdb';
import axios from 'axios';
import Logger from '../logger';
import { Hub } from './Hub';

class Database {
    private readonly database: string = config.get('rethink.database');
    private readonly port: number = config.get('rethink.port');
    private readonly host: string = config.get('rethink.hostname');
    private readonly tables: Array<string> = config.get('rethink.tables');
    private connection!: Connection;
    private accessToken: String = '';

    public async init() {
        try {
            axios
                .post('http://api:3030/authentication', {
                    email: 'admin@admin.be',
                    password: 'admin',
                    strategy: 'local',
                })
                .then((response) => {
                    this.accessToken = response.data.accessToken;
                });
            await this.checkForDatabase(this.database);
            await this.createRequiredTables();
            Logger.info('Database initialization successfull !');
        } catch (error) {
            console.log(error);
        }
    }

    /**
     * Connects to the database with the rethink driver
     * @returns {Promise} connection object
     */
    public connect(): Promise<Connection> {
        return new Promise((resolve, reject) => {
            r.connect({ host: 'rethinkdb', port: 28015 }, (error, conn) => {
                console.log(this.host);
                console.log(this.port);
                if (error) {
                    reject(new Error('Unable to connect to the database !'));
                } else {
                    Logger.info('Successfully connected to db !');
                    this.connection = conn;
                    resolve(conn);
                }
            });
        });
    }

    /**
     * Search for an existing database. If it exists exit. Else create the database
     * @returns {Promise} CreateResult : The created database name
     */
    private checkForDatabase(databaseName: string): Promise<void> {
        Logger.info('Checking for databases ... ');
        return new Promise((resolve, reject) => {
            r.dbList()
                .run(this.connection)
                .then((databases) => {
                    if (databases.includes(databaseName)) {
                        Logger.notice(`Database ${databaseName} already exists !`);
                        resolve();
                    } else {
                        r.dbCreate(databaseName).run(this.connection, (error, result) => {
                            if (error) {
                                reject(error);
                            }
                            Logger.info(`Database '${databaseName}' created !`);
                            resolve();
                        });
                    }
                });
        });
    }

    // eslint-disable-next-line
    public checkHubStatus(id: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            axios
                .get('http://localhost:3030/api/v1/hubs', {
                    params: {
                        hub_id: id,
                    },
                    headers: {
                        authorization: `Bearer ${this.accessToken}`,
                    },
                })
                .then((response) => {
                    if (response.data.total === 0) {
                        resolve(false);
                    } else {
                        resolve(true);
                    }
                })
                .catch((error) => {
                    Logger.warning(error.message);
                    reject();
                });
        });
    }

    // eslint-disable-next-line
    public createNewHub = (newHub: Hub): Promise<void> => {
        return new Promise((resolve, reject) => {
            axios
                .post(
                    'http://localhost:3030/api/v1/hubs',
                    {
                        hub_id: newHub.hubId,
                        sensors: newHub.sensors,
                        ip_addr: newHub.ipAddr,
                        status: newHub.status,
                        new: newHub.new,
                    },
                    {
                        headers: {
                            authorization: `Bearer ${this.accessToken}`,
                        },
                    },
                )
                .then(() => {
                    Logger.info('New hub created.');
                    resolve();
                })
                .catch((error) => {
                    Logger.warning(error);
                    reject();
                });
        });
    };

    /**
     * Search for existing tables in the database. If it exists exit. Else create the table
     * @returns {Promise} Returns true if all tables are available
     */
    private createRequiredTables(): Promise<boolean> {
        Logger.info('Checking for tables');
        return new Promise((resolve, reject) => {
            r.db(this.database)
                .tableList()
                .run(this.connection, (error, result) => {
                    if (error) {
                        reject(error);
                    }
                    this.tables.forEach((table) => {
                        if (result.includes(table)) {
                            Logger.notice(`Table : ${table} already exists. Skipping... !`);
                        } else {
                            r.db(this.database)
                                .tableCreate(table)
                                .run(this.connection, (err) => {
                                    reject(err);
                                });
                            Logger.info(`Creating table : ${table}`);
                        }
                    });
                    resolve(true);
                });
        });
    }
}

export default new Database();
