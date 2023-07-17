<template>
    <v-navigation-drawer 
        v-model="drawer"
        class="app-navigation"
        :rail="rail"
        permanent
        touchless
        :mobile-breakpoint="0">
        <v-list-item prepend-icon="mdi-menu" class="filters-header" @click="rail = !rail">
            <template v-slot:append>
                <span class="mr-2">Advanced Filters</span>
                <v-btn
                    variant="text"
                    icon="mdi-chevron-left"
                    @click.stop="rail = !rail">
                </v-btn>
            </template>
        </v-list-item>

        <v-divider></v-divider>

        <v-list-item v-for="(filter, index) in filters" :key="index" :prepend-icon="filter.icon">
            <v-list-item-content class="text-right align-self-start">
                <!-- Case Checkbox -->
                <v-checkbox 
                    @change="checkboxUpdated" 
                    v-model="filter.value" 
                    :id="filter.id" 
                    hide-details 
                    :label="filter.title" 
                    v-if="!rail && (filter.type=='checkbox' || filter.type=='checkboxFilter')">
                </v-checkbox>
                
                <!-- Case Combobox -->
                <v-combobox 
                    v-model="filter.value" 
                    :items="filter.options" 
                    density="compact" 
                    variant="outlined" 
                    hide-details 
                    :label="filter.title" 
                    class="pt-1" 
                    v-if="!rail && filter.type=='combobox'">
                </v-combobox>
                
                <!-- Case Range slide -->
                <v-range-slider 
                    v-model="filter.value" 
                    min="0" 
                    max="100" 
                    step="1" 
                    thumb-label="always" 
                    class="pt-10" 
                    :label="filter.title" 
                    v-if="!rail && filter.type=='range'">
                </v-range-slider>
            </v-list-item-content>
        </v-list-item>

        <v-divider class="mt-2 mb-2"></v-divider>

        <!-- Search button version mini and expanded -->
        <v-list-item v-if="!rail">
            <v-list-item-content >
                <v-btn class="btn-secondary" block @click="searchFilters">
                    Search
                </v-btn>
            </v-list-item-content>
        </v-list-item>
        <v-list-item class="filter-search-button-list" v-else>
            <v-list-item-content>
                <v-btn 
                    icon="mdi-magnify" 
                    size="x-small" 
                    class="btn-secondary" 
                    @click="searchFilters">
                </v-btn>
            </v-list-item-content>
        </v-list-item>
        
    </v-navigation-drawer>
</template>


<script>
import { ref } from 'vue';
import { useStore } from 'vuex';

export default {
    props: {
        filters: Object
    },
    setup(props, { emit }) {
        const drawer = ref(true);
        const rail = ref(true);
        const store = useStore();

        const checkboxUpdated = (event) => {
            var filters = props.filters;

            for (let filter in filters) {
                if (filters[filter].type === 'checkboxFilter') {
                    if (
                        filters[filter].id !== event.target.id &&
                        event.target.checked &&
                        filters[filter].value) {
                        filters[filter].value = false;
                    } else if (
                        filters[filter].id === event.target.id &&
                        event.target.checked &&
                        !filters[filter].value) {
                        filters[filter].value = true;
                    }
                }
            }
        };

        const searchFilters = () => {
            store.dispatch('searchBooks');
        };

        return {
            drawer,
            rail,
            checkboxUpdated,
            searchFilters
        };
    }
};
</script>



