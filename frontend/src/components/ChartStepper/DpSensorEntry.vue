<template>
    <v-list-item>
        <v-list-item-avatar>
            <img :src="require('@/assets/icons/cloud.svg')" />
        </v-list-item-avatar>
        <v-list-item-content>
            <v-list-item-title>
                {{ item.id }}
            </v-list-item-title>
            <v-list-item-subtitle>
                {{ item.type }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
                {{ item.hubId }}
            </v-list-item-subtitle>
            <v-list-item-subtitle>
                {{ item.topic }}
            </v-list-item-subtitle>
        </v-list-item-content>
    </v-list-item>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

interface Sensor {
    id: string;
    type: string;
    hubId: string;
    topic: string;
    avatar: string;
}

@Component
export default class DpSensorEntry extends Vue {
    @Prop({ required: true, type: Object })
    item!: Sensor;
}
</script>

<style scoped></style>
