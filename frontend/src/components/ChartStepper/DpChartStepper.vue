<template>
    <v-dialog persistent width="700" v-model="addChartStepper">
        <v-stepper v-model="step">
            <v-stepper-header class="stepper__header">
                <v-stepper-step :complete="step > 1" step="1">
                    Chart type
                </v-stepper-step>

                <v-divider />

                <v-stepper-step :complete="step > 2" step="2">
                    Add sensors
                </v-stepper-step>

                <v-divider />

                <v-stepper-step :complete="step > 3" step="3">
                    Configure chart
                </v-stepper-step>

                <v-divider />

                <v-stepper-step :complete="step > 4" step="4">
                    Done
                </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
                <v-stepper-content step="1">
                    <v-card flat class="scroll text-center" height="450px">
                        <v-card-title class="justify-center stepper-header">
                            Pick a graph
                        </v-card-title>
                        <v-container>
                            <v-row>
                                <v-col cols="6" v-for="chart in charts" :key="chart.id">
                                    <DpChartOptionCard
                                        @click.native="updateSelection(chart)"
                                        :type="chart.type"
                                        url="line-1.png"
                                        :class="chart === selection ? 'selected' : ''"
                                    />
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>

                    <v-card-actions class="mt-4">
                        <v-spacer />
                        <v-btn @click="closeDialog()" text class="text cancel-button">
                            cancel
                            <v-img src="@/assets/icons/x-circle.svg" class="ml-2" />
                        </v-btn>
                        <v-btn
                            @click="step = 2"
                            :disabled="Object.keys(selection).length === 0"
                            text
                            class="text continue-button"
                        >
                            continue
                            <v-img src="@/assets/icons/arrow-right.svg" class="ml-2" />
                        </v-btn>
                    </v-card-actions>
                </v-stepper-content>

                <v-stepper-content step="2">
                    <v-card flat class="scroll text-center" height="450px">
                        <v-card-title class="justify-center stepper-header">
                            Pick your sensor(s)
                        </v-card-title>
                        <v-card-text class="pt-7">
                            <v-autocomplete
                                v-model="selectedSensor"
                                :allow-overflow="false"
                                :items="entries"
                                filled
                                chips
                                label="Select"
                                item-text="id"
                                item-value="id"
                            >
                                <template v-slot:item="data">
                                    <DpSensorEntry :item="data.item" />
                                </template>
                            </v-autocomplete>
                        </v-card-text>
                    </v-card>

                    <v-card-actions class="mt-4">
                        <v-spacer />
                        <v-btn @click="closeDialog()" text class="text cancel-button">
                            cancel
                            <v-img src="@/assets/icons/x-circle.svg" class="ml-2" />
                        </v-btn>
                        <v-btn
                            @click="step = 3"
                            :disabled="Object.keys(selection).length === 0"
                            text
                            class="text continue-button"
                        >
                            continue
                            <v-img src="@/assets/icons/arrow-right.svg" class="ml-2" />
                        </v-btn>
                    </v-card-actions>
                </v-stepper-content>

                <v-stepper-content step="3">
                    <v-card flat class="scroll text-center" height="450px">
                        <v-card-title class="justify-center stepper-header">
                            Configure chart
                        </v-card-title>
                        <v-card-text class="pt-7">
                            <v-row>
                                <v-col cols="6">
                                    <v-text-field
                                        type="text"
                                        label="Type of chart"
                                        :value="selection.type"
                                        disabled
                                    />
                                    <v-text-field
                                        v-model="config.xAxisLabel"
                                        type="text"
                                        label="X-axis label" />
                                    <v-text-field
                                        type="text"
                                        label="X-axis data"
                                        disabled
                                        value="Time"/>
                                    <v-text-field
                                        disabled
                                        value="1s"
                                        type="text" label="Update interval" />
                                </v-col>
                                <v-col cols="6">
                                    <v-text-field
                                        v-model="config.chartTitle"
                                        type="text"
                                        label="Chart title" />
                                    <v-text-field
                                        v-model="config.yAxisLabel"
                                        type="text"
                                        label="Y-axis label" />
                                    <v-text-field type="text"
                                        disabled
                                        label="Y-axis data" v-model="selection.sensor" />
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>

                    <v-card-actions class="mt-4">
                        <v-spacer />
                        <v-btn @click="closeDialog()" text class="text cancel-button">
                            cancel
                            <v-img src="@/assets/icons/x-circle.svg" class="ml-2" />
                        </v-btn>
                        <v-btn
                            :disabled="Object.keys(selection).length === 0"
                            text
                            class="text continue-button"
                            @click="updateConfig(config)"
                        >
                            continue
                            <v-img src="@/assets/icons/arrow-right.svg" class="ml-2" />
                        </v-btn>
                    </v-card-actions>
                </v-stepper-content>

                <v-stepper-content step="4">
                    <v-card flat class="text-center" height="450px">
                        <v-card-title class="justify-center stepper-header">
                            Creating chart
                        </v-card-title>

                        <v-btn text
                            class="text cancel-button"
                            @click="createGraph(lineChartConfig)">
                            generate graph
                        </v-btn>
                    </v-card>
                </v-stepper-content>
            </v-stepper-items>
        </v-stepper>
    </v-dialog>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator';
