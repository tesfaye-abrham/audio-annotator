import { useEffect, useRef, useState } from "react";
import "./AnnotatorForm.css"
const AnnotatorForm = (props)=>{
    const [scrollPos,setScrollPos] = useState(0)
    const [divPosX,setDivPosX]=useState([])
    const [currentSelection,setCurrentSelection] = useState(-1)
    const [lastExecTime,setLastExecTime] = useState(Date.now())

    
    const scrollA = useRef(null)
    const scrollB = useRef(null)
    const audiowave = useRef(null)
    const annotation = useRef(null)
    // useEffect(()=>{},[])
    const pointer = useRef(null)


    const handleScroll = (e)=>{
        
        const position =scrollA.current.scrollLeft ;
        // const width = audiowave.current.getBoundingClientRect().width;
        const resultant = position - scrollPos
        setScrollPos((pos)=>{
            scrollB.current.scrollTo(position,0)
            return position;

        });
        console.log(position);
        setDivPosX((divPosX)=>{

            return divPosX.map((x)=>{
                return x - resultant;
            })
        })
    }

    const addDiv = (e,index) => {
        // console.log(e);
        if(e.ctrlKey){
            let x = e.clientX
            let y = e.clientY
            console.log(x,y);
            pointer.current.style.left  = `${x}px`;
            setDivPosX((divPosX)=>{
                
                return [...divPosX,x] 
            })
            console.log(divPosX);
            console.log(e);

        }
        // TODO: selection



    }
    // useEffect(()=>{
    //     console.log(currentSelection,"latest selection");
    // },[currentSelection])

    const selectHandler = (e,index)=>{
        console.log(divPosX,index);
        if(currentSelection!=index){
            setCurrentSelection((i)=>index);
            
        }else{
            setCurrentSelection(-1);
        }
        // console.log("key up ",currentSelection,divPosX);
    }
    const removeDiv =  (e)=>{
        console.log("remove triggered");
        // console.log(e.key);
        // console.log(divPosX);
        // console.log(currentSelection);
        if( e.key === "x" ){
            
            
            if(Date.now()-lastExecTime>=1000){
                console.log(divPosX,currentSelection);
                console.log(e.which);
                
                if(currentSelection!==-1){
                    console.log("current selection is a number  %d",currentSelection);
                     setDivPosX((newDivPosX)=>{
                        const divList = newDivPosX
                        console.log(currentSelection,"old divposx");
                        divList.splice(currentSelection,1)
                        console.log(divList,"new newDivposx ",currentSelection);
                        
                        return divList
                        
                    })
                     setCurrentSelection(-1)
                    
                    console.log(divPosX);
                }
                setLastExecTime(Date.now())
            }
                
        }
    }
    useEffect(()=>{
        document.addEventListener("keyup",removeDiv)
    },[])

    


    return <div className="audiocontainer">
        <div onClick={(e)=>{addDiv(e)}} onScroll={handleScroll} ref={scrollA} className="audiowave-container">
            
            <div ref={audiowave} className="audiowave">
            <div ref={pointer} className="vertical-line"></div>
            {divPosX.map((x,i)=>{
                
                
                return  <div 
                            key={i} 
                            onClick={(e)=>{selectHandler(e,i)}}
                            // onClick={(e)=>{selectHandler(e,i)}}
                            // onKeyUp={removeDiv}
                            className={ `custom-div  ${i===currentSelection?"blue":"yellow"}`}
                            style={{"left":`${x}px`
                        }}>
                            {/* <div onClick={(e)=>{selectHandler(e,i)}}>x</div> */}
                            {x},{i}
                        </div>
            })}
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