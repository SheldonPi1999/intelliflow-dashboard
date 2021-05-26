<template>
    <div class="text-center">
        <p></p>
        <v-dialog v-if="e1 !== 5" v-model="dialog" width="850">
            <template v-slot:activator="{ on, attrs }">
                <v-btn class="mt-5" color="grey" dark v-bind="attrs" v-on="on">
                    <v-img src="@/assets/icons/plus-circle.svg" />
                </v-btn>
            </template>
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

                    <v-stepper-step :complete="e1 > 3" step="3">
                        Choose sensors
                    </v-stepper-step>

                    <v-divider />

                    <v-stepper-step :complete="e1 > 4" step="4">
                        Simulation name
                    </v-stepper-step>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <v-card class="mb-12" flat height="200px">
                            <v-row>
                                <v-col cols="6">
                                    <!-- ERROR: Colors of buttons not the same!!! -->
                                    <v-btn height="200px" width="100%" color="primary" @click="e1 = 3, manual = true">
                                        <v-card-action height="200px"> Manual </v-card-action>
                                    </v-btn>
                                </v-col>
                                <v-col cols="6">
                                    <v-btn height="200px" width="100%" color="primary" @click="e1 = 2, manual = false">
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
                                    <p>Start-Time</p>
                                    <v-time-picker v-model="startTime" color="green lighten-1" ampm-in-title format="ampm" use-seconds />
                                </v-col>
                                <v-col cols="5">
                                    <p>End-Time</p>
                                    <v-time-picker v-model="endTime" color="red lighten-1" ampm-in-title format="ampm" full-width use-seconds />
                                </v-col>
                            </v-row>
                        </v-card>
                        <v-btn @click="e1 = 1">
                            Back
                        </v-btn>
                        <v-btn color="primary" @click="e1 = 3, clearSensors()">
                            Continue with {{ startTime }} - {{ endTime }}
                        </v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="3">
                        <v-card class="mb-5 hub__container" color="grey lighten-1" height="350px" flat>
                            <v-card v-for="hub in hubs" :key=hub flat>
                                <v-card-title> HUB: {{ hub }} </v-card-title>
                                <v-card-text>
                                    <v-row class="sensorsChoice__container">
                                        <div v-for="(sensor, index) in sensors" :key="sensor">
                                            <v-col v-if="sensor.hub === hub">
                                                <v-container fluid>
                                                    <v-checkbox 
                                                        v-model="selectedSensorsIndex" 
                                                        :label="`${sensor.sensor.toString()}`"
                                                        :value="`${index}`"
                                                    ></v-checkbox>
                                                </v-container>
                                            </v-col>
                                        </div>
                                    </v-row>
                                </v-card-text>
                            </v-card>
                        </v-card>
                        <v-btn @click="e1 = 2">
                            Back
                        </v-btn>
                        <v-btn color="primary" @click="e1 = 4">
                            Continue
                        </v-btn>
                    </v-stepper-content>

                    <v-stepper-content step="4">
                        <v-text-field
                            v-model="simulationId"
                            label="Give simulation ID"
                            clearable
                        ></v-text-field>
                        <v-btn @click="e1 = 2">
                            Back
                        </v-btn>
                        <v-btn color="primary" @click="IndexToSensor(), dialog = false, e1 = 5">
                            Continue
                        </v-btn>
                    </v-stepper-content>
                </v-stepper-items>
            </v-stepper>
        </v-dialog>
        <SimulationDashboard v-if="e1 === 5" class="mt-5" :sensors="selectedSensors" :startTime="startTime" :endTime="endTime" :manual="manual" :simulationId="simulationId"/>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import apiSettings from '../../apiSettings.json';
import { Component, Vue } from 'vue-property-decorator';
import SimulationDashboard from '@/components/Simulation/SimulationDashboard.vue';

@Component({
    name: 'Testing',
    components: {
        SimulationDashboard,
    },
})

export default class Testing extends Vue {
    dialog = false;

    manual = false;

    e1 = 1;

    startTime = '';
    
    endTime = '';

    simulationId = '';

    hubs = [];
    sensors = [];

    selectedSensorsIndex = [];
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

    IndexToSensor() {
        for (let i = 0; i < this.selectedSensorsIndex.length; i++) {
            this.selectedSensors.push(this.sensors[this.selectedSensorsIndex[i]]);
        }
    }  
    
    clearSensors() {
        this.selectedSensors = [];
    }
}
</script>

<style lang="scss">
.hub {
    &__container {
        height: 250px;
        overflow: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            display: none;
        }
    }
}
</style>