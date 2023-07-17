<template>
    <v-footer class="d-flex flex-column footer">
        <div class="background-primary w-100 text-center px-4 stay-connected">
            <strong>Get connected with us on social networks!</strong>

            <v-spacer></v-spacer>

            <v-btn
                v-for="icon in socialIcons"
                :key="icon"
                class="mx-4"
                :icon="icon.mdi"
                variant="plain"
                :href="icon.href"
                target="_blank"
            ></v-btn>
        </div>

        <div class="px-4 py-2 bg-black text-center w-100">
            {{ new Date().getFullYear() }} — <strong>UpPass Challenge</strong>
        </div>
    </v-footer>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const socialIcons = ref([
            { mdi: 'mdi-facebook', href: 'https://www.facebook.com/' },
            { mdi: 'mdi-twitter', href: 'https://twitter.com/' },
            { mdi: 'mdi-linkedin', href: 'https://linkedin.com' },
            { mdi: 'mdi-instagram', href: 'https://instagram.com' },
        ]);

        return {
            socialIcons
        };
    }
}
</script>