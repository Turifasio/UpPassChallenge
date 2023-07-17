<template>
    <v-text-field
        :loading="loading"
        density="compact"
        variant="underlined"
        label="Search books"
        append-inner-icon="mdi-magnify"
        clereable
        v-model="inputValue"
        @keydown.enter="search"
        @click:append-inner="search">
    </v-text-field>
</template>

<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    setup() {
        const loaded = ref(false);
        const loading = ref(false);
        const inputValue = ref("");
        const store = useStore();

        function search() {
            if (!loading.value) {
                let searchValue = inputValue.value;
                
                if (!searchValue) {
                    //Default search value for this app
                    searchValue = 'a';
                }

                loading.value = true;
                
                store.dispatch('searchBooks', searchValue).then(() => {
                    loading.value = false;
                });
            }
        }

        return {
            loaded,
            loading,
            inputValue,
            search
        };
    }
};
</script>
