<template>
    <v-row align="center" class="mx-4">
        <v-toolbar-title class="heading">{{ this.$route.name }}</v-toolbar-title>

        <!-- eslint-disable -->
        <v-breadcrumbs :items="this.$route.meta.breadcrumbs">
            <template v-slot:item="{ item }">
                <HomeIcon v-if="item.text === 'Dashboard'" />
                <v-breadcrumbs-item v-else :href="item.to" color="black">
                    {{ item.text }}
                </v-breadcrumbs-item>
            </template>
            <template v-slot:divider>
                <ChevronsRightIcon />
            </template>
        </v-breadcrumbs>
        <!-- <v-divider class="mb-5" vertical inset /> -->
        <v-spacer />
        <v-btn
            v-if="this.$route.name === 'Hubs'"
            @click="$refs.addHubDialog.show()"
            class="button--grey"
            text
        >
            <v-img src="@/assets/icons/plus-circle.svg" class="mr-2" />
            Add hub
        </v-btn>
        <DpAddHubDialog ref="addHubDialog" />
    </v-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { ChevronsRightIcon, SearchIcon, HomeIcon } from 'vue-feather-icons';
import DpAddHubDialog from '@/components/Dialogs/DpAddHubDialog.vue';

@Component({
    components: {
        ChevronsRightIcon,
        SearchIcon,
        HomeIcon,
        DpAddHubDialog,
    },
})
export default class DpBreadcrumbs extends Vue {}
</script>

<style scoped>
.button--grey {
    border: 1px solid transparent;
    border-radius: 10px;
    padding: 20px !important;
    background-color: #ebebeb;
}
</style>
