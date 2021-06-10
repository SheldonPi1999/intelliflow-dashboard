<template>
    <v-card class="mx-auto" max-width="800" :color="speed.status === 'Online' ? 'grey lighten-4' : 'red lighten-4'">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-speedometer
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Speed
                    <v-spacer></v-spacer>
                    {{ speed.hub_id }}
                    <v-spacer></v-spacer>
                    {{ speed.sensor }}
                </div>
                <div>
                    <span
                    class="display-2 font-weight-black"
                    v-text="lastSpeed"
                    ></span>
                    <strong>m/s</strong>
                </div>
            </v-row>

            <v-spacer></v-spacer>
        </v-card-title>
        <v-sheet color="transparent">
            <v-sparkline
                :key="String()"
                :smooth="16"
                :gradient="['#f72047', '#ffd200', '#1feaea']"
                :line-width="3"
                :value="speedData"
                auto-draw
                stroke-linecap="round"
            ></v-sparkline>
        </v-sheet>
    </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import apiSettings from '../../../apiSettings.json';

export default {
    props: ['speed'],

    data: () => ({
        speedData: [],
    }),

    computed: {
        lastSpeed() {
            const lastSpeed = Number(this.$data.speedData[4]);
            const lastSpeedString = (lastSpeed.toFixed(2)).toString()
            return lastSpeedString;
        },
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.speed.sensor, this.speed.hub_id);
            // console.log("Getting data");
            this.speed.status = "Online"; 
        }, 1000);
    },

    methods: {
        async getNewSensorData(id: string, hub: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                    params: {
                        sensorId: id,
                        hubId: hub,
                    },
                });
    
                if (data.data.length < 5) {
                    this.$data.speedData = [-999, -999, -999, -999, -999];
                } else {
                    this.$data.speedData = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>