import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Users extends BaseModel {
    constructor(data: any, options: any) {
        super(data, options);
    }

    // Required for $FeathersVuex plugin to work after production transpile.
    static modelName = 'Users';

    // Define default properties here
    static instanceDefaults() {
        return {};
    }
}
const servicePath = '/users';
const servicePlugin = makeServicePlugin({
    Model: Users,
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
