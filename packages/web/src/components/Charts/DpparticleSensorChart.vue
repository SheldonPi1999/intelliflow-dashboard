<template>
    <v-card class="mx-auto" color="grey lighten-4" max-width="800">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-dots-triangle
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Particle
                </div>
                <div>
                    <span
                    class="display-2 font-weight-black"
                    v-text="lastData"
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
                :value="particle"
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
        particle: [],
    }),

    computed: {
        lastData() {
            const sum = this.$data.particle[4];
            return sum;
        },
    },

    created() {
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData('particleSensor');
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
                    this.$data.particle = [0, 0, 0, 0, 0];
                } else {
                    this.$data.particle = [data.data[data.data.length - 5].value, data.data[data.data.length - 4].value, data.data[data.data.length - 3].value, data.data[data.data.length - 2].value,  data.data[data.data.length - 1].value];
                }

                console.log(data.data[data.data.length - 1].value);

                console.log(this.$data.particle);
                // this.$data.particle = [10, 50, 100];
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>