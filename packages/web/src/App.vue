<template>
    <!-- App.vue -->
    <v-app :style="{ background: $vuetify.theme.themes[theme].background }">
        <div v-if="user && user.verified">
            <DpNavigationDrawer />
            <DpHeader />
            <DpNewSensorNotification />
        </div>
        <!-- Sizes your content based upon application components -->
        <v-main>
            <!-- Provides the application the proper gutter -->
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
import { Vue } from 'vue-property-decorator';
import { mapActions } from 'vuex';
import DpNavigationDrawer from './components/DpNavigationDrawer.vue';
import DpHeader from './components/Header/DpHeader.vue';
import DpNewSensorNotification from './components/DpNewSensorNotification.vue';
import DpBreadcrumbs from './components/DpBreadcrumbs.vue';
import { IUser } from './interfaces';

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
    methods: {
        ...mapActions('auth', { authLogout: 'logout' }),
        logout(): void {
            this.authLogout().then(() => {
                this.$router.push('/login');
            });
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
