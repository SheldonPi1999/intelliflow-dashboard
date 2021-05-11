import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Data extends BaseModel {
    constructor(data: any, options: any) {
        super(data, options);
    }

    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Data';

    // Define default properties here
    static instanceDefaults() {
        return {};
    }
}
const servicePath = '/api/v1/data';
const servicePlugin = makeServicePlugin({
    Model: Data,
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
