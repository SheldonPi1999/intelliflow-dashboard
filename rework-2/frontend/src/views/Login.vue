<template>
    <v-row class="justify-center align-items-center h-100">
        <v-col cols="5" md="5" sm="12" xs="12" lg="4">
            <v-card v-if="toggle">
                <v-card-title class="pt-10 headline justify-center grey--text">
                    Welcome to Datapixel
                </v-card-title>
                <v-container>
                    <v-row justify="center">
                        <v-col cols="10">
                            <v-form
                                @submit.prevent="submitForm"
                                ref="form"
                                v-model="valid"
                                lazy-validation
                            >
                                <v-text-field v-model="user.email" label="E-mail" required />
                                <v-text-field v-model="user.password" label="Password" required />
                                <v-row>
                                    <v-col>
                                        <v-btn text type="submit">Login</v-btn>
                                    </v-col>
                                    <v-col class="text-right">
                                        <a @click="toggleForms"> No account yet? </a>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
            <v-card v-else>
                <v-card-title class="pt-10 headline justify-center grey--text">
                    Create an account
                </v-card-title>
                <v-card-subtitle class="text-center">
                    {{ message }}
                </v-card-subtitle>
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

                                <v-text-field
                                    v-model="newUser.username"
                                    label="Username"
                                    required
                                />

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

                                <v-file-input
                                    v-model="image"
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Pick an avatar [png, jpeg, bmp]"
                                    prepend-icon="mdi-camera"
                                    label="Avatar"
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
                                        <v-btn text type="submit">Register</v-btn>
                                    </v-col>
                                    <v-col class="text-right">
                                        <a @click="toggleForms">Already have an account?</a>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-col>
                    </v-row>
                </v-container>
            </v-card>
        </v-col>
    </v-row>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { mapActions } from 'vuex';
import { IUser } from '../interfaces/index';

export default Vue.extend({
    name: 'Login',
    data() {
        return {
            message: '',
            valid: false,
            user: {} as IUser,
            toggle: true,
            newUser: {} as IUser,
            datepicker: false,
            image: [],
        };
    },
    methods: {
        async uploadImage() {
            try {
                let formData = new FormData();
                formData.append('file', this.image);
                await axios.post('http://localhost:3030/uploads', formData, {
                    headers: {
                        'content-type': 'multipart/form-data', // do not forget this
                    },
                });
            } catch (error) {
                console.log(error);
            }
        },
        toggleForms() {
            this.toggle = !this.toggle;
        },
        ...mapActions('auth', ['authenticate']),
        submitForm() {
            this.authenticate({ strategy: 'local', ...this.user })
                .catch((error: any) => {
                    console.log(error);
                })
                .then((user: any) => {
                    this.$router.push('/');
                });
        },
        async register() {
            if (this.image.name !== undefined) {
                this.uploadImage();
                this.newUser.imageUrl = `http://localhost:3030/images/${this.image.name}`;
                try {
                    await this.$store.dispatch('users/create', this.newUser);
                    this.message = 'User created !';
                    setTimeout(() => {
                        this.toggle = !this.toggle;
                    }, 2000);
                } catch (error) {
                    this.message = error.message;
                    console.log(error);
                }
            } else {
                try {
                    await this.$store.dispatch('users/create', this.newUser);
                    this.message = 'User created !';
                    setTimeout(() => {
                        this.toggle = !this.toggle;
                    }, 2000);
                } catch (error) {
                    this.message = error.message;
                    console.log(error);
                }
            }
        },
    },
});
</script>

<style lang="scss"></style>
