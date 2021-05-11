<template>
    <v-container fluid>
        <v-row class="justify-center">
            <v-col cols="8">
                <v-alert v-model="editable" color="warning" type="info">
                    Editing mode <strong>on</strong>
                </v-alert>
            </v-col>
        </v-row>
        <v-card class="mx-auto" max-width="650" tile>
            <v-img src="https://ak.picdn.net/shutterstock/videos/1024413782/thumb/1.jpg">
                <v-row align="center" class="fill-height text-center">
                    <v-col class="pa-0 justify-center" cols="12">
                        <v-avatar class="profile" color="grey" size="164">
                            <v-img :src="user.imageUrl" />
                        </v-avatar>
                    </v-col>
                </v-row>
            </v-img>
            <v-card-text class="py-0">
                <v-card flat>
                    <v-container fluid class="pt-3">
                        <v-row class="text-center">
                            <v-list-item>
                                <v-list-item-content>
                                    <v-list-item-title class="title black--text">
                                        {{ user.username }}
                                    </v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ user.admin ? 'Administrator' : 'User' }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                            </v-list-item>
                        </v-row>
                        <v-row class="mt-2">
                            <v-col cols="6">
                                <v-text-field
                                    :readonly="!editable"
                                    v-model="editedUser.name"
                                    label="Name"
                                />
                                <v-text-field
                                    :readonly="!editable"
                                    v-model="editedUser.email"
                                    label="E-mail"
                                />

                                <v-text-field
                                    :readonly="!editable"
                                    v-model="editedUser.username"
                                    label="Username"
                                />

                                <v-file-input
                                    :disabled='!editable'
                                    v-model="image"
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Pick an avatar [png, jpeg, bmp]"
                                    prepend-icon="mdi-camera"
                                    label="Avatar"
                                />
                            </v-col>
                            <v-col cols="6">
                                <v-text-field
                                    :readonly="!editable"
                                    type="tel"
                                    v-model="editedUser.phoneNumber"
                                    label="Phone number"
                                />
                                <v-text-field
                                    :readonly="!editable"
                                    v-model="editedUser.address"
                                    label="Address"
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
                                            :readonly="!editable"
                                            :clearable="editable"
                                            v-model="editedUser.birthDate"
                                            label="Date of birth"
                                            v-bind="attrs"
                                            v-on="on"
                                        />
                                    </template>
                                    <v-date-picker
                                        v-model="editedUser.birthDate"
                                        @input="datepicker = false"
                                    />
                                </v-menu>

                                <v-select
                                    multiple
                                    :disabled="!editable"
                                    v-model="editedUser.languages"
                                    :items="[
                                        'Chinese',
                                        'Dutch',
                                        'English',
                                        'French',
                                        'Russian',
                                        'Spanish',
                                        'Turkish',
                                        'Wesht vloms',
                                    ]"
                                    label="Languages"
                                />
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card>
            </v-card-text>
            <v-card-actions>
                <v-spacer />
                <v-btn color="red" text>cancel</v-btn>
                <v-btn color="success" text @click="updateUser">update</v-btn>
            </v-card-actions>
        </v-card>
    </v-container>
</template>

<script lang="ts">
import { Vue } from 'vue-property-decorator';
import axios from 'axios';
import { IUser } from '../interfaces';

export default Vue.extend({
    name: 'Profile',
    data() {
        return {
            datepicker: '',
            fallbackUser: {} as IUser,
            editedUser: {} as IUser,
            image: [],
        };
    },
    mounted() {
        this.fallbackUser = this.user;
        this.editedUser = this.user;
    },
    computed: {
        user() {
            return this.$store.state.auth.user;
        },
        editable() {
            return this.$store.state.profileEditFields;
        },
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

        async updateUser() {
            this.editedUser.imageUrl = `http://localhost:3030/images/${this.image.name}`;
            this.uploadImage();
            try {
                // eslint-disable-next-line
                await this.$store.dispatch('users/patch', [
                    this.user._id,
                    { ...this.editedUser },
                    {},
                ]);
            } catch (error) {
                console.log(error);
            }
        },
    },
});
</script>
