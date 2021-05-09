<template>
    <v-dialog v-model="dialog" persistent max-width="550" scrollable>
        <v-card>
            <v-card-title class="pt-10 headline justify-center grey--text">
                Function is not available yet.
            </v-card-title>
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

@Component
export default class DpCliDialog extends Vue {
    dialog = false;

    public show() {
        this.dialog = true;
    }
}
</script>
