<template>
    <v-row>
        <v-col v-for="temp in tempS" :key="temp" cols="6">
            <DptempSensorChart :temp="temp"/>
        </v-col>
        <v-col v-for="pressure in pressureS" :key="pressure" cols="6">
            <DppressureSensorChart :pressure="pressure"/>
        </v-col>

        <v-col v-for="test in testS" :key="test" cols="6">
            <DptestSensorChart :test="test"/>
        </v-col>

        <v-col v-for="speed in speedS" :key="speed" cols="6">
            <DpspeedSensorChart :speed="speed"/>
        </v-col>

        <v-col v-for="particle in particleS" :key="particle" cols="6">
            <DpparticleSensorChart :particle="particle"/>
        </v-col>
        
        <v-col v-for="light in lightS" :key="light" cols="6">
            <DplightSensorChart :light="light"/>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import DptestSensorChart from '@/components/Charts/DptestSensorChart.vue';
import DptempSensorChart from '@/components/Charts/DptempSensorChart.vue';
import DplightSensorChart from '@/components/Charts/DplightSensorChart.vue';
import DppressureSensorChart from '@/components/Charts/DppressureSensorChart.vue';
import DpparticleSensorChart from '@/components/Charts/DpparticleSensorChart.vue';
import DpspeedSensorChart from '@/components/Charts/DpspeedSensorChart.vue';
import apiSettings from '../../apiSettings.json';

@Component({
    components: {
        DptestSensorChart,
        DptempSensorChart,
        DplightSensorChart,
        DppressureSensorChart,
        DpparticleSensorChart,
        DpspeedSensorChart,
    },
})

export default class TestDashboard extends Vue {
    testS = [];

    tempS = [];

    lightS = [];

    pressureS = [];

    particleS = [];

    speedS = [];

    virtual = [];

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
                    if (((data.data)[i].new) === false) {
                        if (((data.data)[i].sensors[j]).includes('temp')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.tempS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('light')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.lightS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('pressure')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.pressureS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('particle')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.particleS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('speed')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.speedS.push(sensorInfo);
                        } else {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.testS.push(sensorInfo);
                        }
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    }

        async getVirtualSensorData() {
        try {
            const { data } = await axios.get('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data');

            for (let i = 0; i < ((data.data).length); i += 1) {
                if(((data.data)[i].sensorId).includes("VIRTUAL")) {
                    if (((data.data)[i].sensorId).includes("temp")) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hubId),
                                sensor: ((data.data)[i].sensorsId),
                                status: "Online",
                            };
                            if (!(this.virtual.includes(((data.data)[i].sensorId)))) {
                                this.virtual.push(((data.data)[i].sensorId)); 
                                this.tempS.push(sensorInfo);
                            }
                    } else if (((data.data)[i].sensorId).includes("light")) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hubId),
                                sensor: ((data.data)[i].sensorsId),
                                status: "Online",
                            };
                            if (!(this.virtual.includes(((data.data)[i].sensorId)))) {
                                this.virtual.push(((data.data)[i].sensorId)); 
                                this.lightS.push(sensorInfo);
                            }
                    } else if (((data.data)[i].sensorId).includes("pressure")) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hubId),
                                sensor: ((data.data)[i].sensorsId),
                                status: "Online",
                            };
                            if (!(this.virtual.includes(((data.data)[i].sensorId)))) {
                                this.virtual.push(((data.data)[i].sensorId)); 
                                this.pressureS.push(sensorInfo);
                            }
                    } else if (((data.data)[i].sensorId).includes("particle")) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hubId),
                                sensor: ((data.data)[i].sensorsId),
                                status: "Online",
                            };
                            if (!(this.virtual.includes(((data.data)[i].sensorId)))) {
                                this.virtual.push(((data.data)[i].sensorId)); 
                                this.particleS.push(sensorInfo);
                            }
                    } else if (((data.data)[i].sensorId).includes("speed")) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hubId),
                                sensor: ((data.data)[i].sensorId),
                                status: "Online",
                            };
                            if (!(this.virtual.includes(((data.data)[i].sensorId)))) {
                                this.virtual.push(((data.data)[i].sensorId));
                                this.speedS.push(sensorInfo);   
                            }
                    } else {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hubId),
                                sensor: ((data.data)[i].sensorsId),
                                status: "Online",
                            };
                            if (!(this.virtual.includes(((data.data)[i].sensorId)))) {
                                this.virtual.push(((data.data)[i].sensorId)); 
                                this.testS.push(sensorInfo);
                            }
                        }
                }
                /*
                for (let j = 0; j < ((data.data)[i].sensors).length; j += 1) {
                    console.log((data.data)[i].new);
                    if (((data.data)[i].new) === false) {
                        if (((data.data)[i].sensors[j]).includes('temp')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.tempS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('light')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.lightS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('pressure')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.pressureS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('particle')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.particleS.push(sensorInfo);
                        } else if (((data.data)[i].sensors[j]).includes('speed')) {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.speedS.push(sensorInfo);
                        } else {
                            const sensorInfo = {
                                hub_id: ((data.data)[i].hub_id),
                                sensor: ((data.data)[i].sensors[j]),
                                status: (data.data)[i].status,
                            };
                            this.testS.push(sensorInfo);
                        }
                    }
                } */
                
            }
        } catch (error) {
            console.log(error);
        }
    }

    mounted() {
        this.getAllSensorData();
        this.getVirtualSensorData();
    }
}
</script>
