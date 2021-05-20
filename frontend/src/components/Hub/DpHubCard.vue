<template>
    <v-card class="hub">
        <v-card-title class="hub__title">
            HUB
            <span class="hub__subtitle">#{{ hub.hub_id }} </span>
            <v-spacer />
        </v-card-title>
        <v-card-text class="hub__container">
            <v-row>
                <div v-for="sensor in hub.sensors" :key="sensor">
                    <v-col cols="12">
                        <DpSensor :name="sensor"/>
                    </v-col>
                </div>
            </v-row>
        </v-card-text>

        <v-divider class="mx-0 mt-3" />

        <v-card-actions class="pa-0">
            <v-container>
                <v-row>
                    <v-col cols="6">
                        {{hub.sensors.length}} sensors connected to {{ hub.hub_id }}
                    </v-col>
                </v-row>
            </v-container>
            <!--
            <v-btn rounded text class="px-0 mx-0 hub--bg-grey">
                <v-img max-width="24px" src="@/assets/icons/refresh-ccw.svg" />
            </v-btn>
            -->
            <v-btn rounded text class="ml-0 mr-3 hub--bg-grey" @click="deleteHub(hub)">
                <v-img max-width="24px" color="red" src="@/assets/icons/trash-2.svg" />
            </v-btn>
        </v-card-actions>
    </v-card>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import DpSensor from './DpSensorCard.vue';

@Component({
    components: {
        DpSensor,
    },
})
export default class DpHubSensors extends Vue {
    @Prop({ required: true, type: Object })
    hub!: any;

    private deleteHub(hub: any) {
        // eslint-disable-next-line
        if (confirm("Do you want to delete this hub ?")) {
            // eslint-disable-next-line
            this.$store.dispatch('hubs/remove', hub._id);
        }
    }
}
</script>

<style lang="scss">
.hub {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
        'Open Sans', 'Helvetica Neue', sans-serif;
    border-top: 7px solid #1867c0 !important;

    &__title {
        text-transform: uppercase;
    }

    &__subtitle {
        margin-left: 0.5rem;
        color: #646464;
        text-transform: uppercase;
    }

    &__container {
        height: 250px;
        overflow: scroll;
        -ms-overflow-style: none; /* IE and Edge */
        scrollbar-width: none; /* Firefox */
        &::-webkit-scrollbar {
            display: none;
        }
    }

    &--bg-grey {
        background-color: #ebebeb;
    }
}
</style>
