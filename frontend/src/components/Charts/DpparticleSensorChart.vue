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
                    class="display-2 font-weight-black"
                    v-text="lastParticle"
                    ></span>
                    <strong>**</strong>
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
                :value="particleData"
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
    props: ['particle'],

    data: () => ({
        particleData: [],
    }),

    computed: {
        lastParticle() {
            const sum = this.$data.particleData[4];
            return sum;
        },
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.particle.sensor, this.particle.hub_id);
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
                    this.$data.particleData = [0, 0, 0, 0, 0];
                } else {
                    this.$data.particleData = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>