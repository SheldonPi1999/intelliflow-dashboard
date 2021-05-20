<template>
    <v-row>
        <v-col v-for="temp in tempS" :key="temp" cols="6">
            <DptempSensorChart :temp="temp"/>
        </v-col>
        <v-col v-for="light in lightS" :key="light" cols="6">
            <DplightSensorChart :light="light"/>
        </v-col>
        <v-col v-for="pressure in pressureS" :key="pressure" cols="6">
            <DppressureSensorChart :pressure="pressure"/>
        </v-col>
        <v-col v-for="particle in particleS" :key="particle" cols="6">
            <DpparticleSensorChart :particle="particle"/>
        </v-col>

        <v-col v-for="temp in testS" :key="temp" cols="6">
            <DptempSensorChart :temp="temp"/>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import DptempSensorChart from '@/components/Charts/DptempSensorChart.vue';
import DplightSensorChart from '@/components/Charts/DplightSensorChart.vue';
import DppressureSensorChart from '@/components/Charts/DppressureSensorChart.vue';
import DpparticleSensorChart from '@/components/Charts/DpparticleSensorChart.vue';
import apiSettings from '../../apiSettings.json';

@Component({
    components: {
        DptempSensorChart,
        DplightSensorChart,
        DppressureSensorChart,
        DpparticleSensorChart,
    },
})

export default class TestDashboard extends Vue {
    tempS = [];

    lightS = [];

    pressureS = [];

    particleS = [];

    testS = [];

    // eslint-disable-next-line
    async getAllSensorData() {
        try {
            const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                },
            });

            for (let i = 0; i < ((data.data).length); i += 1) {
                for (let j = 0; j < ((data.data)[i].sensors).length; j += 1) {
                    console.log((data.data)[i].new);
                    if (((data.data)[i].new) === false) {
                        if (((data.data)[i].sensors[j]).includes('temp')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                            };
                            this.tempS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('light')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                            };
                            this.lightS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('pressure')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                            };
                            this.pressureS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('particle')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                            };
                            this.particleS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('test')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                            };
                            this.testS.push(sensorInfo);
                        }
                    }
                }

                console.log(this.tempS);
            }
        } catch (error) {
            console.log(error);
        }
    }

    mounted() {
        this.getAllSensorData();
    }
}
</script>
