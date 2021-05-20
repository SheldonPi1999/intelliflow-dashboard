<template>
    <!--
      US - <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      BE - <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      FR - <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      DE - <a href="https://www.flaticon.com/authors/freepik" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon"> www.flaticon.com</a>
      -->
    <v-col cols="1" class="pt-2 mt-7">
        <v-select flat v-model="language" :items="items" dense solo return-object>
            <template v-slot:selection="{ item }">
                <v-img class="mr-3" height="20px" max-width="20px" :src="item.flag"></v-img>
                {{ item.title }}
            </template>
            <template v-slot:item="{ item }">
                <v-img class="mr-3" height="20px" max-width="20px" :src="item.flag"></v-img>
                {{ item.title }}
            </template>
        </v-select>
    </v-col>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { LanguageOptions } from '../interfaces/index';

@Component({
    name: 'DpLanguagePicker',
})
export default class DpLanguagePicker extends Vue {
    iconPaths = {
        /* eslint-disable */
        be: require('@/assets/images/flags/belgium.svg'),
        us: require('@/assets/images/flags/united-states.svg'),
        fr: require('@/assets/images/flags/france.svg'),
        de: require('@/assets/images/flags/germany.svg'),
        /* eslint-enable */
    };

    language = { title: 'BE', flag: this.iconPaths.be };

    items: LanguageOptions[] = [
        { title: 'BE', flag: this.iconPaths.be },
        { title: 'FR', flag: this.iconPaths.fr },
        { title: 'DE', flag: this.iconPaths.de },
        { title: 'US', flag: this.iconPaths.us },
    ];
}
</script>

<style>
.v-input__append-inner {
    display: none !important;
}
</style>
