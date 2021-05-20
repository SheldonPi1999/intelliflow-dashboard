<template>
    <div>
        <FeathersVuexFind
            v-slot="{ items: hubs }"
            service="hubs"
            :params="{ query: { new: false } }"
            watch="query"
        >
            <v-row class="justify-center">
                <v-col cols="5" v-for="hub in hubs" :key="hub._id">
                    <DpHubCard :hub="hub" class="mt-5"/>
                </v-col>
            </v-row>
        </FeathersVuexFind>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DpHubCard from '@/components/Hub/DpHubCard.vue';
// import { Sensor } from '../interfaces/index';

@Component({
    name: 'ConnectedSensors',
    components: {
        DpHubCard,
    },
})
export default class ConnectedSensors extends Vue {

}
</script>
