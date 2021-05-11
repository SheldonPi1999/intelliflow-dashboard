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
import { Component, Vue } from 'vue-property-decorator';

@Component({
    name: 'NewSensorNotification',
    components: {},
})
export default class NewSensorNotification extends Vue {
    mounted() {
        this.snackbar = true;
    }

    snackbar = false;

    text = "Hello, I'm a snackbar";
}
</script>
