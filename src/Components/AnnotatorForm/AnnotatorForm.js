import { useEffect, useRef, useState } from "react";
import "./AnnotatorForm.css"
import { useSelector, useDispatch } from "react-redux";

// import Annotation from "../Objects/Annotation";
import { setScrollPos, addAnnotation, setAnnotationWidth, translateAnnotationPosition, deleteAnnotation, setSelectedAnnotationIndex, setAnnotationText } from "../../slices/annotatorSlice";


const AnnotatorForm = (props) => {
    const { annotations, selectedAnnotationIndex, scrollPos } = useSelector(state => { return state.annotator })

    const dispatch = useDispatch();
    // const [translatePos,setTranslatePos] = useState(0)



    const scrollA = useRef(null)
    const scrollB = useRef(null)
    const audiowave = useRef(null)
    const annotation = useRef(null)
    // const pointer = useRef(null)



    const handleScroll = (e) => {

        const position = scrollA.current.scrollLeft;
        const resultant = position - scrollPos


        dispatch(setScrollPos({ scrollPos: position }))
        scrollB.current.scrollTo(position, 0)
        dispatch(translateAnnotationPosition({ change: resultant }))

    }

    const addDiv = (e, index) => {

        if (e.ctrlKey) {
            let x = e.clientX

            // pointer.current.style.left  = `${x}px`;
            dispatch(addAnnotation({
                annotation: { position: x, width: 100, text: "" },//TODO: width to be changed
            }))
        }
    }

    const selectHandler = (e, index, autoFocus) => {

        if (!autoFocus) {
            dispatch(setSelectedAnnotationIndex({ "index": index }))
            if (selectedAnnotationIndex !== index) {
                document.getElementsByClassName("text-input")[index].focus()
            }
            console.log("select");
        }


    }
    const keyUpHandler = (e) => {
        if (e.ctrlKey && e.key === "Delete") {
            console.log("here");
            dispatch(deleteAnnotation());
        }
    }

    useEffect(() => {
        document.addEventListener("keyup", keyUpHandler)


    }, [])
    useEffect(() => {
        console.log(annotations);
    }, [annotations])

    const TextInputHandler = (e, index) => {
        // if (e.key.length < 2) {
            let inputText = document.getElementsByClassName("text-input")[index].value;
            dispatch(setAnnotationText({ text: inputText }))

        // }
    }

    const handleInputClick = (e, index) => {
        if (index === selectedAnnotationIndex) {
            e.stopPropagation();
        }
    }


    const BORDER_SIZE = 4;

    const resizeHandler = (e,index)=>{
        const dx = annotations[index]["position"] - e.clientX;
        console.log(annotations[index]["width"]+dx);
        setAnnotationWidth({width: 200})
        
    }



    return <div className="audiocontainer">
        <div ref={scrollB} className="annotations-container">
            <div ref={annotation} className="annotations">
                Adipisicing sint nulla sint ad enim culpa elit pariatur nisi. Adipisicing veniam consequat culpa nulla reprehenderit tempor et. Ex fugiat reprehenderit eiusmod culpa. Labore reprehenderit exercitation culpa deserunt mollit dolor pariatur culpa consequat culpa aliquip enim cillum proident. Do ipsum occaecat ex est.
            </div>
        </div>
        <div onClick={(e) => { addDiv(e) }} onScroll={handleScroll} ref={scrollA} className="audiowave-container">

            <div ref={audiowave} className="audiowave">
                {/* <div ref={pointer} className="vertical-line"></div> */}
                {annotations ? annotations.map((annotation, i) => {

                    
                    return <div 
                        key={i}
                        onClick={(e) => { selectHandler(e, i, false) }}
                        onMouseDown={(e)=>{resizeHandler(e,i)}}

                        className={`custom-div  ${i === selectedAnnotationIndex ? "blue" : "yellow"}`}
                        style={{
                            "left": `${annotation.position}px`, 
                            "width": `${annotations[i].width}px`
                        }}>

                        <input onClick={(e) => { handleInputClick(e, i) }} onFocus={(e) => { selectHandler(e, i, true) }} onKeyUp={(e) => { TextInputHandler(e, i) }} className="text-input" type={"text"}></input>
                    </div>
                }) : ''}
                Adipisicing sint nulla sint ad enim culpa elit pariatur nisi. Adipisicing veniam consequat culpa nulla reprehenderit tempor et. Ex fugiat reprehenderit eiusmod culpa. Labore reprehenderit exercitation culpa deserunt mollit dolor pariatur culpa consequat culpa aliquip enim cillum proident. Do ipsum occaecat ex est.
            </div>
        </div>
        

    </div>

}

export default AnnotatorForm;