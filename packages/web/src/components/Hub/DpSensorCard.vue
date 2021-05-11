<template>
    <v-card class="sensor" width="250" flat outlined>
        <v-container class="pa-0 ma-0">
            <v-row align="center" class="pa-0 ma-0">
                <v-col cols="3">
                    <v-avatar>
                        <img src="../../../src/assets/images/hubs/images.png" alt="John" />
                    </v-avatar>
                </v-col>
                <v-col cols="6" class="pa-0">
                    <v-card-text class="py-0">
                        <v-card-title class="pl-0 pb-2 sensor__title">{{ name }}</v-card-title>
                        <v-card-subtitle class="pl-0 sensor__subtitle">{{ type }}</v-card-subtitle>
                    </v-card-text>
                </v-col>
                <!--
                <v-col cols="3">
                    <v-img max-width="24px" src="@/assets/icons/trash-2.svg" />
                </v-col>
                -->
            </v-row>
        </v-container>
    </v-card>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class extends Vue {
    @Prop({ required: true, type: String })
    name!: string;

    @Prop({ required: true, type: String })
    type!: string;
}
</script>

<style lang="scss" scoped>
.sensor {
    border: 1px solid #606060;
    box-sizing: border-box;
    border-radius: 10px;

    &__title {
        // esta-importante-next-line
        font-size: 12px !important;
    }
    &__subtitle {
        font-size: 12px !important;
    }
}
</style>
