<template>
    <v-card class="mx-auto" max-width="800" :color="pressure.status === 'Online' ? 'grey lighten-4' : 'red lighten-4'">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-gauge
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Pressure
                    <v-spacer></v-spacer>
                    {{ pressure.hub_id }}
                    <v-spacer></v-spacer>
                    {{ pressure.sensor }}
                </div>
                <div>
                    <span
                    class="display-2 font-weight-black"
                    v-text="lastPressure"
                    ></span>
                    <strong>N/m2</strong>
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
                :value="pressureData"
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
    props: ['pressure'],

    data: () => ({
        pressureData: [],
    }),

    computed: {
        lastPressure() {
            const sum = this.$data.pressureData[4];
            return sum;
        },
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.pressure.sensor, this.pressure.hub_id);
            // console.log("Getting data");
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
                    this.$data.pressureData = [0, 0, 0, 0, 0];
                } else {
                    this.$data.pressureData = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>