<template>
    <v-stepper v-model="e1">
        <v-stepper-header>
            <v-stepper-step :complete="e1 > 1" step="1">
                Manual or Timed start/stop
            </v-stepper-step>

            <v-divider />

            <v-stepper-step :complete="e1 > 2" step="2">
                Set start/stop time
            </v-stepper-step>

            <v-divider />

            <v-stepper-step step="3">
                Choose sensors
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
                <v-card class="mb-15" flat height="395px">
                    <v-row>
                        <v-col cols="6">
                            Start-Time
                            <v-time-picker v-model="startTime" color="green lighten-1" ampm-in-title format="ampm" use-seconds />
                        </v-col>
                        <v-col cols="5">
                            End-Time
                            <v-time-picker v-model="endTime" color="red lighten-1" ampm-in-title format="ampm" full-width use-seconds />
                        </v-col>
                    </v-row>
                </v-card>

                <v-btn color="primary" @click="e1 = 3">
                    Continue with {{ startTime }} - {{ endTime }}
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="3">
                <v-card class="mb-12" color="grey lighten-1" height="200px">
                    <v-card v-for="hub in hubs" :key=hub>
                        <v-card-title> HUB: {{ hub }} </v-card-title>
                        <v-form v-model="selectedSensors" ref="form" lazy-validation>
                            <v-row>
                                <v-col v-for="sensor in sensors" :key="sensor">
                                    <v-checkbox
                                        v-model="selectedSensors"
                                        :label="`${sensor.sensor.toString()}`"
                                        :value="`${sensor.sensor.toString()}`"
                                    ></v-checkbox>
                                    Hello {{ selectedSensors }}
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-card>
                </v-card>

                <v-btn color="primary" @click="e1 = 1">
                    Continue
                </v-btn>

                <v-btn text>
                    Cancel
                </v-btn>
            </v-stepper-content>

            <v-stepper-content step="4">
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
import axios from 'axios';
import apiSettings from '../../apiSettings.json';

import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'DpTestingStepper',
})
export default class DpTestingStepper extends Vue {
    e1 = 1;

    startTime = '';
    
    endTime = '';

    hubs = [];
    sensors = [];

    selectedSensors = [];

    mounted() {
        this.getAllHubsAndSensors();
    }

    addToSetting(input:any) {
        console.log(input);
    }

    // eslint-disable-next-line
    async getAllHubsAndSensors() {
        try {
            const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                },
            });

            for (let i = 0; i < data.data.length; i++) {

                this.hubs.push(data.data[i].hub_id);

                for (let j = 0; j < data.data[i].sensors.length; j++) {
                    this.sensors.push(JSON.parse('{"hub":' + '"' + data.data[i].hub_id + '",' + '"sensor":' + '"' + data.data[i].sensors[j] + '"' + '}'));
                    // this.sensors.push(data.data[i].sensors[j]);
                }
            }

            console.log(this.hubs);

        } catch (error) {
            console.log(error);
        }
    }
}
</script>

<style scoped>
.scroll {
    overflow-y: scroll;
}
</style>
