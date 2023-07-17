<template>
    <v-dialog 
        v-model="$store.state.loading" 
        persistent 
        content 
        content-class="loading-dialog">
        <v-container fill-height>
            <v-layout column>
                <v-progress-circular
                    indeterminate
                    size="128"
                    width="8">
                </v-progress-circular>
            </v-layout>
        </v-container>
    </v-dialog>
</template>