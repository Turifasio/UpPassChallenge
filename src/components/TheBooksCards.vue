<template>
    <v-row>
        <!-- Sorter rules -->
        <v-col class="mb-2 mt-2 pl-4">
            Sort by: 
            <span v-for="(sortRule, index) in $store.state.sorterParams.orderBy.rules">
                <span v-if="index > 0" class="pl-1 pr-1">|</span>
                <a 
                    @click="sort(sortRule.value)" 
                    class="sorter" 
                    :class="sortRule.value == $store.state.sorterParams.orderBy.value ? 'active' : ''">
                    {{ sortRule.title }}
                </a>
            </span>
        </v-col>
    </v-row>
    <v-row align="start" no-gutters>
        <v-col sm="6" md="3" lg="2" class="book-card" v-for="(book, index) in pagedBooks" :key="index">
            <!-- Hover effect -->
            <v-hover v-slot="{ isHovering, props }">
                <!-- Book card -->
                <v-card 
                    class="mx-auto" 
                    :class="{ 'on-hover': isHovering }" 
                    max-width="400" 
                    :elevation="isHovering ? 6 : 2" 
                    v-bind="props">
                    <v-img
                        class="align-end text-white"
                        height="150"
                        width="100%"
                        :src="book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '/src/assets/images/book.png'"
                        :alt="book.volumeInfo.title"
                        >
                    </v-img>
                    <!-- Book card info -->
                    <v-card-title>{{ book.volumeInfo.title }}</v-card-title>
            
                    <v-card-subtitle class="pt-4">
                        <span v-for="(author, index) in book.volumeInfo.authors" :key="index">
                            <span v-if="index > 0">,</span>
                            {{ author }}
                        </span>
                        <span v-if="!book.volumeInfo.authors">
                            No Author
                        </span>
                    </v-card-subtitle>
            
                    <v-card-text>
                        <div class="h40">
                            <div v-if="book.volumeInfo.categories">Categories: 
                                <span v-for="(category, index) in book.volumeInfo.categories" :key="index">
                                    <span v-if="index > 0">,</span>
                                    {{ category }}
                                </span>    
                            </div>
                            <div v-else>&nbsp;</div>
                        </div>
                    </v-card-text>
            
                    <v-card-actions>
                        <v-dialog
                            transition="dialog-bottom-transition"
                            width="auto"
                            min-width="300px"
                            max-width="800px">
                            <template v-slot:activator="{ props }">
                                <v-btn class="btn-secondary" v-bind="props">
                                    Explore
                                </v-btn>
                            </template>

                            <!-- Open info Button -->
                            <template v-slot:default="{ isActive }">
                                <book-info-view 
                                    :book="book" 
                                    :close-on-favorite="false" 
                                    @close-dialog="isActive.value = false" 
                                    @update-favorite-books="updateFavoriteBooks">
                                </book-info-view>
                            </template>
                        </v-dialog>

                        <!-- Favorite Button -->
                        <v-btn 
                            @click="updateFavorite(book)" 
                            :color="isFavorite(book.id) ? 'red' : 'black'" 
                            icon="mdi-heart"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-hover>
        </v-col>
        <v-col v-if="!pagedBooks && $store.state.initBooks">
            <h2>Not found any result</h2>
        </v-col>
    </v-row>
    <v-pagination v-if="pagedBooks" :length="numPages" v-model="pageNo"></v-pagination>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import BookInfoView from '@/views/BookInfoView.vue';

export default {
    components: {
        BookInfoView
    },
    setup() {
        const pageNo = ref(1);
        const pageSize = ref(12);
        const favoriteBooks = ref([]);
        const store = useStore();

        //Setup var to show the total number of pages from the book search result
        const numPages = computed(() => {
            if (store.state.bookResult) {
                return Math.ceil(store.state.bookResult.length / pageSize.value);
            }
        });

        //Setup var for the books to show in actual page
        const pagedBooks = computed(() => {
            if (store.state.bookResult && store.state.bookResult.length) {
                const startIndex = (pageNo.value - 1) * pageSize.value;
                const data = [...store.state.bookResult];
                return data.splice(startIndex, pageSize.value);
            }
        });

        onMounted(() => {
            //Initial setup of favorites array var when the app is mounted
            const localStg = JSON.parse(localStorage.getItem("favoriteBooks"));

            if (!Array.isArray(localStg)) {
                localStorage.clear();
                localStorage.setItem("favoriteBooks", JSON.stringify([]));
            } else {
                favoriteBooks.value = localStg;
            }
        });

        //Method to change the sort option for the books
        const sort = (value) => {
            store.dispatch('changeOrberBy', value);
        };

        //Method to setup the favorite books in the localStorage
        const updateFavorite = (book) => {
            const localStg = JSON.parse(localStorage.getItem("favoriteBooks"));

            let isFavorite = false;

            localStg.some((storedBook, index) => {
                if (book.id == storedBook.id) {
                    localStg.splice(index, 1);
                    isFavorite = true;
                    return true;
                }
            });

            if (!isFavorite) {
                localStg.push(book);
            }
   
            localStorage.setItem("favoriteBooks", JSON.stringify(localStg));
            updateFavoriteBooks(book, !isFavorite);
        };

        //Method to add or remove favorite books from the array
        const updateFavoriteBooks = (book, add) => {
            if (add) {
                favoriteBooks.value.push(book);
            } else {
                favoriteBooks.value.some((favBook, index) => {
                    if (favBook.id == book.id) {
                        favoriteBooks.value.splice(index, 1);
                    }
                });
            }
        };

        //Method to check if a book is marked as favorite
        const isFavorite = (bookId) => {
            return favoriteBooks.value.some(book => book.id === bookId);
        };

        return {
            pageNo,
            pageSize,
            favoriteBooks,
            numPages,
            pagedBooks,
            sort,
            updateFavorite,
            updateFavoriteBooks,
            isFavorite
        };
    }
};
</script>