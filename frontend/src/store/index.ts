// src/store/index.js
import Vue from 'vue';
import Vuex from 'vuex';
import { FeathersVuex } from '../feathers-client';
import auth from './store.auth';

Vue.use(Vuex);
Vue.use(FeathersVuex);

const requireModule = require.context(
    // The path where the service modules live
    './services',
    // Whether to look in subfolders
    false,
    // Only include .js files (prevents duplicate imports`)
    /.ts$/,
);

const servicePlugins = requireModule.keys().map((modulePath) => requireModule(modulePath).default);

export default new Vuex.Store({
    state: {
        deleteChartOverlay: false,
        addChartStepper: false,
        profileEditFields: false,
    },
    mutations: {
        /* eslint-disable */
        toggleDeleteChartOverlay: (state, payload) => {
            state.deleteChartOverlay = !state.deleteChartOverlay;
        },
        toggleAddChartStepper: (state, payload) => {
            state.addChartStepper = !state.addChartStepper;
        },
        toggleProfileEditFields: (state, payload) => {
            state.profileEditFields = !state.profileEditFields;
        }
        /* eslint-enable */
    },
    actions: {},
    plugins: [...servicePlugins, auth],
});
