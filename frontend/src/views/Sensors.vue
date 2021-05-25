<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-data-table :headers="headers" :items="entries"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import apiSettings from '../../apiSettings.json';
@Component
export default class Sensors extends Vue {
    dialog = false;

    entries = [];

    diffInTime = [];

    headers = [
        { text: 'Hub', align: 'start', sortable: true, value: 'hubID'},
        { text: 'Type', value: 'type' },
        { text: 'Task', value: 'task' },
        { text: 'Topic', value: 'topic' },
        { text: 'Last value', value: 'timeSinceLastData' },
    ];

    mounted() {
        axios
            .get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                },
            })
            .then((response: any) => {
                response.data.data.forEach((hub: any) => {
                    if ((hub.new) === false) {
                        hub.sensors.forEach((sensor: any) => {
                            let typeOfSensor;

                            console.log(sensor);

                            if (sensor.includes('test')) {
                                typeOfSensor = 'Testsensor';
                            } else if (sensor.includes('light')) {
                                typeOfSensor = 'Lightsensor';
                            } else if (sensor.includes('temp')) {
                                typeOfSensor = 'Tempsensor';
                            } else if (sensor.includes('pressure')) {
                                typeOfSensor = 'Pressuresensor';
                            } else if (sensor.includes('particle')) {
                                typeOfSensor = 'Particlesensor';
                            } else {
                                typeOfSensor = 'Unknown sensor: "Add sensor to Sensors.vue"';
                            }

                            axios
                                .get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                                    params: {
                                        sensorId: sensor,
                                    },
                                })
                                .then((response: any) => {
                                    if (response.data.data.length > 0) {
                                        const lastDataTime = new Date(response.data.data[response.data.total-1].createdAt)
                                        const now = new Date();

                                        const diff =  Math.floor((now - lastDataTime) / 1e3);
                                        const lastValue = response.data.data[response.data.total-1].value;

                                        this.entries.push({ 
                                            hubID: hub.hub_id, 
                                            type: typeOfSensor, 
                                            task: sensor, 
                                            topic: ("intelliflow>" + hub.hub_id + ">" + sensor + ">data>"),
                                            timeSinceLastData: lastValue + " (" + diff + " seconds ago)",
                                        });
                                    } else {
                                        this.entries.push({ 
                                            hubID: hub.hub_id, 
                                            type: typeOfSensor, 
                                            task: sensor, 
                                            topic: ("intelliflow>" + hub.hub_id + ">" + sensor + ">data>"),
                                            timeSinceLastData: "No recorded values.",
                                        });
                                    }
                            });
                        });
                    }
                });
            });
    }
}
</script>

<style scoped></style>
