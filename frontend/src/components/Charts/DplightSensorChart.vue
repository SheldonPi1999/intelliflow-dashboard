<template>
    <v-card class="mx-auto" color="grey lighten-4" max-width="800">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-palette
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Color
                    <v-spacer></v-spacer>
                    {{ light.hub_id }}
                    <v-spacer></v-spacer>
                    {{ light.sensor }}
                </div>
                <div>
                    <span
                    class="display-2 font-weight-black"
                    v-text="'('+lastR+', '+lastG+', '+lastB+')'"
                    ></span>
                    <strong>RGB</strong>
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
                :value="lightData"
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
    props: ['light'],

    data: () => ({
        lightData: [],
        lastR: [0],
        lastG: [0],
        lastB: [0],
    }),

    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.light.sensor, this.light.hub_id);
        }, 1000);
    },

    methods: {
        async getNewSensorData(id: string, hub: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                    },
                });

                if (data.data.length < 5) {
                    this.$data.lightData = [0, 0, 0, 0, 0];
                } else {
                    this.$data.lightData= [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }

                this.$data.lastR = this.$data.lightData[4].R;
                this.$data.lastG = this.$data.lightData[4].G;
                this.$data.lastB = this.$data.lightData[4].B;

            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
