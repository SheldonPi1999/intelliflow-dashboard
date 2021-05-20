<template>
    <div>
        <v-card class="mx-auto shadow" flat max-width="360"
            :disabled="currentUser._id === user._id">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4">
                        {{ user._id }}
                    </div>
                    <v-list-item-title class="headline mb-1">
                        {{ user.name }}
                    </v-list-item-title>
                    <v-list-item-subtitle>
                        {{ user.email }}
                    </v-list-item-subtitle>
                </v-list-item-content>
                <v-list-item-avatar tile size="80" color="grey">
                    <v-img :src="user.imageUrl" />
                </v-list-item-avatar>
            </v-list-item>
            <v-card-actions>
                <v-chip
                    @click="$refs.verifyDialog.showVerifyDialog(user)"
                    v-if="!user.verified"
                    class="ma-2"
                    color="warning"
                    outlined
                    label
                >
                    Verify
                </v-chip>
                <v-chip v-else class="ma-2" color="success" outlined label>
                    Verified
                </v-chip>
                <v-spacer />
                <Trash2Icon
                    v-if="currentUser.admin"
                    @click="$refs.deleteDialog.showDeleteDialog(user)"
                    class="mr-2 link" />
            </v-card-actions>
        </v-card>

        <DpUserVerifyDialog ref="verifyDialog" :admin="currentUser.admin"/>
        <DpUserDeleteDialog ref="deleteDialog" :admin="currentUser.admin"/>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Trash2Icon } from 'vue-feather-icons';
import { IUser } from '../../interfaces';
import DpUserVerifyDialog from './DpUserVerifyDialog.vue';
import DpUserDeleteDialog from './DpUserDeleteDialog.vue';

export default Vue.extend({
    components: {
        Trash2Icon,
        DpUserVerifyDialog,
        DpUserDeleteDialog,
    },
    props: {
        user: {
            type: Object as () => IUser,
        },
    },
    computed: {
        currentUser(): IUser {
            return this.$store.state.auth.user;
        },
    },
});
</script>

<style scoped>
.link {
    cursor: pointer;
}
</style>
