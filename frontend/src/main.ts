import Vue from 'vue';
import { TimelineMax } from 'gsap';
import VueNotification from '@kugatsu/vuenotification';
import VueApexCharts from 'vue-apexcharts';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.component('apexchart', VueApexCharts);
Vue.config.productionTip = false;

Vue.use(VueNotification, {
    timer: 20,
    position: 'bottomRight',
    animateIn():any {
        return new TimelineMax()
        // @ts-ignore
            .from(this.notificationEl, 0.6, {
                opacity: 0,
            })
        // @ts-ignore
            .from(this.notificationEl, 0, {})
        // @ts-ignore
            .from(this.notificationElContent, 0.3, {
                opacity: 0,
            });
    },
    animateOut(): any {
        // @ts-ignore
        return new TimelineMax().from(this.notificationElContent, 0, {
            opacity: 0,
        });
    },
});

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
