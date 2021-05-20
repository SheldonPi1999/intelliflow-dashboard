<template>
    <div>
        <DpChartStepper :layout="layout" :index="index" />
        <grid-layout
            :col-num="12"
            :is-draggable="draggable"
            :is-resizable="false"
            :layout="layout"
            :row-height="30"
            :use-css-transforms="true"
            :vertical-compact="true"
        >
            <grid-item
                v-for="(item, i) in layout"
                :key="i"
                :h="item.h"
                :i="item.i"
                :static="item.static"
                :w="item.w"
                :x="item.x"
                :y="item.y"
            >
                <v-card
                    :loading="!isActive"
                    align="center"
                    height="100%"
                    flat
                    class="chart-container"
                >

                    <FeathersVuexFind service="graphs" :params="{ query: {} }" watch="query">
                        <div slot-scope="{ items: charts }">
                            <div v-for="(chart, j) in charts" :key="chart._id">
                                <v-overlay :absolute="true"
                                    :value="deleteChartOverlay" opacity="0.7">
                                <v-btn text @click="deleteChart(item.i, chart._id)">
                                    <Trash2Icon />
                                </v-btn>
                            </v-overlay>
                            <dp-chart-wrapper
                                :sensorId="chart.sensorId"
                                v-if="i === j && isActive"
                                :chartConfig="chart.config"
                                :chartType="chart.config.chart.type"/>
                            </div>
                        </div>
                    </FeathersVuexFind>
                </v-card>
            </grid-item>
        </grid-layout>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { GridItem, GridLayout } from 'vue-grid-layout';
import { MinusIcon, PlusIcon, Trash2Icon } from 'vue-feather-icons';
import DpChartStepper from '../components/ChartStepper/DpChartStepper.vue';
import { Cell } from '../interfaces/index';
import DpChartWrapper from '../components/DpChartWrapper.vue';

@Component({
    name: 'Home',
    components: {
        GridLayout,
        GridItem,
        PlusIcon,
        MinusIcon,
        Trash2Icon,
        DpChartStepper,
        DpChartWrapper,
    },
})
export default class Home extends Vue {
    get deleteChartOverlay() {
        return this.$store.state.deleteChartOverlay;
    }

    dialog = false;

    isActive = false;

    draggable = true;

    resizable = true;

    overlay = false;

    index = 0;

    layout: Cell[] = [
        {
            x: 0,
            y: 0,
            w: 6,
            h: 10,
            i: '0',
            static: false,
        },
        {
            x: 6,
            y: 0,
            w: 6,
            h: 10,
            i: '1',
            static: false,
        },
    ];

    series = [
        {
            name: 'Desktops',
            data: [1, 500, 41, 35, 51, 49, 62, 69, 91, 148],
        },
    ];

    mounted() {
        // INDEX = 6
        this.index = this.layout.length;

        setTimeout(() => {
            this.isActive = true;
        }, 2000);
    }

    deleteChart = (index: string, id: string) => {
        this.$store.dispatch('graphs/remove', id);
        // for (let i = 0; i < this.layout.length; i += 1) {
        //     if (this.layout[i].i === index) {
        //         this.layout.splice(i, 1);
        //         break;
        //     }
        // }
    };
}
</script>

<style lang="scss" scoped>
.vue-grid-layout {
    background: transparent;
}

.vue-grid-item {
    .resizing {
        opacity: 0.9;
    }

    .static {
        background: #cce;
    }

    .no-drag {
        height: 100%;
        width: 100%;
    }

    .minMax {
        font-size: 12px;
    }

    .add {
        cursor: pointer;
    }
}

.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    padding: 0 8px 8px 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>")
        no-repeat bottom right;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}

.chart-container {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.135216) !important;
    border-radius: 8px;
}
</style>
