import {createSlice} from "@reduxjs/toolkit";



import Annotation from "../Objects/Annotation";
import {produce} from "immer";


export const annotatorSlice = createSlice(
    {
        name:"annotator",
        initialState: {
            annotations:[],
            selectedAnnotationIndex: -1,
            scrollPos:0,
            },
        reducers: {
            setScrollPos: (state,action)=>{
                let pos = action.payload.scrollPos;
                state.scrollPos = pos;
            },
            addAnnotation: (state,action)=>{
                state.annotations.push(action.payload.annotation);

            },
            setAnnotationText: (state,action)=>{
                let currIndex = state.selectedAnnotationIndex;
                if(currIndex!==-1){
                    state.annotations[currIndex].text = action.payload.text;
                }
                
            },
            backspaceAnnotationText: (state,action)=>{
                let currIndex = state.selectedAnnotationIndex;
                if(currIndex!==-1){
                    state.annotations[currIndex].text = state.annotations[currIndex].text.slice(0,-1)
                }
                
            },
            removeAnnotationText: (state,action)=>{
                let currIndex = state.selectedAnnotationIndex;
                if(currIndex!==-1){
                    state.annotations[currIndex].text = "";
                }
                
            },
            setAnnotationWidth: (state,action)=>{
                let currIndex = state.selectedAnnotationIndex;
                if(currIndex!==-1){
                    state.annotations[currIndex] ={ ...state.annotations[currIndex],width:action.payload.width}
                    console.log(state.annotations[currIndex]);
                }
                
            },
            translateAnnotationPosition: (state,action)=>{
                
                state.annotations.map((ann,i)=>{
                    // console.log(ann.position);
                    state.annotations[i].position = state.annotations[i].position - action.payload.change
                    return true;
                })
                console.log(state,"----------");
                
                
            },
            deleteAnnotation: (state,action)=>{
                
                state.annotations = state.annotations.filter((annotation,i)=>{return state.selectedAnnotationIndex!==i})
                state.selectedAnnotationIndex = -1;
            
                
            },
            setSelectedAnnotationIndex: (state,action)=>{
                
                if(state.selectedAnnotationIndex !== action.payload.index){
                    state.selectedAnnotationIndex = action.payload.index;
                    console.log(`updated here by ${action.payload.index}`);
                }else{
                    state.selectedAnnotationIndex = -1;
                }
            }
            

        }
    }
)


export const {
    setScrollPos,
    addAnnotation,
    setAnnotationText,
    setAnnotationWidth,
    translateAnnotationPosition,
    deleteAnnotation,
    setSelectedAnnotationIndex,
    removeAnnotationText,
    backspaceAnnotationText

} = annotatorSlice.actions;

const annotatorReducer = annotatorSlice.reducer;
export {annotatorReducer}
