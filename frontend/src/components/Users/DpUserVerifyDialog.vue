<template>
    <v-dialog v-model="dialog.model" persistent max-width="500">
        <v-card min-height="100">
            <v-card-title class="headline">
                {{ dialog.title }}
            </v-card-title>
            <v-card-text>
                {{ dialog.text }}
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="red darken-1" text @click="dialog.model = false">
                    cancel
                </v-btn>
                <v-btn :disabled="!admin" color="green darken-1" text @click="verifyUser(user)">
                    Verify
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { IUser } from '../../interfaces';

export default Vue.extend({
    props: {
        admin: {
            type: Boolean,
        },
    },
    data() {
        return {
            dialog: {
                model: false,
                title: '',
                text: '',
            },
            user: {} as IUser,
        };
    },
    methods: {
        showVerifyDialog(user: IUser) {
            this.user = user;
            if (this.admin === true) {
                this.dialog.title = `You are about to verify ${user.username}`;
                this.dialog.text = 'Are you sure you want to verify ?';
            } else {
                this.dialog.title = 'Unauthorized';
                this.dialog.text = 'You are not authorized to verify a user. Please contact IT support.';
            }

            this.dialog.model = true;
        },
        async verifyUser() {
            // eslint-disable-next-line
            await this.$store.dispatch('users/patch', [
                this.user._id,
                {
                    verified: true,
                },
                {},
            ]);
            this.dialog.model = false;
        },
    },
});
</script>

<style scoped></style>
