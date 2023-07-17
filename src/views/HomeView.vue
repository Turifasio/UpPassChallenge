<script setup>
import BookCards from '../components/TheBooksCards.vue'
import SearchInputItem from '../components/SearchInputItem.vue'
</script>

<template>
    <main>
        <v-container class="pa-0 d-sm-none">
            <search-input-item></search-input-item>
        </v-container>

        <book-cards></book-cards>
    </main>
</template>
