import {createSlice} from "@reduxjs/toolkit";



import Annotation from "../Objects/Annotation";


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
                    state.annotations[currIndex].text = action.payload.text
                }
                
            },
            setAnnotationWidth: (state,action)=>{
                let currIndex = state.selectedAnnotationIndex;
                if(currIndex!==-1){
                    state.annotations[currIndex].width = action.payload.width
                }
                
            },
            translateAnnotationPosition: (state,action)=>{
                let annotationsList = state.annotations;
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
    setSelectedAnnotationIndex

} = annotatorSlice.actions;

const annotatorReducer = annotatorSlice.reducer;
export {annotatorReducer}
