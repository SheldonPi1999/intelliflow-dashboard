<template>
    <v-stepper v-model="e1">
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
                Manual or Timed start/stop
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="e1 > 2" step="2">
                Name of step 2
            </v-stepper-step>

            <v-divider />

            <v-stepper-step step="3">
                Name of step 3
            </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
            <v-stepper-content step="1">
                <v-card class="mb-12" flat height="200px">
                    <v-row>
                        <v-col cols="6">
                            <!-- ERROR: Colors of buttons not the same!!! -->
                            <v-btn height="200px" width="100%" color="primary" @click="e1 = 3">
                                <v-card-action height="200px"> Manual </v-card-action>
                            </v-btn>
                        </v-col>
                        <v-col cols="6">
                            <v-btn height="200px" width="100%" color="primary" @click="e1 = 2">
                                <v-card-action height="200px"> Timed </v-card-action>
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-stepper-content>

            <v-stepper-content step="2">
                <v-card class="mb-12" flat height="395px">
                    <v-row>
                        <v-col cols="6">
                            Start-Time
                            <v-time-picker ampm-in-title format="ampm" use-seconds />
                        </v-col>
                        <v-col cols="6">
                            End-Time
                            <v-time-picker ampm-in-title format="ampm" full-width use-seconds />
                        </v-col>
                    </v-row>
                </v-card>

                <v-btn color="primary" @click="e1 = 3">
                    Continue
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

                <v-btn color="primary" @click="e1 = 1">
                    Continue
                </v-btn>

                <v-btn text>
                    Cancel
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
                <v-card class="mb-12" color="grey lighten-1" height="200px"></v-card>

                <v-btn color="primary" @click="e1 = 1">
                    Continue
                </v-btn>

                <v-btn text>
                    Cancel
                </v-btn>
            </v-stepper-content>
        </v-stepper-items>
    </v-stepper>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'DpTestingStepper',
})
export default class DpTestingStepper extends Vue {
    e1 = 1;
}
</script>

<style scoped>
.scroll {
    overflow-y: scroll;
}
</style>
