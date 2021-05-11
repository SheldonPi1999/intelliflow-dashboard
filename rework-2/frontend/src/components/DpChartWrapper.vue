<template>
    <apexchart
        :ref="sensorId === 'SENSOR_001' ? 'SENSOR_001' : 'SENSOR_002'"
        :options="chartConfig"
        :series="series"
        height="375px"
        width="95%"
        :type="chartType"
    />
</template>

<script lang="ts">
import axios from 'axios';
import Vue from 'vue';

export default Vue.extend({
    props: {
        sensorId: {
            type: String,
        },
        chartType: {
            type: String,
        },
        chartConfig: {
            type: Object,
        },
    },
    data() {
        return {
            series: [],
            data: [],
            timestamps: [],
        };
    },
    mounted() {
        setInterval(() => {
            this.getNewSensorData(this.sensorId);
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

                this.data.push(data.data[data.data.length - 1].value);
                this.timestamps.push(new Date().toUTCString());

                if (this.data.length > 15) {
                    this.$data.data.shift();
                    this.$data.timestamps.shift();
                }
                this.updateChart();
            } catch (error) {
                console.log(error);
            }
        },
        updateChart() {
            if (this.sensorId === 'SENSOR_002') {
                this.$refs.SENSOR_002.updateSeries([
                    {
                        data: this.data,
                    },
                ]);
                // @ts-ignore
                this.$refs.SENSOR_002.updateOptions({
                    xaxis: {
                        categories: this.timestamps,
                    },
                });
            } else {
                // @ts-ignore
                this.$refs.SENSOR_001.updateSeries([
                    {
                        data: this.data,
                    },
                ]);
                // @ts-ignore
                this.$refs.SENSOR_001.updateOptions({
                    xaxis: {
                        categories: this.timestamps,
                    },
                });
            }
        },
    },
});
</script>

<style scoped></style>
