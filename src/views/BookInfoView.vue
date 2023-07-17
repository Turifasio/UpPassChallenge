<template>
    <v-card>
        <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn 
                icon 
                size="small"
                @click="closeDialog"><v-icon>mdi-close</v-icon></v-btn>
        </v-card-actions>
        
        <!-- Book Cover -->
        <v-img
            class="ml-4 mb-4"
            height="auto"
            width="auto"
            :src="book.volumeInfo.imageLinks ? book.volumeInfo.imageLinks.thumbnail : '/src/assets/images/book.png'"
            :alt="book.volumeInfo.title"
            >
        </v-img>
        <!-- Book Title -->
        <v-card-title class="pt-0 pb-0 text-wrap">{{ book.volumeInfo.title }}</v-card-title>

        <!-- Book Extra Info -->
        <v-card-text class="pt-0 pl-4 pr-4">
            <div v-if="book.volumeInfo.subtitle">{{ book.volumeInfo.subtitle }}</div>
            
            <!-- Authors -->
            <div v-if="book.volumeInfo.authors" class="pb-4">
                <span v-for="(author, index) in book.volumeInfo.authors" :key="index">
                    <span v-if="index > 0">,</span>
                    {{ author }}
                </span>
            </div>

            <!-- Categories -->
            <div v-if="book.volumeInfo.categories">
                <span class="font-weight-bold">Categories:</span> 
                <span v-for="(category, index) in book.volumeInfo.categories" :key="index">
                    <span v-if="index > 0">,</span>
                    {{ category }}
                </span>    
            </div>

            <!-- Publisher -->
            <div v-if="book.volumeInfo.publisher">
                <span class="font-weight-bold">Publisher:</span>
                {{ book.volumeInfo.publisher }}
            </div>

            <!-- Published Date -->
            <div v-if="book.volumeInfo.publishedDate">
                <span class="font-weight-bold">Published date:</span>
                {{ book.volumeInfo.publishedDate }}
            </div>

            <!-- Type -->
            <div v-if="book.volumeInfo.printType">
                <span class="font-weight-bold">Type:</span>
                {{ capitalize(book.volumeInfo.printType) }}
            </div>

            <!-- Pages -->
            <div v-if="book.volumeInfo.pageCount">
                <span class="font-weight-bold">Number of pages:</span>
                {{ book.volumeInfo.pageCount }}
            </div>

            <!-- Description -->
            <div v-if="book.volumeInfo.description" class="pt-4 pb-4">
                {{ book.volumeInfo.description }}
            </div>

            <v-divider></v-divider>
            <!-- Industry Identifiers -->
            <div v-if="book.volumeInfo.industryIdentifiers" class="text-caption text-grey-lighten-1"> 
                <span v-for="(identifier, index) in book.volumeInfo.industryIdentifiers" :key="index">
                    <span v-if="index > 0">,</span>
                    {{ identifier.type }} - {{ identifier.identifier }}
                </span>    
            </div>

            <v-btn 
                prepend-icon="mdi-cart" 
                color="orange" 
                target="_blank" 
                class="mt-4 mb-4" 
                size="large" 
                :href="book.volumeInfo.infoLink">
                BUY NOW!
            </v-btn>

            <!-- Favorite Button -->
            <v-btn 
                @click="updateFavorite(book)" 
                :color="isFavorite ? 'red' : 'black'" 
                icon="mdi-heart" 
                class="ml-4">
            </v-btn>
        </v-card-text>
    </v-card>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
    props: {
        book: Object,
        closeOnFavorite: Boolean
    },
    setup(props, { emit }) {
        const isFavorite = ref(false);

        //Method to convert a String to a capitalized string
        const capitalize = (name) => {
            const capitalizedFirst = name[0].toUpperCase();
            const rest = name.slice(1);

            return capitalizedFirst + rest.toLowerCase();
        };

        //Method to close the dialog
        const closeDialog = () => {
            emit('closeDialog');
        };

        //Method to update and emit the signal for add or remove the book as favorite
        const updateFavorite = (book) => {
            const localStg = JSON.parse(localStorage.getItem("favoriteBooks"));

            let isBookFavorite = false;

            if (isFavorite.value) {
                localStg.some((storedBook, index) => {
                if (book.id == storedBook.id) {
                    localStg.splice(index, 1);
                    isBookFavorite = true;
                    return true;
                }
                });
            } else {
                if (!isBookFavorite) {
                    localStg.push(book);
                }
            }

            localStorage.setItem("favoriteBooks", JSON.stringify(localStg));
            isFavorite.value = !isFavorite.value;
            emit("updateFavoriteBooks", book, !isBookFavorite);

            //If this prop is setted, the dialog also will autoclose (for myFavorites view)
            if (props.closeOnFavorite) {
                emit("closeDialog");
            }
        };

        onMounted(() => {
            //Init setup for the favorite button
            const localStg = JSON.parse(localStorage.getItem("favoriteBooks"));
            let isBookFavorite = false;

            localStg.some((storedBook) => {
                if (storedBook.id == props.book.id) {
                    isBookFavorite = true;
                    return true;
                }
            });

            isFavorite.value = isBookFavorite;
        });

        return {
            isFavorite,
            capitalize,
            closeDialog,
            updateFavorite
        };
    }
};
</script>