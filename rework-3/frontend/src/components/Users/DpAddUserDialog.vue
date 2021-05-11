<template>
    <v-dialog v-model="dialog" persistent max-width="500">
        <v-card>
            <v-card-title class="pt-10 headline justify-center grey--text">
                Create an account
            </v-card-title>
            <v-container>
                <v-row justify="center">
                    <v-col cols="10">
                        <v-form
                            @submit.prevent="register"
                            ref="register-form"
                            v-model="valid"
                            lazy-validation
                        >
                            <v-text-field v-model="newUser.name" label="Name" required />

                            <v-text-field v-model="newUser.email" label="E-mail" required />

                            <v-text-field v-model="newUser.username" label="Username" required />

                            <v-text-field
                                type="password"
                                v-model="newUser.password"
                                label="Password"
                                required
                            />
                            <v-text-field
                                type="tel"
                                v-model="newUser.phoneNumber"
                                label="Phone number"
                                required
                            />
                            <v-text-field v-model="newUser.address" label="Address" required />
                            <v-select
                                v-model="newUser.gender"
                                :items="['Male', 'Female', 'Other']"
                                label="Gender"
                                required
                            />

                            <v-menu
                                v-model="datepicker"
                                :close-on-content-click="false"
                                transition="scale-transition"
                                offset-y
                                min-width="290px"
                            >
                                <template v-slot:activator="{ on, attrs }">
                                    <v-text-field
                                        clearable
                                        v-model="newUser.birthDate"
                                        label="Date of birth"
                                        readonly
                                        v-bind="attrs"
                                        v-on="on"
                                    />
                                </template>
                                <v-date-picker
                                    v-model="newUser.birthDate"
                                    @input="datepicker = false"
                                />
                            </v-menu>

                            <v-select
                                multiple
                                v-model="newUser.languages"
                                :items="[
                                    'Chinese',
                                    'Dutch',
                                    'English',
                                    'French',
                                    'Russian',
                                    'Spanish',
                                    'Turkish',
                                ]"
                                label="Languages"
                                required
                            />
                            <v-row>
                                <v-col>
                                    <v-btn
                                        @click="dialog =! dialog"
                                        text
                                        color="error"
                                        >
                                        cancel
                                    </v-btn>
                                     <v-btn text
                                        type="submit" color="success" >
                                        Register
                                    </v-btn>
                                </v-col>
                            </v-row>
                        </v-form>
                    </v-col>
                </v-row>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import Vue from 'vue';
import { IUser } from '../../interfaces';

export default Vue.extend({
    data() {
        return {
            dialog: false,
            valid: false,
            newUser: {} as IUser,
            datepicker: false,
        };
    },
    methods: {
        show() {
            this.dialog = !this.dialog;
        },
        async register(): Promise<void> {
            try {
                await this.$store.dispatch('users/create', this.newUser);
                this.dialog = false;
                this.$notification.success(`${this.newUser.username} created !`, { timer: 3 });
            } catch (error) {
                this.$notification.error(`${error.message}`, { timer: 5 });
            }
        },
    },
});
</script>

<style scoped></style>
