import { useEffect, useRef, useState } from "react";
import "./AnnotatorForm.css"
import { useSelector,useDispatch } from "react-redux";

// import Annotation from "../Objects/Annotation";
import {setScrollPos,addAnnotation,setAnnotationText,setAnnotationWidth,translateAnnotationPosition,deleteAnnotation,setSelectedAnnotationIndex} from "../slices/annotatorSlice";


const AnnotatorForm = (props)=>{
    const { annotations, selectedAnnotationIndex,scrollPos} = useSelector(state =>{return state.annotator})

    const dispatch = useDispatch();
    // const [translatePos,setTranslatePos] = useState(0)
    

    
    const scrollA = useRef(null)
    const scrollB = useRef(null)
    const audiowave = useRef(null)
    const annotation = useRef(null)
    const pointer = useRef(null)



    const handleScroll = (e)=>{
        
        const position =scrollA.current.scrollLeft ;
        // const width = audiowave.current.getBoundingClientRect().width;
        const resultant = position - scrollPos
        // setScrollPos((pos)=>{
        //     scrollB.current.scrollTo(position,0)
        //     return position;

        // });
        // console.log(position);
        // setDivPosX((divPosX)=>{

        //     return divPosX.map((x)=>{
        //         return x - resultant;
        //     })
        // })

        dispatch(setScrollPos({scrollPos: position}))
        scrollB.current.scrollTo(position,0)
        dispatch(translateAnnotationPosition({change: resultant}))
        // setTranslatePos(resultant)
        
    }

    const addDiv = (e,index) => {
        
        if(e.ctrlKey){
            let x = e.clientX
            
            pointer.current.style.left  = `${x}px`;
            dispatch(addAnnotation({
                annotation: {position: x,width:100, text:""},//TODO: width to be changed
            }))
        }
    }

    const selectHandler = (e,index)=>{
       
        dispatch(setSelectedAnnotationIndex({"index":index}))
        // console.log(selectedAnnotationIndex);
    }
    const keyHandler =  (e)=>{
        
        console.log(e.key,selectedAnnotationIndex);
        if( e.key === "Delete"){
            console.log("here");
            dispatch(deleteAnnotation());
        }
        // if(e.key == "Backspace"){ /// cut last letter
        //     dispatch(setAnnotationText({text: ""}))
        // }
        if(e.key.length==1){
            console.log(selectedAnnotationIndex);
            dispatch(setAnnotationText({text: `${annotations[selectedAnnotationIndex]["text"]}${e.key}`}))
        }

    }
    useEffect(()=>{
        document.addEventListener("keyup",keyHandler)
    },[])

    


    return <div className="audiocontainer">
        <div onClick={(e)=>{addDiv(e)}} onScroll={handleScroll} ref={scrollA} className="audiowave-container">
            
            <div ref={audiowave} className="audiowave">
            <div ref={pointer} className="vertical-line"></div>
            {annotations?annotations.map((annotation,i)=>{
                
                
                return  <div 
                            key={i} 
                            onClick={(e)=>{selectHandler(e,i)}}
                            // onClick={(e)=>{selectHandler(e,i)}}
                            // onKeyUp={keyHandler}
                            className={ `custom-div  ${i===selectedAnnotationIndex?"blue":"yellow"}`}
                            style={{"left":`${annotation.position}px`
                        }}>
                            {/* <div onClick={(e)=>{selectHandler(e,i)}}>x</div> */}
                            {annotation.text}
                        </div>
            }):''}
                Adipisicing sint nulla sint ad enim culpa elit pariatur nisi. Adipisicing veniam consequat culpa nulla reprehenderit tempor et. Ex fugiat reprehenderit eiusmod culpa. Labore reprehenderit exercitation culpa deserunt mollit dolor pariatur culpa consequat culpa aliquip enim cillum proident. Do ipsum occaecat ex est.
            </div>
        </div>
        <div ref={scrollB} className="annotations-container">
            <div ref={annotation} className="annotations">
            Adipisicing sint nulla sint ad enim culpa elit pariatur nisi. Adipisicing veniam consequat culpa nulla reprehenderit tempor et. Ex fugiat reprehenderit eiusmod culpa. Labore reprehenderit exercitation culpa deserunt mollit dolor pariatur culpa consequat culpa aliquip enim cillum proident. Do ipsum occaecat ex est.
            </div>
        </div>
        
    </div>

}

export default AnnotatorForm;