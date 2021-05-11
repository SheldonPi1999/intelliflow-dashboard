<template>
    <div class="ml-6">
        <v-menu
            transition="scale-transition"
            origin="top center"
            max-width="125"
            bottom
            left
            nudge-right="32"
            nudge-bottom="70"
        >
            <template v-slot:activator="{ on, attrs }">
                <v-row align="center">
                    <v-col align="end" class="center">
                        <h5 class="avatar-title heading mt-2">{{user.username}}</h5>
                        <span class="avatar-subtitle text">
                            {{ user.admin ? 'Administrator' : 'User'}}
                        </span>
                    </v-col>

                    <v-col class="pl-0">
                        <v-avatar v-bind="attrs" v-on="on" size="40px">
                            <v-img :src="user.imageUrl" />
                        </v-avatar>
                    </v-col>
                </v-row>
            </template>

             <v-list class="pa-1" dense>
                <v-list-item link to="/profile">
                    <v-list-item-icon>
                        <UserIcon />
                    </v-list-item-icon>
                    <v-list-item-title class="text">
                        Profile
                    </v-list-item-title>
                </v-list-item>

                <v-divider class="mx-2 my-1"/>

                <v-list-item link @click="logout()">
                    <v-list-item-icon>
                        <LogOutIcon />
                    </v-list-item-icon>
                    <v-list-item-title class="text">
                        Logout
                    </v-list-item-title>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { LogOutIcon, UserIcon } from 'vue-feather-icons';
import { mapActions } from 'vuex';
import { AvatarDropDown } from '../../interfaces/index';

export default Vue.extend({
    name: 'DpAvatar',
    components: {
        LogOutIcon,
        UserIcon,
    },
    data() {
        return {
            items: [
                { title: 'Profile', link: '/profile' },
                { divider: true },
                { title: 'Logout' },
            ] as AvatarDropDown[],
        };
    },
    computed: {
        user() {
            return this.$store.state.auth.user;
        },
    },
    methods: {
        ...mapActions('auth', { authLogout: 'logout' }),
        logout() {
            this.authLogout().then(() => {
                this.$router.push('/login');
            });
        },
    },
});
</script>

<style lang="scss" scoped>
.center {
    vertical-align: middle;
}

.avatar-title {
    line-height: 0.25;
}

.avatar-subtitle {
    font-size: 0.75rem !important;
    font-weight: 400;
    letter-spacing: 0.0333333333em !important;
    line-height: 1.25rem;
}
</style>
