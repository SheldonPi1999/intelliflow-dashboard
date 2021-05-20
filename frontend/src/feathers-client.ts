import feathers from '@feathersjs/feathers';
import socketio from '@feathersjs/socketio-client';
import auth from '@feathersjs/authentication-client';
import io from 'socket.io-client';
import feathersVuex from 'feathers-vuex';
import apiSettings from '../apiSettings.json';

const SERVER_URL = ('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort);

const socket = io(SERVER_URL, { transports: ['websocket'] });
const feathersClient = feathers()
    .configure(socketio(socket))
    .configure(
        auth({
            storage: window.localStorage,
            path: '/authentication',
        }),
    );
export default feathersClient;
// Setting up feathers-vuex
const { makeServicePlugin, makeAuthPlugin, BaseModel, models, FeathersVuex } = feathersVuex(
    feathersClient, { serverAlias: '/api' },
);
export { makeAuthPlugin, makeServicePlugin, BaseModel, models, FeathersVuex };