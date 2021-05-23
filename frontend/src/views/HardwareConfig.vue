<template>
    <v-row>
        <v-col cols="6" v-for="hub in hubs" :key="hub">
            <v-data-table :headers="headers" :items="entries"></v-data-table>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import axios from 'axios';
import apiSettings from '../../apiSettings.json';

export default {
    data: () => ({
        hubs: ["ESP_ID_001", "ESP_ID_002"],

        headers: [
            { text: 'Sensors', align: 'start', sortable: true, value: 'sensor'},
            { text: 'Pin number', value: 'pinNumber' },
        ],

        entries: [
            { 
                sensor: "Hallo",
                pinNumber: "Hallo",
            }
        ],
    }),

    mounted() {
        setInterval(() => {
        }, 500);
    },

    methods: {
    },
};
</script>