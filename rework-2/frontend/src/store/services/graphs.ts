import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Graphs extends BaseModel {
    constructor(data: any, options: any) {
        super(data, options);
    }

    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Hubs';

    // Define default properties here
    static instanceDefaults() {
        return {};
    }
}
const servicePath = '/api/v1/graphs';
const servicePlugin = makeServicePlugin({
    Model: Graphs,
    replaceItems: false,
    service: feathersClient.service(servicePath),
    servicePath,
});
// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
    before: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
    after: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
    error: {
        all: [],
        find: [],
        get: [],
        create: [],
        update: [],
        patch: [],
        remove: [],
    },
});
export default servicePlugin;
