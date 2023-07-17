<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Filters from './components/TheFilters.vue'
import TheFooter from './components/TheFooter.vue'
import SearchInputItem from './components/SearchInputItem.vue'
import LoadingItem from './components/TheLoadingItem.vue'
</script>

<template>
    <v-app>
        <v-app-bar elevation="1" density="compact">
            <router-link to="/"><img alt="Challenge logo" class="logo" src="@/assets/images/logo.png"/></router-link>
            <nav class="header-menu">
                <router-link to="/">Home</router-link>
                <router-link to="/myBooks">My Books</router-link>
            </nav>
            <v-container class="d-none d-sm-block">
                <search-input-item></search-input-item>
            </v-container>
        </v-app-bar>
        
        <!-- Filters for the books -->
        <v-card clipped>
            <filters :filters="$store.state.filterParams"/>
        </v-card>

        <v-main>
            <v-container fluid class="main-content">
                <router-view v-slot="{ Component }">
                    <transition name="page-transition" mode="out-in">
                        <component :is="Component"></component>
                    </transition>
                </router-view>
            </v-container>
        </v-main>
        
        <loading-item></loading-item>
        <the-footer></the-footer>
    </v-app>
</template>

<script>
    import BookInfoView from '@/views/BookInfoView.vue';

    export default {
        created() {
            //First time load from API to set initial book list
            if (!this.$store.state.bookResult.length) {
                this.$store.dispatch('searchBooks');
            }
        }
    }
</script>
