<template>
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
                                    :close-on-favorite="true" 
                                    @close-dialog="isActive.value = false" 
                                    @update-favorite-books="updateFavoriteBooks">
                                </book-info-view>
                            </template>
                        </v-dialog>

                        <!-- Favorite Button -->
                        <v-btn @click="deleteFavorite(book)" color="red" icon="mdi-heart"></v-btn>
                    </v-card-actions>
                </v-card>
            </v-hover>
        </v-col>
        <v-col v-if="!pagedBooks && $store.state.initBooks">
            <h2>You have not any book marked as favorite</h2>
        </v-col>
    </v-row>
    <v-pagination v-if="pagedBooks" :length="numPages" v-model="pageNo"></v-pagination>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import BookInfoView from '@/views/BookInfoView.vue';

export default {
    components: {
        BookInfoView
    },
    setup() {
        const pageNo = ref(1);
        const pageSize = ref(18);
        const favoriteBooks = ref([]);
        
        //Setup var to show the total number of pages from the book search result
        const numPages = computed(() => {
            if (favoriteBooks.value.length) {
                return Math.ceil(JSON.parse(localStorage.getItem("favoriteBooks")).length / pageSize.value);
            }
        });

        //Setup var for the books to show in actual page
        const pagedBooks = computed(() => {
            if (favoriteBooks.value.length) {
                const startIndex = (pageNo.value - 1) * pageSize.value;
                const data = JSON.parse(localStorage.getItem("favoriteBooks"));
                return data.splice(startIndex, pageSize.value);
            }
        });

        onMounted(() => {
            //Initial setup of favorites array var when the app is mounted
            favoriteBooks.value = JSON.parse(localStorage.getItem("favoriteBooks"));
        });

        //Method to delete the favorite books in the localStorage
        const deleteFavorite = (book) => {
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
            updateFavoriteBooks(book);
        };

        //Method to remove favorite books from the array var
        const updateFavoriteBooks = (book) => {
            favoriteBooks.value.some((favBook, index) => {
                if (favBook.id == book.id) {
                    favoriteBooks.value.splice(index, 1);
                }
            });
        };

        //Method to trigger the dialog close event
        const closeDialog = () => {
            showDialog.value = false;
        };

        return {
            pageNo,
            pageSize,
            favoriteBooks,
            numPages,
            pagedBooks,
            deleteFavorite,
            updateFavoriteBooks,
            closeDialog
        };
    }
};
</script>