import Vue from 'vue';
import Vuetify from 'vuetify';
import '@mdi/font/css/materialdesignicons.css'; // Ensure you are using css-loader

Vue.use(Vuetify);

export default new Vuetify({
    icons: {
        iconfont: 'mdi',
    },
    theme: {
        themes: {
            light: {
                primary: '#FF0000',
                secondary: '#FF0000',
                accent: '#FF0000',
                error: '#FF0000',
                background: '#F9F9F9',
            },
        },
    },
});
