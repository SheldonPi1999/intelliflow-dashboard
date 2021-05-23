<template>
    <v-card class="mx-auto" max-width="800" :color="test.status === 'Online' ? 'grey lighten-4' : 'red lighten-4'">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-account-hard-hat
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    TestValue
                    <v-spacer></v-spacer>
                    {{ test.hub_id }}
                    <v-spacer></v-spacer>
                    {{ test.sensor }}
                    <v-spacer></v-spacer>
                   
                </div>
                <div>
                    <span
                    class="ml-5 display-2 font-weight-black"
                    v-text="lastTest"
                    ></span>
                    <strong>°C</strong>
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
                :value="testData"
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
    props: ['test'],

    data: () => ({
        testData: [],
    }),

    computed: {
        lastTest() {
            const sum = this.$data.testData[4];
            return sum;
        },
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.test.sensor, this.test.hub_id);
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
                    this.$data.testData = [-999, -999, -999, -999, -999];
                } else {
                    this.$data.testData = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
