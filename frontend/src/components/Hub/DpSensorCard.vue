<template>
    <v-card class="sensor" width="205" flat outlined>
        <v-container class="pa-0 ma-0">
            <v-row align="center" class="pa-0 ma-0">
                <v-col cols="3">
                    <v-avatar>
                        <img v-if="name.includes('light')" :src="playerimg[0]"/>
                        <img v-else-if="name.includes('pressure')" :src="playerimg[1]"/>
                        <img v-else-if="name.includes('temp')" :src="playerimg[2]"/>
                        <img v-else-if="name.includes('particle')" :src="playerimg[3]"/>
                        <img v-else src="../../../src/assets/images/hubs/images.jpg"/>

                    </v-avatar>

                </v-col>
                <v-col cols="9" class="pa-0">
                    <v-card-text class="py-0">
                        <v-card-title class="pl-0 pb-2 sensor__title">{{ name }}</v-card-title>
                    </v-card-text>
                </v-col>
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

    playerimg = [
        require('../../../src/assets/images/hubs/light.gif'),
        require('../../../src/assets/images/hubs/pressure.png'),
        require('../../../src/assets/images/hubs/temperature.png'),
        require('../../../src/assets/images/hubs/particle.png'),
    ];
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
