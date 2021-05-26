<template>
    <v-row>
        <v-col cols="6" v-for="(hub, index) in hubs" :key="hub">
            <v-data-table :headers="headers" :items="hubsData[index+1]"></v-data-table>
        </v-col>
    </v-row>
</template>

<script lang="ts"> 
import axios from 'axios';
import apiSettings from '../../apiSettings.json';

export default {
    data: () => ({
        hubs: [],

        hubsData: [
            { 
                hubId: "Hallo",
                sensorId: "Hallo",
                pinMap: "Yow"
            }
        ],

        headers: [
            { text: 'Sensor', align: 'start', sortable: true, value: 'sensorId'},
            { text: 'Hub ID', value: 'hubId'},
            { text: 'Pin connection', value: 'pinMap' },
        ],

        entries: [],
    }),

    mounted() {
        this.getHubs();
    },

    methods: {
        async getHubs() {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    }, 
                });

                for (let i = 0; i < data.data.length; i++) {
                    this.getEspConfig(data.data[i].hub_id);
                    this.hubs.push(data.data[i].hub_id);
                }
            } catch (error) {
                console.log(error);
            }
        },

        async getEspConfig(hub: String) {
        try {
            const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/esp_config'), {
                params: {
                    hubId: hub,
                }, 
            });

            console.log('Wassup');
            this.hubsData.push(JSON.parse('{"hubId":' + '"' + hub + '",' + '"sensorId":' + '"' + data.data[0].sensorId + '",' + '"pinMap":' + '"' + data.data[0].pinMap + '"' + '}'));
            console.log(this.hubsData);

        } catch (error) {
            console.log(error);
        }
    }    
    },
};
</script>