<template>
    <v-row>
        <v-col cols="6">
            <v-card max-height="400px">
                <v-card-title>Database sensor values</v-card-title>
                <apexchart type="radialBar"
                    :options="this.chartOptions"
                    :series="this.series1"
                    ref="dbSensorRef">
                </apexchart>
                <v-card min-height="55px">
                    <v-row>
                        <v-col cols="10" />
                        <v-col cols="2">
                            <v-btn rounded text class="ml-0 mr-3 mt-0 hub--bg-grey" @click="deleteDataDB()">
                                <v-img max-width="24px" color="red" src="@/assets/icons/trash-2.svg" />
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-card>
        </v-col>
         <v-col cols="6">
            <v-card max-height="400px">
                <v-card-title>Database amount of hubs</v-card-title>
                <apexchart type="radialBar"
                    :options="this.chartOptions"
                    :series="this.series2">
                </apexchart>
                <v-card min-height="55px">
                    <v-row>
                        <v-col cols="10" />
                        <v-col cols="2">
                            <v-btn rounded text class="ml-0 mr-3 mt-0 hub--bg-grey" @click="deleteHubsDB()">
                                <v-img max-width="24px" color="red" src="@/assets/icons/trash-2.svg" />
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-card>
        </v-col>
        <v-col cols="6">
            <v-card max-height="400px">
                <v-card-title>Database amount of simulation values</v-card-title>
                <apexchart type="radialBar"
                    :options="this.chartOptions"
                    :series="this.series3">
                </apexchart>
                <v-card min-height="55px">
                    <v-row>
                        <v-col cols="10" />
                        <v-col cols="2">
                            <v-btn rounded text class="ml-0 mr-3 mt-0 hub--bg-grey" @click="deleteSimulationDB()">
                                <v-img max-width="24px" color="red" src="@/assets/icons/trash-2.svg" />
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
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

        series3: [],

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
            this.getDBSimulationData();
        }, 500);
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
        

        async getDBSimulationData() {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/simulation'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    },
                });
                this.$data.series3 = [(data.total/data.limit*100).toFixed(2)]
            } catch (error) {
                console.log(error);
            }
        },

        async deleteDataDB() {
            try {
                if (confirm("Are you sure you want to delete all the sensordata?")) {
                    const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/data'), {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                        },
                    });

                    console.log(data.total);
                    console.log(data);

                    for(let i = 0; i < data.data.length; i++) {
                        this.$store.dispatch('data/remove', data.data[i]._id);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteHubsDB() {
            try {
                if (confirm("Are you sure you want to delete all hubs?")) {
                    await axios.delete(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                        },
                    });
                }
            } catch (error) {
                console.log(error);
            }
        },

        async deleteSimulationDB() {
            try {
                if (confirm("Are you sure you want to delete all the simulation data?")) {
                    const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/simulation'), {
                        headers: {
                            authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                        },
                    });

                    console.log(data.total);
                    console.log(data);

                    for(let i = 0; i < data.data.length; i++) {
                        this.$store.dispatch('simulation/remove', data.data[i]._id);
                    }
                }
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
