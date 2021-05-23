<template>
    <div class="text-center ma-2">
        <v-snackbar v-model="snackbar">
            {{ text }}

            <template v-slot:action="{ attrs }">
                <v-btn color="pink" text v-bind="attrs" @click="snackbar = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script lang="ts">
import axios from 'axios';
import { Component, Vue } from 'vue-property-decorator';
import apiSettings from '../../apiSettings.json';

Component({
    name: 'NewSensorNotification',
    components: {},
})
export default {
    data: () => ({
        notifiedNewSnackbars: [],
        notifiedAddedSnackbars: [],
        notifiedOfflineSnackbars: [],
        snackbar: false,
        text: "",
    }),

    mounted() {
        setInterval(() => {
            this.getDBHubData();
        }, 3000);
    },

    methods: {
        async getDBHubData() {
            try {
                const { data } = await axios.get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                    headers: {
                        authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                    },
                });

                for(let i = 0; i < data.data.length; i++) {
                    if(data.data[i].status === "Online" && data.data[i].new === true) {
                        if(this.notifiedNewSnackbars.includes(data.data[i].hub_id))
                        {
                            this.snackbar = false;
                            this.text = "";
                        } else {
                            console.log(this.notifiedNewSnackbars);
                            this.snackbar = true;
                            this.text = ("New hub detected: " + data.data[i].hub_id);
                            this.notifiedNewSnackbars.push(data.data[i].hub_id);
                        }
                    } else if(data.data[i].status === "Online" && data.data[i].new === false) {
                            if(this.notifiedAddedSnackbars.includes(data.data[i].hub_id))
                            {
                                this.snackbar = false;
                                this.text = "";
                            } else {
                                console.log(this.notifiedAddedSnackbars);
                                this.snackbar = true;
                                this.text = ("New hub added to dashboard: " + data.data[i].hub_id);
                                this.notifiedAddedSnackbars.push(data.data[i].hub_id);
                            }
                    } else if(data.data[i].status === "Offline" && data.data[i].new === false ) {
                            if(this.notifiedOfflineSnackbars.includes(data.data[i].hub_id))
                            {
                                this.snackbar = false;
                                this.text = "";
                            } else {
                                console.log(this.notifiedOfflineSnackbars);
                                this.snackbar = true;
                                this.text = ("Offline hub detected: " + data.data[i].hub_id);
                                this.notifiedOfflineSnackbars.push(data.data[i].hub_id);
                            }
                    }
                };
            } catch (error) {
                console.log(error);
            }
        },
    },
};
</script>
