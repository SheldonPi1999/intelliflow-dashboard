<template>
    <v-menu
        min-width="340"
        max-width="340"
        transition="scale-transition"
        origin="top center"
        nudge-bottom="50"
        left
        nudge-right="153"
        v-model="menu"
        :close-on-content-click="true"
    >
        <template #activator="{ on: onMenu }">
            <v-tooltip bottom>
                <template #activator="{ on: onTooltip }">
                    <BellIcon v-on="{ ...onMenu, ...onTooltip }" class="ml-3 notifications__icon" />
                </template>
                <span class="text">Notifications</span>
            </v-tooltip>
        </template>

        <v-card>
            <v-list>
                <v-list-item>
                    <v-list-item-content align="center">
                        <v-list-item-title class="heading">5 New</v-list-item-title>
                        <v-list-item-subtitle class="text">Notifications</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

            <v-divider />

            <v-list>
                <v-list-item>
                    <v-list-item-content align="LEFT">
                        <v-list-item-title class="heading">#1 - NOTification </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item>
                    <v-list-item-content align="LEFT">
                        <v-list-item-title class="text">#2 - NOTification </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>
        </v-card>
    </v-menu>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { BellIcon } from 'vue-feather-icons';

@Component({
    name: 'DpNotificationsPopup',
    components: {
        BellIcon,
    },
})
export default class DpNotificationsPopup extends Vue {
    menu = false;
}
</script>

<style lang="scss" scoped>
.notifications__icon:hover {
    cursor: pointer;
}
</style>
