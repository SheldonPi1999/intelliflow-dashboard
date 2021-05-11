<template>
    <v-card class="mx-auto" color="grey lighten-4" max-width="800">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-gauge
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Pressure
                </div>
                <div>
                    <span
                    class="display-2 font-weight-black"
                    v-text="lastTemp"
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
                :value="pressure"
                auto-draw
                stroke-linecap="round"
            ></v-sparkline>
        </v-sheet>
    </v-card>
</template>

<script lang="ts">
import axios from 'axios';

export default {
    data: () => ({
        pressure: [],
    }),

    computed: {
        lastTemp() {
            const sum = this.$data.pressure[4];
            return sum;
        },
    },

    created() {
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData('pressureSensor');
            console.log("Getting data");
        }, 3000);
    },

    methods: {
        async getNewSensorData(id: string) {
            try {
                const { data } = await axios.get('http://localhost:3030/api/v1/data', {
                    params: {
                        sensorId: id,
                    },
                });
    
                if (data.data.length < 5) {
                    this.$data.pressure = [0, 0, 0, 0, 0];
                } else {
                    this.$data.pressure = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }
                
                console.log(data.data[data.data.length - 1].value);

                console.log(this.$data.pressure);
                // this.$data.pressure = [10, 50, 100];
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>