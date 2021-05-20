<template>
    <v-card class="chart-option">
        <v-img :src="require(`../../assets/images/charts/${url}`)" />
        <v-card-subtitle class="bg-grey">
            {{ type }}
        </v-card-subtitle>
    </v-card>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    name: 'DpGraphOptionCard',
    props: {
        type: {
            required: true,
            type: String,
        },
        url: {
            required: true,
            type: String,
        },
    },
});
</script>

<style scoped>
.bg-grey {
    background-color: rgba(194, 194, 194, 0.1);
}

.chart-option:hover {
    cursor: pointer;
}
</style>
