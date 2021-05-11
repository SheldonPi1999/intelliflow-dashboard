<template>
    <v-card flat outlined class="my-3">
        <v-container class="pa-0 ma-0">
            <v-row align="center" class="pa-0 ma-0">
                <v-col cols="2" class="text-center">
                    <v-avatar>
                        <img class="ma-2" src="@/assets/icons/hard-drive.svg" alt="Hub" />
                    </v-avatar>
                </v-col>
                <v-col cols="7" class="pa-0">
                    <v-card-text class="py-0">
                        <v-card-title class="pl-0 pb-2 hub__title">
                            {{ hub.hub_id }}
                        </v-card-title>
                        <v-card-subtitle class="pl-0 ml-0 hub__subtitle">
                            {{ hub.status }}
                        </v-card-subtitle>
                    </v-card-text>
                </v-col>
                <v-col cols="3">
                    <v-btn flat text color="green" @click="addHub(hub)">add</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';

export default Vue.extend({
    name: 'DpHubItem',
    props: {
        hub: {
            type: Object,
        },
    },

    methods: {
        addHub(hub: any) {
            // eslint-disable-next-line no-underscore-dangle
            this.$store.dispatch('hubs/update', [hub._id, { ...hub, new: false }]);
        },
    },
});
</script>
