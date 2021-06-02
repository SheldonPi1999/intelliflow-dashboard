<template>
    <v-card class="mx-auto" max-width="800" :color="light.status === 'Online' ? 'grey lighten-4' : 'red lighten-4'">
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
            </v-row>

            <v-spacer></v-spacer>
        </v-card-title>

        <v-sheet color="transparent">
        <div>
            <span
                class="display-1 font-weight-black ml-5"
                v-text="'Color detected: ' + detectedColor"
            ></span>
        </div>
        <div id="chart">
            <apexchart type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
        </div>
        </v-sheet>
    </v-card>
</template>

<script lang="ts">
import axios from 'axios';
import apiSettings from '../../../apiSettings.json';

export default {
    props: ['light'],

    data: () => ({
        series: [],
        chartOptions: {
            chart: {
                height: 50,
                type: 'bar',
            },
            colors: ['#ff1414', '#3dc204', '#0055ab', '#ede158', '#e07000', '#ea80ff'],
            plotOptions: {
              bar: {
                columnWidth: '70%',
                distributed: true,
              }
            },
            dataLabels: {
              enabled: false
            },
            legend: {
              show: false
            },
            yaxis: {
                show: false
            },
            xaxis: {
                categories: [
                    'Red',
                    'Green',
                    'Blue',
                    'Yellow',
                    'Orange',
                    'Violet',
                ],
                labels: {
                    style: {
                        colors: ['#ff1414', '#3dc204', '#0055ab', '#ede158', '#e07000', '#ea80ff'],
                        fontSize: '12px'
                    }
                }
            }
        },

        lightData: [],
        R_data: -999,
        G_data: -999,
        B_data: -999,
        Y_data: -999,
        O_data: -999,
        V_data: -999,
        detectedColor: "Not enough data"
    }),

    mounted() {
        setInterval(() => {
            this.getRedSensorData(this.light.sensor, this.light.hub_id, "AS726x_RED");
            this.getGreenSensorData(this.light.sensor, this.light.hub_id, "AS726x_GREEN");
            this.getBlueSensorData(this.light.sensor, this.light.hub_id, "AS726x_BLUE");
            this.getYellowSensorData(this.light.sensor, this.light.hub_id, "AS726x_YELLOW");
            this.getOrangeSensorData(this.light.sensor, this.light.hub_id, "AS726x_ORANGE");
            this.getVioletSensorData(this.light.sensor, this.light.hub_id, "AS726x_VIOLET");
            this.getDetectedColor();
        }, 1000);
    },

    methods: {
        async getRedSensorData(id: string, hub: string, extraId: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: extraId,
                    },
                });

                if (data.data.length < 5) {
                    this.$data.lightData = [0, 0, 0, 0, 0];
                } else {
                    this.$data.lightData= [(data.data[data.data.length - 5]).value, (data.data[data.data.length - 4]).value, (data.data[data.data.length - 3]).value, (data.data[data.data.length - 2]).value,  (data.data[data.data.length - 1]).value];
                }

                this.R_data = (((data.data[data.data.length - 1]).value)); // / 0xFFFFFFFF * 255).toFixed();

                console.log(this.R_data);
            } catch (error) {
                console.log(error);
            }
        },
        
        async getGreenSensorData(id: string, hub: string, extraId: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: extraId,
                    },
                });

                console.log((data.data[data.data.length - 1]).value);

                this.G_data = (((data.data[data.data.length - 1]).value)); // / 0xFFFFFFFF * 255).toFixed();

            } catch (error) {
                console.log(error);
            }
        },
        
        async getBlueSensorData(id: string, hub: string, extraId: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: extraId,
                    },
                });

                this.B_data = (((data.data[data.data.length - 1]).value)); // / 0xFFFFFFFF * 255).toFixed();

            } catch (error) {
                console.log(error);
            }
        },

        async getYellowSensorData(id: string, hub: string, extraId: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: extraId,
                    },
                });

                this.Y_data = (((data.data[data.data.length - 1]).value)); // / 0xFFFFFFFF * 255).toFixed();

            } catch (error) {
                console.log(error);
            }
        },
        
        async getOrangeSensorData(id: string, hub: string, extraId: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: extraId,
                    },
                });

                this.O_data = (((data.data[data.data.length - 1]).value));  // / 0xFFFFFFFF * 255).toFixed();

            } catch (error) {
                console.log(error);
            }
        },

        async getVioletSensorData(id: string, hub: string, extraId: string) {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), 
                {
                    params: {
                        sensorId: id,
                        hubId: hub,
                        extraId: extraId,
                    },
                });

                this.V_data = (((data.data[data.data.length - 1]).value)); // / 0xFFFFFFFF * 255).toFixed();

            } catch (error) {
                console.log(error);
            }
        },

        getDetectedColor() {
            let maxValue = Math.max(this.R_data, this.G_data, this.B_data, this.Y_data, this.O_data, this.V_data);
            if(this.R_data == maxValue) { this.detectedColor = "Red"; } 
            else if(this.G_data == maxValue) { this.detectedColor = "Green"; } 
            else if(this.B_data == maxValue) { this.detectedColor = "Blue"; } 
            else if(this.Y_data == maxValue) { this.detectedColor = "Yellow"; } 
            else if(this.O_data == maxValue) { this.detectedColor = "Orange"; } 
            else if(this.V_data == maxValue) { this.detectedColor = "Violet"; }    
            this.$data.series.pop();
            this.$data.series.push({data: [
                ((this.R_data - (0.999999999 * this.R_data)) * 20), 
                ((this.G_data - (0.999999999 * this.G_data)) * 20), 
                ((this.B_data - (0.999999999 * this.B_data)) * 20),
                ((this.Y_data - (0.999999999 * this.Y_data)) * 20),
                ((this.O_data - (0.999999999 * this.O_data)) * 20),
                ((this.V_data - (0.999999999 * this.V_data)) * 20)
            ]}); //[this.R_data, this.R_data, this.R_data, this.R_data, this.R_data, this.R_data];
        }
    },
};
</script>
