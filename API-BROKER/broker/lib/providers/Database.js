"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const rethinkdb_1 = __importDefault(require("rethinkdb"));
const axios_1 = __importDefault(require("axios"));
const logger_1 = __importDefault(require("../logger"));
class Database {
    constructor() {
        this.database = config_1.default.get('rethink.database');
        this.port = config_1.default.get('rethink.port');
        this.host = config_1.default.get('rethink.hostname');
        this.tables = config_1.default.get('rethink.tables');
        this.accessToken = '';
        this.createNewHub = (newHub) => {
            return new Promise((resolve, reject) => {
                axios_1.default
                    .post('http://api:3030/api/v1/hubs', {
                    hub_id: newHub.hubId,
                    sensors: newHub.sensors,
                    ip_addr: newHub.ipAddr,
                    status: newHub.status,
                }, {
                    headers: {
                        authorization: `Bearer ${this.accessToken}`,
                    },
                })
                    .then(() => {
                    logger_1.default.info('New hub created.');
                    resolve();
                })
                    .catch((error) => {
                    logger_1.default.warning(error);
                    reject();
                });
            });
        };
    }
    async init() {
        try {
            axios_1.default
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
            logger_1.default.info('Database initialization successfull !');
        }
        catch (error) {
            console.log(error);
        }
    }
    connect() {
        return new Promise((resolve, reject) => {
            rethinkdb_1.default.connect({ host: 'rethinkdb', port: 28015 }, (error, conn) => {
                console.log(this.host);
                console.log(this.port);
                if (error) {
                    reject(new Error('Unable to connect to the database !'));
                }
                else {
                    logger_1.default.info('Successfully connected to db !');
                    this.connection = conn;
                    resolve(conn);
                }
            });
        });
    }
    checkForDatabase(databaseName) {
        logger_1.default.info('Checking for databases ... ');
        return new Promise((resolve, reject) => {
            rethinkdb_1.default.dbList()
                .run(this.connection)
                .then((databases) => {
                if (databases.includes(databaseName)) {
                    logger_1.default.notice(`Database ${databaseName} already exists !`);
                    resolve();
                }
                else {
                    rethinkdb_1.default.dbCreate(databaseName).run(this.connection, (error) => {
                        if (error) {
                            reject(error);
                        }
                        logger_1.default.info(`Database '${databaseName}' created !`);
                        resolve();
                    });
                }
            });
        });
    }
    checkHubStatus(id) {
        return new Promise((resolve, reject) => {
            axios_1.default
                .get('http://api:3030/api/v1/hubs', {
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
                }
                else {
                    resolve(true);
                }
            })
                .catch((error) => {
                logger_1.default.warning(error.message);
                reject();
            });
        });
    }
    createRequiredTables() {
        logger_1.default.info('Checking for tables');
        return new Promise((resolve, reject) => {
            rethinkdb_1.default.db(this.database)
                .tableList()
                .run(this.connection, (error, result) => {
                if (error) {
                    reject(error);
                }
                this.tables.forEach((table) => {
                    if (result.includes(table)) {
                        logger_1.default.notice(`Table : ${table} already exists. Skipping... !`);
                    }
                    else {
                        rethinkdb_1.default.db(this.database)
                            .tableCreate(table)
                            .run(this.connection, (err) => {
                            reject(err);
                        });
                        logger_1.default.info(`Creating table : ${table}`);
                    }
                });
                resolve(true);
            });
        });
    }
}
exports.default = new Database();
