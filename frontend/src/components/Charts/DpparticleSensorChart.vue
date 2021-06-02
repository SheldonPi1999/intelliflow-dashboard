<template>
    <v-card class="mx-auto" max-width="800" :color="particle.status === 'Online' ? 'grey lighten-4' : 'red lighten-4'">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-dots-triangle
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Particle
                    <v-spacer></v-spacer>
                    {{ particle.hub_id }}
                    <v-spacer></v-spacer>
                    {{ particle.sensor }}
                </div>
                <div>
                    <span
                    class="display-1 font-weight-black"
                    v-text="'Top: ' + this.$data.particleTopData[4]"
                    ></span>
                    <strong>%</strong>
                    <span
                    class="display-1 font-weight-black"
                    v-text="' Side: ' + this.$data.particleSideData[4]"
                    ></span>
                    <strong>%</strong>
                </div>
            </v-row>

            <v-spacer></v-spacer>
        </v-card-title>
        <v-sheet color="transparent">
            <v-row>
                <v-col cols="6">
                    <v-sparkline
                        :key="String()"
                        :smooth="16"
                        :gradient="['#f72047', '#ffd200', '#1feaea']"
                        :line-width="5"
                        :value="particleTopData"
                        auto-draw
                        stroke-linecap="round"
                    ></v-sparkline>
                </v-col>
                <v-col cols="6">
                    <v-sparkline
                        :key="String()"
                        :smooth="16"
                        :gradient="['#f72047', '#ffd200', '#1feaea']"
                        :line-width="5"
                        :value="particleSideData"
                        auto-draw
                        stroke-linecap="round"
                    ></v-sparkline>
                </v-col>
            </v-row>
        </v-sheet>
    </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import apiSettings from '../../../apiSettings.json';

export default {
    props: ['particle'],

    data: () => ({
        particleTopData: [],
        particleSideData: [],
    }),

    mounted() {
        setInterval(() => {
            this.getNewTopSensorData(this.particle.sensor, this.particle.hub_id);
            this.getNewSideSensorData(this.particle.sensor, this.particle.hub_id);
        }, 1000);
    },

    methods: {
        async getNewSideSensorData(id: string, hub: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: "Side",
                    },
                });

                if (data.data.length < 5) {
                    this.$data.particleSideData = [-999, -999, -999, -999, -999];
                } else {
                    let data_5 = (data.data[data.data.length - 5].value/4095*100).toFixed();
                    let data_4 = (data.data[data.data.length - 4].value/4095*100).toFixed();
                    let data_3 = (data.data[data.data.length - 3].value/4095*100).toFixed();
                    let data_2 = (data.data[data.data.length - 2].value/4095*100).toFixed();
                    let data_1 = (data.data[data.data.length - 1].value/4095*100).toFixed();

                    this.$data.particleSideData = [parseInt(data_5), parseInt(data_4), parseInt(data_3), parseInt(data_2), parseInt(data_1)];
                }
            } catch (error) {
                console.log(error);
            }
        },
        async getNewTopSensorData(id: string, hub: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: "Top",
                    },
                });

                if (data.data.length < 5) {
                    this.$data.particleTopData = [-999, -999, -999, -999, -999];
                } else {
                    let data_5 = (data.data[data.data.length - 5].value/4095*100).toFixed();
                    let data_4 = (data.data[data.data.length - 4].value/4095*100).toFixed();
                    let data_3 = (data.data[data.data.length - 3].value/4095*100).toFixed();
                    let data_2 = (data.data[data.data.length - 2].value/4095*100).toFixed();
                    let data_1 = (data.data[data.data.length - 1].value/4095*100).toFixed();

                    this.$data.particleTopData = [parseInt(data_5), parseInt(data_4), parseInt(data_3), parseInt(data_2), parseInt(data_1)];
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>