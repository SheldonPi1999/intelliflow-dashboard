<template>
    <v-row>
        <v-col cols="6">
            <v-card>
                <v-card-title>Database sensor values</v-card-title>
                <apexchart type="radialBar"
                    :options="this.chartOptions"
                    :series="this.series1"
                    ref="dbSensorRef">
                </apexchart>
            </v-card>
        </v-col>
         <v-col cols="6">
            <v-card>
                <v-card-title>Database amount of hubs</v-card-title>
                <apexchart type="radialBar"
                    :options="this.chartOptions"
                    :series="this.series2">
                </apexchart>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import axios from 'axios';
import apiSettings from '../../apiSettings.json';

export default {
    data: () => ({
        series1: [],

        series2: [],

        chartOptions: {
            chart: {
                type: 'radialBar',
                offsetY: -40,
                sparkline: {
                    enabled: true,
                },
            },

            plotOptions: {
                radialBar: {
                    startAngle: -90,
                    endAngle: 90,
                    track: {
                        background: '#e7e7e7',
                        strokeWidth: '97%',
                        margin: 5, // margin is in pixels
                    },

                    dataLabels: {
                        name: {
                            show: false,
                        },

                        value: {
                            offsetY: -2,
                            fontSize: '22px',
                        },
                    },
                },
            },

            grid: {
                padding: {
                    top: -10,
                },
            },

            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'light',
                    shadeIntensity: 0.4,
                    inverseColors: false,
                    opacityFrom: 1,
                    opacityTo: 1,
                    stops: [0, 50, 53, 91],
                },
            },

            labels: ['Average Results'],
        },
    }),

    mounted() {
        setInterval(() => {
            this.getDBSensorData();
            this.getDBHubData();
        }, 3000);
    },

    methods: {
        async getDBSensorData() {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'));
                this.$data.series1 = [(data.total/data.limit*100).toFixed(2)]
            } catch (error) {
                console.log(error);
            }
        },

        async getDBHubData() {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    },
                });
                this.$data.series2 = [(data.total/data.limit*100).toFixed(2)]
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
