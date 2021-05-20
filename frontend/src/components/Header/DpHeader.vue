<template>
    <v-app-bar class="header" app>
        <div class="ma-0 pa-0 header__icons" v-if="$route.name === 'Dashboard'">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <PlusCircleIcon
                        @click="toggleAddChartStepper"
                        v-bind="attrs"
                        v-on="on"
                        class="ml-1"
                    />
                </template>
                <span class="text">Add Chart</span>
            </v-tooltip>
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <Trash2Icon
                        @click="toggleDeleteChartOverlay"
                        v-bind="attrs"
                        v-on="on"
                        class="ml-3"
                    />
                </template>
                <span class="text">Delete Chart</span>
            </v-tooltip>
        </div>

        <div class="ma-0 pa-0 header__icons" v-if="$route.name === 'Profile'">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <EditIcon @click="toggleProfileEditFields()"
                        v-bind="attrs"
                        v-on="on"
                        class="ml-1" />
                </template>
                <span class="text">Edit Profile</span>
            </v-tooltip>
        </div>

        <div class="ma-0 pa-0 header__icons" v-if="$route.name === 'Users'">
            <v-tooltip bottom>
                <template v-slot:activator="{ on, attrs }">
                    <UserPlusIcon @click="$refs.addUserDialog.show()"
                        v-bind="attrs"
                        v-on="on"
                        class="ml-1" />
                    <DpAddUserDialog ref="addUserDialog" />
                </template>
                <span class="text">Add User</span>
            </v-tooltip>
        </div>

        <v-spacer />

        <DpNotificationsPopup />

        <DpAvatar />
    </v-app-bar>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import { SearchIcon, Trash2Icon, PlusCircleIcon, EditIcon, UserPlusIcon } from 'vue-feather-icons';
import { mapMutations } from 'vuex';
import DpAvatar from './DpAvatar.vue';
import DpAddUserDialog from '../Users/DpAddUserDialog.vue';

export default Vue.extend({
    name: 'DpHeader',
    components: {
        DpAvatar,
        Trash2Icon,
        PlusCircleIcon,
        EditIcon,
        UserPlusIcon,
        DpAddUserDialog,
    },
    methods: {
        ...mapMutations(['toggleDeleteChartOverlay', 'toggleAddChartStepper', 'toggleProfileEditFields']),
    },
});
</script>

<style lang="scss" scoped>
.header {
    background-color: #ffffff !important;
    border-radius: 8px !important;
    margin: 20px !important;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05) !important;

    &__icons {
        display: flex;
        vertical-align: middle;
    }
}
</style>
