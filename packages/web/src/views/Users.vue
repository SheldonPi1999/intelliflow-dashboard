<template>
    <FeathersVuexFind service="users" :query="{}" watch="query">
        <div slot-scope="{ items: users }">
            <v-row class="justify-center">
                <v-col cols="auto" v-for="user in users" :key="user._id">
                    <DpUserCard :user="user" />
                </v-col>
            </v-row>
        </div>
    </FeathersVuexFind>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import DpUserCard from '../components/Users/DpUserCard.vue';

export default Vue.extend({
    components: {
        DpUserCard,
    },
});
</script>
