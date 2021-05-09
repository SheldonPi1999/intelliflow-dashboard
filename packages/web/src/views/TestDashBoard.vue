<template>
    <v-row>
        <v-col cols="6">
            <DptempSensorChart />
        </v-col>
        <v-col cols="6">
            <DplightSensorChart />
        </v-col>
        <v-col cols="6">
            <DppressureSensorChart />
        </v-col>
        <v-col cols="6">
            <DpparticleSensorChart />
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DptempSensorChart from '@/components/Charts/DptempSensorChart.vue';
import DplightSensorChart from '@/components/Charts/DplightSensorChart.vue';
import DppressureSensorChart from '@/components/Charts/DppressureSensorChart.vue';
import DpparticleSensorChart from '@/components/Charts/DpparticleSensorChart.vue';

@Component({
    components: {
        DptempSensorChart,
        DplightSensorChart,
        DppressureSensorChart,
        DpparticleSensorChart,
    },
})

export default class Home extends Vue {
}
</script>
