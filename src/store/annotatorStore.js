import { configureStore } from "@reduxjs/toolkit"
import { annotatorReducer } from "../slices/annotatorSlice"


export default configureStore({
    reducer: {
        annotator: annotatorReducer
    },
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActionPaths: ['payload.ref.current'],
                 ignoredPaths: ["payload.ref.current"] 
                }
        })
})