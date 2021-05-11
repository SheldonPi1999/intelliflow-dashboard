<template>
    <v-dialog v-model="dialog" persistent max-width="550" scrollable>
        <v-card>
            <v-card-title class="pt-10 headline justify-center grey--text">
                Available devices
            </v-card-title>

            <FeathersVuexFind
                v-slot="{ items: hubs }"
                service="hubs"
                :params="{ query: { new: true } }"
                watch="query"
            >
                <v-card-text>
                    <p class="text-center" v-if="hubs.length === 0">
                        No devices found
                    </p>

                    <div v-else v-for="hub in hubs" :key="hub._id">
                        <DpHubItem :hub="hub" />
                    </div>
                </v-card-text>
            </FeathersVuexFind>
            <v-card-actions>
                <v-spacer />
                <v-btn color="red darken-1" text @click="dialog = false">
                    cancel
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DpHubItem from '@/components/DpHubItem.vue';

@Component({
    components: {
        DpHubItem,
    },
})
export default class DpAddHubDialog extends Vue {
    dialog = false;

    public show() {
        this.dialog = true;
    }
}
</script>
