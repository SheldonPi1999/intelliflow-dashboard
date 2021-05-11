<template>
    <v-card class="mx-auto" color="grey lighten-4" max-width="800">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-palette
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Color
                </div>
                <div>
                    <span
                    class="display-2 font-weight-black"
                    v-text="'('+R+', '+G+', '+B+')'"
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
                :value="light"
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
        light: [],
        R: [0],
        G: [0],
        B: [0],
    }),

    computed: {
        lastTemp() {
            const sum = this.$data.light[4];
            return sum;
        },
    },

    created() {
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData('lightSensor');
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
                    this.$data.light = [0, 0, 0, 0, 0];
                } else {
                    this.$data.light = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }
                
                console.log(data.data[data.data.length - 1].value);

                console.log(this.$data.light);
                // this.$data.light = [10, 50, 100];
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>