import axios from 'axios';
import { Cell } from '../../interfaces/index';
import DpChartOptionCard from './DpChartOptionCard.vue';
import DpSensorEntry from './DpSensorEntry.vue';
import apiSettings from '../../../apiSettings.json';
import lineChartConfig from './line';

@Component({
    components: {
        DpChartOptionCard,
        DpSensorEntry,
    },
})
export default class DpChartStepper extends Vue {
    @Prop({ required: true, type: Array })
    layout!: Cell[];

    @Prop({ required: true, type: Number })
    index!: Number;

    lineChartConfig = lineChartConfig;

    step = 1;

    addChart() {
        const item = {
            x: 0, // (this.layout.length * 3) % 12,
            y: 0, // this.layout.length + 12, // puts it at the bottom
            w: 3,
            h: 7,
            i: (this.layout.length + 1).toString(),
            static: false,
        };
        // this.demo = this.data;
        this.layout.push(item);
        // this.index += 1;
    }

    selection = {};

    selectedSensor = null;

    config = {
        xAxisLabel: '',
        chartTitle: '',
        yAxisLabel: '',
    }

    entries = [];

    created() {
        axios
            .get(('http://' + apiSettings.apiServerIP + ':' + apiSettings.apiServerPort + '/api/v1/hubs'), {
                headers: {
                    authorization: `Bearer ${localStorage.getItem('feathers-jwt')}`,
                },
            })
            .then((response: any) => {
                console.log(response);

                response.data.data.forEach((hub: any) => {
                    hub.sensors.forEach((sensor: any) => {
                        this.entries.push(sensor);
                    });
                });
            });
    }

    charts = [
        { id: 1, type: 'Line ', url: 'line-1.png' },
    ];

    get addChartStepper(): boolean {
        return this.$store.state.addChartStepper;
    }

    closeDialog(): void {
        this.selection = {};
        this.step = 1;
        this.$store.commit('toggleAddChartStepper');
    }

    // eslint-disable-next-line class-methods-use-this
    updateSelection(chart: any): void {
        this.selection = chart;
    }

    updateConfig() {
        this.lineChartConfig.title.text = this.config.chartTitle;
        this.lineChartConfig.xaxis.title.text = this.config.xAxisLabel;
        this.lineChartConfig.yaxis.title.text = this.config.yAxisLabel;
        this.step = 4;
    }

    createGraph(config) {
        this.$store.dispatch('graphs/create', {
            ref: 'lineChart1',
            sensorId: this.selectedSensor,
            config,
        });
        this.closeDialog();
    }
}
</script>

<style scoped lang="scss">
.continue-button {
    background-color: #ebebeb;
    border-radius: 4px;
}

.cancel-button {
    color: white;
    background-color: #fc2929;
    border-radius: 4px;
}

.stepper-header {
    font-family: 'Montserrat', sans-serif !important;
    font-style: normal;
    font-weight: 800;
    font-size: 36px;
    line-height: 40px;
    color: #606060;
}

.scroll {
    overflow-y: scroll;
    overflow-x: hidden;
    /* Hide scrollbar for Chrome, Safari and Opera */
    &::-webkit-scrollbar {
        display: none;
    }
    -ms-overflow-style: none; /* IE and Edge */
    scrollbar-width: none; /* Firefox */
}

.selected {
    border: 2px solid red;
}

.stepper__header {
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.135216) !important;
}
</style>
