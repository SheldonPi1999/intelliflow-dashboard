<template>
    <div class="text-center">
        <p></p>
        <v-dialog v-model="dialog" width="800">
            <template v-slot:activator="{ on, attrs }">
                <!-- Needs to be centered mid -->
                <v-btn class="mt-5" color="grey" dark v-bind="attrs" v-on="on">
                    <v-img src="@/assets/icons/plus-circle.svg" />
                </v-btn>
            </template>
            <DpTestingStepper />
        </v-dialog>
    </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import DpTestingStepper from '@/components/DpTestingStepper.vue';

@Component({
    name: 'Testing',
    components: {
        DpTestingStepper,
    },
})
export default class Testing extends Vue {
    dialog = false;
}
</script>
