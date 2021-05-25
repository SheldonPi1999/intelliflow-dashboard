<template>
    <v-card class="mx-auto" max-width="800" :color="temp.status === 'Online' ? 'grey lighten-4' : 'red lighten-4'">
        <v-card-title>
            <v-icon :color="'indigo'" class="mr-4" size="64">
                mdi-thermometer
            </v-icon>
            <v-row align="start">
                <div class="caption grey--text text-uppercase">
                    Temperature
                    <v-spacer></v-spacer>
                    {{ temp.hub_id }}
                    <v-spacer></v-spacer>
                    {{ temp.sensor }}
                </div>
                <div>
                    <span
                    class="ml-5 display-2 font-weight-black"
                    v-text="lastTemp"
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
                :value="temperatureData"
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
    props: ['temp'],

    data: () => ({
        temperatureData: [],
    }),

    computed: {
        lastTemp() {
            const sum = this.$data.temperatureData[4];
            return sum;
        },
    },

    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.temp.sensor, this.temp.hub_id);
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

                let dataFloat32 = [];

                if (data.data.length < 5) {
                    this.$data.temperatureData = [-999, -999, -999, -999, -999];
                } else {
                    for (let i = 1; i <= 5; i++) {
                        let dataToConvert = (data.data[data.data.length - i].value);
                        let sign = (dataToConvert >>> 31) ? -1 : 1;
                        let exp = (dataToConvert >>> 23 & 0xff) - 127;
                        let mantissa = ((dataToConvert & 0x7fffff) + 0x800000).toString(2);
                        let float32 = 0
                        
                        for (let i = 0; i < mantissa.length; i += 1) { 
                            float32 += parseInt(mantissa[i]) ? Math.pow(2, exp) : 0; 
                            exp-- 
                        }

                        dataFloat32[i] = float32 * sign;
                    }
                }
                    
                    this.$data.temperatureData = [dataFloat32[5], dataFloat32[4], dataFloat32[3], dataFloat32[2], dataFloat32[1]];
            
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
