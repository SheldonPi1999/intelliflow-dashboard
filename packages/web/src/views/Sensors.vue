<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-data-table :headers="headers" :items="entries"></v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class Sensors extends Vue {
    dialog = false;

    entries = [];

    headers = [
        {
            text: 'Sensor',
            align: 'start',
            sortable: false,
            value: 'id',
        },
        { text: 'Type', value: 'type' },
        { text: 'Hub', value: 'hubId' },
        { text: 'Topic', value: 'topic' },
    ];

    mounted() {
        axios
            .get('http://localhost:3030/api/v1/hubs', {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                },
            })
            .then((response: any) => {
                response.data.data.forEach((hub: any) => {
                    hub.sensors.forEach((sensor: any) => {
                        this.entries.push(sensor);
                    });
                });
            });
    }
}
</script>

<style scoped></style>
