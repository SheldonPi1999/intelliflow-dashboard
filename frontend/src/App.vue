<template>
    <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
        <div v-if="user && user.verified">
            <DpNavigationDrawer />
            <DpHeader />
            <DpNewSensorNotification />
        </div>

        <v-main>
            <v-container v-if="user && !user.verified" class="fill-height">
                <v-row class="text-center align-items-center h-100">
                    <v-col cols="12">
                        <h2>You are not verified yet !</h2>
                        <v-btn rounded outlined text class="mt-2" @click="logout">Logout</v-btn>
                    </v-col>
                </v-row>
            </v-container>
            <v-container v-else
                fluid :class="$route.name === 'Login' ? 'fill-height' : ''">
                <DpBreadcrumbs v-if="user" />
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import axios from 'axios';
import { Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import DpNavigationDrawer from './components/DpNavigationDrawer.vue';
import DpHeader from './components/Header/DpHeader.vue';
import DpNewSensorNotification from './components/DpNewSensorNotification.vue';
import DpBreadcrumbs from './components/DpBreadcrumbs.vue';
import { IUser } from './interfaces';
import apiSettings from '../apiSettings.json';

export default Vue.extend({
    name: 'App',
    components: {
        DpNavigationDrawer,
        DpHeader,
        DpNewSensorNotification,
        DpBreadcrumbs,
    },
    computed: {
        theme(): string {
            return this.$vuetify.theme.dark ? 'dark' : 'light';
        },
        user(): IUser {
            return this.$store.state.auth.user;
        },
    },

    mounted() {
        setInterval(() => {
             this.hubOnlineCheck();
        }, 5000);
    },

    methods: {
        ...mapActions('auth', { authLogout: 'logout' }),
        logout(): void {
            this.authLogout().then(() => {
                this.$router.push('/login');
            });
        },

        async hubOnlineCheck() {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    },
                });

                for (let i = 0; i < (data.data.length); i += 1) {
                    this.getLastDataPoint(data.data[i].hub_id)
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getLastDataPoint(hub_id: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                    params: {
                        hubId: hub_id,
                    },
                });

                if(data.data.length > 0 && data.data.length < 1000) {
                    const lastDataTime = new Date((data.data[data.total-1].createdAt));
                    const now = new Date();

                    const diff =  now - lastDataTime;

                    if (diff < 60e3) {
                        console.log(Math.floor(diff / 1e3), 'seconds ago');
                        this.reconnectHub(hub_id);
                    } else {
                        console.log(Math.floor(diff / 60e3), 'minutes ago');
                        this.disconnectHub(hub_id);
                    };
                } else {
                    this.disconnectHub(hub_id);
                }
            } catch (error) {
                console.log(error);
            }
        },
        
        async disconnectHub(hub_id: string) {
            try { 
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    },
                    params: {
                        hub_id: hub_id,
                    },
                });
                console.log(hub_id);
                for(let i = 0; i < data.data.length; i++) {
                    this.$store.dispatch('hubs/update', [data.data[i]._id, { ...(data.data[i]), status: "Offline" }]);
                }
            } catch (error) {
                console.log(error);
            }
        },

        async reconnectHub(hub_id: string) {
            try { 
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    },
                    params: {
                        hub_id: hub_id,
                    },
                });
                console.log(hub_id);
                for(let i = 0; i < data.data.length; i++) {
                    this.$store.dispatch('hubs/update', [data.data[i]._id, { ...(data.data[i]), status: "Online" }]);
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
});
</script>
,
<style lang="scss">
h1,
h2,
h3,
h4,
h5,
h6 {
    font-family: 'Montserrat', sans-serif;
}

body {
    font-family: 'Varela Round', sans-serif !important;
}

p,
i,
blockquote,
a {
    font-family: 'Varela Round', sans-serif !important;
}

.heading {
    font-family: 'Montserrat', sans-serif !important;
}

.text {
    font-family: 'Varela Round', sans-serif !important;
}
.shadow {
    border-radius: 8px !important;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05) !important;
}

</style>
