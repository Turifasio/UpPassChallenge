import { createStore } from "vuex";
import axios from "axios";

const store = createStore({
    state: {
        bookResult: [],
        searchUrl: null,
        initBooks: false,
        searchInputValue: 'a',
        maxResults: 40,
        loading: false,
        apiCalls: {
            search: 'https://www.googleapis.com/books/v1/volumes?q=',
            //full: '&filter=full',
            ebook: '&filter=ebooks',
            free: '&filter=free-ebooks',
            paid: '&filter=paid-ebooks',
            orderBy: '&orderBy=',
            printType: '&printType=',
            language: '&langRestrict=',
            maxResults: '&maxResults='
        },
        sorterParams: {
            orderBy: {
                rules: [{title: 'Newest', value: 'newest'}, {title: 'Relevance', value: 'relevance'}],
                value: 'newest' 
            }
        },
        filterParams: {
            /*full: {
                id: 'fullFilter',
                value: false, 
                icon: 'mdi-all-inclusive', 
                title: 'All info',
                type: 'checkboxFilter'
            },*/
            ebook: {
                id: 'ebookFilter',
                value: false, 
                icon: 'mdi-book-open-variant', 
                title: 'Only Ebooks',
                type: 'checkboxFilter'
            },
            free: {
                id: 'freeFilter',
                value: false, 
                icon: 'mdi-currency-usd-off', 
                title: 'Only free books',
                type: 'checkboxFilter'
            },
            paid: {
                id: 'paidFilter',
                value: false, 
                icon: 'mdi-currency-usd', 
                title: 'Only paid books',
                type: 'checkboxFilter'
            },
            type: {
                value: 'all', 
                icon: 'mdi-animation', 
                title: 'Print type',
                type: 'combobox',
                options: ['All', 'Books', 'Magazines']
            },
            language: {
                value: 'en', 
                icon: 'mdi-flag', 
                title: 'Language',
                type: 'combobox',
                options: ['en', 'es', 'fr', 'pt', 'th']
            },
            price: {
                value: [0,0], 
                icon: 'mdi-hand-coin', 
                title: 'Price range',
                type: 'range'
            },
        }
    },
    mutations: {
        setBooks (state, data) {
            if (!state.initBooks) {
                state.initBooks = true;
            }

            state.bookResult = data;
        },
        setUrl (state, data) {
            state.searchUrl = data;
        },
        setInputSearchValue (state, data) {
            state.searchInputValue = data;
        },
        setOrderBy (state, data) {
            state.sorterParams.orderBy.value = data;
        },
        setLoading (state, data) {
            state.loading = data;
        }
    },
    actions: {
        //This function will manage all api calls
        async searchBooks ({commit, dispatch, state}, search) {
            try {
                commit('setLoading', true);

                if (search) {
                    dispatch('setInputSearchValue', search);
                }

                dispatch('createUrl', state.apiCalls.search);
                //In case the price filter is setted up, we need to do a manual filtering over the results
                if (state.filterParams.price.value[0] != 0 || state.filterParams.price.value[1] != 0) {
                    await dispatch('searchWithPrice');
                } else {
                    const response = await axios.get(state.searchUrl);
                    commit('setBooks', response.data.items ? response.data.items : []);
                }

                commit('setLoading', false);
            } catch (error) {
                console.log(error);
            }
        },
        async searchWithPrice ({commit, state}) {
            try {
                const response = await axios.get(state.searchUrl);

                //We need to filter the results by price before setting the variable
                var books = [];
                var amount = 0;

                response.data.items.some(book => {
                    if (amount > state.maxResults) return true;
                    
                    if (book.saleInfo && book.saleInfo.listPrice && book.saleInfo.listPrice.amount >= state.filterParams.price.value[0] && book.saleInfo.listPrice.amount <= state.filterParams.price.value[1]) {
                        books.push(book);
                        amount++;
                    }
                });
                
                commit('setBooks', books);
            } catch (error) {
                console.log(error);
            }
        },
        changeOrberBy ({commit, dispatch}, value) {
            commit('setOrderBy', value);
            dispatch('searchBooks');
        },
        setInputSearchValue ({commit}, value) {
            commit('setInputSearchValue', value);
        },
        //The function will generate an api call using the actual parameters
        createUrl ({commit, state}, url) {
            url = url + state.searchInputValue;

            //Only can be set one filter type on the api call
            if (state.filterParams.ebook.value) {
                url = url + state.apiCalls.ebook;
            } else if (state.filterParams.free.value) {
                url = url + state.apiCalls.free;
            } else if (state.filterParams.paid.value) {
                url = url + state.apiCalls.paid;
            } /*else if (state.filterParams.full.value) {
                url = url + state.apiCalls.full;
            }*/

            url = url + state.apiCalls.printType + state.filterParams.type.value;
            url = url + state.apiCalls.language + state.filterParams.language.value;
            url = url + state.apiCalls.orderBy + state.sorterParams.orderBy.value;
            url = url + state.apiCalls.maxResults + state.maxResults;
            commit('setUrl', url);
        }
    }
});

export default store;
