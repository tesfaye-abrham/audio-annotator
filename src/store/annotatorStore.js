import { configureStore } from "@reduxjs/toolkit"
import { annotatorReducer } from "../slices/annotatorSlice"


export default configureStore({
    reducer: {
        annotator: annotatorReducer
    }
})