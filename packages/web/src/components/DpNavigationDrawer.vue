<template>
    <v-navigation-drawer class="drawer" app permanent>
        <v-list-item>
            <v-list-item-content>
                <v-img height="70" aspect-ratio="1" contain src="@/assets/images/logo.png" />
            </v-list-item-content>
        </v-list-item>

        <v-list dense nav class="drawer__list">
            <v-list-item-group>
                <div v-for="item in items" :key="item.title">
                    <v-subheader v-if="item.header">{{ item.text }}</v-subheader>
                    <v-list-item v-else link :to="item.link">
                        <v-list-item-icon>
                            <v-img :src="item.icon" />
                        </v-list-item-icon>
                        <v-list-item-content>
                            <v-list-item-title class="change-font">
                                {{ item.title }}
                            </v-list-item-title>
                        </v-list-item-content>
                    </v-list-item>
                </div>
            </v-list-item-group>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { NavigationItems } from '../interfaces/index';

@Component({
    name: 'DpNavigationDrawer',
    components: {},
})
export default class DpNavigationDrawer extends Vue {
    iconPaths = {
        /* eslint-disable */
        home: require('@/assets/icons/home.svg'),
        simulations: require('@/assets/icons/play-circle.svg'),
        hubs: require('@/assets/icons/hard-drive.svg'),
        sensors: require('@/assets/icons/cpu.svg'),
        profile: require('@/assets/icons/user.svg'),
        users: require('@/assets/icons/users.svg'),
        backup: require('@/assets/icons/save.svg'),
        logs: require('@/assets/icons/server.svg'),
        /* eslint-enable */
    };

    items: NavigationItems[] = [
        { title: 'Dashboard', icon: this.iconPaths.home, link: '/' },
        { title: 'Simulation', icon: this.iconPaths.simulations, link: '/simulations' },

        { header: true, text: 'DEVICES' },
        // Devices
        { title: 'Hubs', icon: this.iconPaths.hubs, link: '/hubs' },
        { title: 'Sensors', icon: this.iconPaths.sensors, link: '/sensors' },

        { header: true, text: 'SETTINGS' },
        // Settings
        { title: 'Profile', icon: this.iconPaths.profile, link: '/profile' },

        { header: true, text: 'ADMIN' },
        // Admin
        { title: 'Users', icon: this.iconPaths.users, link: '/users' },
        { title: 'Backup', icon: this.iconPaths.backup, link: '/backup' },
        { title: 'Logs', icon: this.iconPaths.logs, link: '/logs' },
    ];
}
</script>

<style lang="scss">
.v-application--is-ltr .v-list-item__action:first-child,
.v-application--is-ltr .v-list-item__icon:first-child {
    margin-right: 12px !important;
}
.drawer {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    border: none !important;
    & .v-list-item__title {
        font-family: 'Montserrat', sans-serif;
        font-size: 16px !important;
        color: rgb(73, 73, 73) !important;
    }
}
.v-navigation-drawer__border {
    display: none !important;
}
</style>
