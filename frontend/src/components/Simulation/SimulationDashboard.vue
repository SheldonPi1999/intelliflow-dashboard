<template>
    <div>
        <h1 v-if="manual === false" class="mb-3"> Measurement time: {{ startTime }} - {{ endTime }}</h1>
        <v-btn v-if="manual && !started" class="mb-5" @click="startTimeIsNow(), started = true">Start</v-btn>
        <v-btn v-if="manual && !stopped" class="mb-5" @click="endTimeIsNow(), stopped = true">Stop</v-btn>
        <v-row>
            <v-col v-for="temp in tempS" :key="temp" cols="6">
                <DptempSensorChart :temp="temp"/>
            </v-col>

            <v-col v-for="pressure in pressureS" :key="pressure" cols="6">
                <DppressureSensorChart :pressure="pressure"/>
            </v-col>
            <v-col v-for="particle in particleS" :key="particle" cols="6">
                <DpparticleSensorChart :particle="particle"/>
            </v-col>

            <v-col v-for="test in testS" :key="test" cols="6">
                <DptestSensorChart :test="test"/>
            </v-col>

            <v-col v-for="speed in speedS" :key="speed" cols="6">
                <DpspeedSensorChart :speed="speed"/>
            </v-col>

            <v-col v-for="light in lightS" :key="light" cols="6">
                <DplightSensorChart :light="light"/>
            </v-col>
        </v-row>
    </div>
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
import apiSettings from '../../../apiSettings.json';

const Props = Vue.extend({
  props: {
    sensors: Object,

    startTime: String,

    endTime: String,

    manual: Boolean,

    simulationId: String,
  }
})

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

export default class SimulationDashboard extends Props {
    testS = [];

    tempS = [];

    lightS = [];

    pressureS = [];

    particleS = [];

    speedS = [];
    
    pushed = false;

    started = false;
    stopped = false;

    // eslint-disable-next-line
    async getAllSensorData() {
        for (let i = 0; i < (this.sensors.length); i += 1) {
            if ((this.sensors[i].sensor).includes('temp')) {
                const sensorInfo = {
                    hub_id: (this.sensors[i].hub),
                    sensor: (this.sensors[i].sensor),
                    status: "Online"
                };
                this.tempS.push(sensorInfo);
            } else if ((this.sensors[i].sensor).includes('light')) {
                const sensorInfo = {
                    hub_id: (this.sensors[i].hub),
                    sensor: (this.sensors[i].sensor),
                    status: "Online"
                };
                this.lightS.push(sensorInfo);
            } else if ((this.sensors[i].sensor).includes('pressure')) {
                const sensorInfo = {
                    hub_id: (this.sensors[i].hub),
                    sensor: (this.sensors[i].sensor),
                    status: "Online"
                };
                this.pressureS.push(sensorInfo);
            }  else if ((this.sensors[i].sensor).includes('particle')) {
                const sensorInfo = {
                    hub_id: (this.sensors[i].hub),
                    sensor: (this.sensors[i].sensor),
                    status: "Online"
                };
                this.particleS.push(sensorInfo);
            } else {
                const sensorInfo = {
                    hub_id: (this.sensors[i].hub),
                    sensor: (this.sensors[i].sensor),
                    status: "Online"
                };
                this.testS.push(sensorInfo);
            }
        }
    }

    pushDataOnTime() {
        const now = new Date();
        const yearNow = now.getFullYear();
        const monthNow = now.getMonth();
        const dateNow = now.getDate();

        let startPieces = this.startTime.split(':')
        let hoursStart, minutesStart, secondsStart;
        
        if(startPieces.length === 3) {
            hoursStart = parseInt(startPieces[0], 10);
            minutesStart = parseInt(startPieces[1], 10);
            secondsStart = parseInt(startPieces[2], 10);
        }

        // new Date(year, month, date, hours, minutes, seconds, ms)
        const startDate = new Date(yearNow, monthNow, dateNow, hoursStart, minutesStart, secondsStart, 0);

        let endPieces = this.endTime.split(':')
        let hoursEnd, minutesEnd, secondsEnd;

        if(endPieces.length === 3) {
            hoursEnd = parseInt(endPieces[0], 10);
            minutesEnd = parseInt(endPieces[1], 10);
            secondsEnd = parseInt(endPieces[2], 10);
        }

        // new Date(year, month, date, hours, minutes, seconds, ms)
        const endDate = new Date(yearNow, monthNow, dateNow, hoursEnd, minutesEnd, secondsEnd, 0);

        let start, end, working;
    
        if(startDate <= now) {
            start = true;
        } else {
            start = false
        }

        if(now >= endDate && this.pushed === false) {
            for (let i = 0; i < this.sensors.length; i++) {
                this.pushSimulationHubsAndSensors(this.sensors[i].sensor, this.sensors[i].hub, startDate, endDate);
            }
            this.pushed = true;
            console.log("Pushed to simulation!");
        };
    }
    
    // eslint-disable-next-line
    async pushSimulationHubsAndSensors(id: string, hub: string, startDate: any, endDate: any) {
        try {
            const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                params: {
                    sensorId: id,
                    hubId: hub,
                },
            });

            for (let i = 0; i < data.data.length; i++) {
                const dataPointTime = new Date(data.data[i].createdAt);
                if (dataPointTime > startDate && dataPointTime < endDate) {
                    this.$store.dispatch('simulation/create', { sensorId: data.data[i].sensorId, hubId: data.data[i].hubId, value: data.data[i].value, simulationId: this.simulationId });
                }
            }



        } catch (error) {
            console.log(error);
        }
    }    

    startTimeIsNow() {
        const startNow =  new Date();
        this.startTime = (startNow.getHours().toString()) + ":" + (startNow.getMinutes().toString()) + ":" + (startNow.getSeconds().toString());
        this.getAllSensorData();
    }

    endTimeIsNow() {
        const endNow =  new Date();
        this.endTime = (endNow.getHours().toString()) + ":" + (endNow.getMinutes().toString()) + ":" + (endNow.getSeconds().toString())
        this.pushDataOnTime();
    }

    mounted() {
        if(this.manual === false) {
            this.getAllSensorData();
            setInterval(() => {
                this.pushDataOnTime();
            }, 1000);
        }
    }
}
</script>