import React, { useState, useEffect, useContext, useRef } from 'react';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import { FileContext } from '../../Contexts/fileContext';
import Wavesurfer from 'wavesurfer.js';
import { saveAs } from 'filesaver.js';
import "./AudioWaveForm.css"
import MediaControlComponent from './MediaControlComponent';





const AudioWaveForm = () => {
	const wavesurferRef = useRef(null);
	const timelineRef = useRef(null);
	const scrollA = useRef(null)
	const audiowave = useRef(null)
	const textArea = useRef(null)

	// fetch file url from the context
	const { fileURLs, setFileURLs, fileNames, setFileNames } = useContext(FileContext);


	let [wavesurferObj, setWavesurferObj] = useState(); // crate an instance of the wavesurfer
	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
	const [zoom, setZoom] = useState(1); // to control the zoom level of the waveform
	const [duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio
	const [regions, setRegions] = useState([]); // regions
	const [selectedRegionIndex, setSelectedRegionIndex] = useState(-1)
	const [speed, setSpeed] = useState(1);
	const [containerWidth, setContainerWidth] = useState(null);
	const [selectedFileIndex, setSelectedFileIndex] = useState(0);
	const [sidebarToggled, setSidebarToggled] = useState(true)
	const [isTyping,setIsTyping] = useState(false)




	// create the waveform inside the correct component
	useEffect(() => {
		if (wavesurferRef.current && !wavesurferObj) {
			setWavesurferObj(
				Wavesurfer.create({
					container: '#waveform',
					scrollParent: true,
					autoCenter: true,
					cursorColor: 'violet',
					loopSelection: true,
					waveColor: 'green',
					progressColor: 'orange',
					responsive: true,

					plugins: [
						TimelinePlugin.create({
							container: '#wave-timeline'
						}),
						RegionsPlugin.create({

						}),
					],
				})
			);

		}
	}, [wavesurferRef, wavesurferObj]);

	useEffect(() => {
		console.log(fileURLs);
	}, [])


	// once the file URL is ready, load the file to produce the waveform
	useEffect(() => {
		if (fileURLs.length > 0 && wavesurferObj) {
			wavesurferObj.load(fileURLs[selectedFileIndex]);
		}
		// reset states
		setPlaying(true);
		setVolume(1);
		setZoom(1);
		setDuration(0);
		setRegions((regs) => {
			regs.forEach((reg) => {
				reg["obj"].remove();
			})
			return []
		});
		setSelectedRegionIndex(-1);
		setSpeed(1);
		setContainerWidth(null);
	}, [fileURLs, wavesurferObj, selectedFileIndex]);

	const changeFile = (direction, index = -1) => {

		setSelectedFileIndex((i) => {
			let filesCount = fileURLs.length;
			if (index == -1) {

				if (direction === "next") {
					if (i + 1 <= filesCount - 1) {
						return i + 1;
					}
				}
				if (direction === "previous") {
					if (i - 1 >= 0) {
						return i - 1;
					}
				}
				return i
			}
			else {
				console.log(index, "  chosen");

				if (index === i) {
					return i
				}
				else if (index < filesCount) {
					return index
				}
				return i
			}
		})


	}

	useEffect(() => {
		if (wavesurferObj) {

			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				wavesurferObj.play();
				wavesurferObj.enableDragSelection({}); // to select the region to be trimmed
				setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state
				console.log(Math.floor(wavesurferObj.getDuration()), "duration");

			});

			// once audio starts playing, set the state variable to true
			wavesurferObj.on('play', () => {
				setPlaying(true);
			});

			// once audio starts playing, set the state variable to false
			wavesurferObj.on('finish', () => {
				setPlaying(false);
			});

			// if multiple regions are created, then remove all the previous regions so that only 1 is present at any given time
			wavesurferObj.on('region-updated', (region) => {
				setRegions((regs) => {
					if (regs) {
						console.log(regs);
						let regionPresentInArray = false;
						regs.forEach((reg) => {
							if (reg["obj"].id == region.id) {
								regionPresentInArray = true;
							}
						})
						// TODO: update width and scroll left
						if (!regionPresentInArray) {
							// region.color = "red";
							let regionDoms = document.querySelectorAll("region");
							let newDom = null;
							regionDoms.forEach((dom) => {
								if (dom.getAttribute("data-id") === region.id) {
									console.log("found match");
									newDom = dom;
								}
							})
							newDom.addEventListener("click", regionSelectHandler)
							return [...regs, { "obj": region, "dom": newDom, "text": "", "width": newDom.clientWidth, "left": newDom.offsetLeft, "start": region.start, "end": region.end }]
						}

						let newRegs = regs.map(reg => {
							console.log(reg["obj"]);
							return { ...reg, width: reg["dom"].clientWidth, left: reg["dom"].offsetLeft, "start": reg["obj"].start, "end": reg["obj"].end }
						})
						return newRegs
					}
				})

			});


		}
	}, [wavesurferObj]);

	useEffect(() => {
		setContainerWidth(document.querySelector("#waveform > wave").scrollWidth)
		console.log("zooom");
	}, [zoom])

	// set volume of the wavesurfer object, whenever volume variable in state is changed
	useEffect(() => {
		if (wavesurferObj) {
			wavesurferObj.setVolume(volume);

		}
	}, [volume, wavesurferObj]);

	// set zoom level of the wavesurfer object, whenever the zoom variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.zoom(zoom);
		setContainerWidth(document.querySelector("#waveform > wave").scrollWidth)
	}, [zoom, wavesurferObj]);

	// when the duration of the audio is available, set the length of the region depending on it, so as to not exceed the total lenght of the audio
	useEffect(() => {
		if (duration && wavesurferObj) {
		}
	}, [duration, wavesurferObj]);

	const handlePlayPause = (e) => {
		wavesurferObj.playPause();
		setPlaying(playing => !playing);
	};


	const handleZoomSlider = (key) => {
		setZoom((zoomVal) => {
			if (key === "+") {
				return zoomVal < 575 ? zoomVal + 25 : 2000;

			} else if (key === "-") {
				return zoomVal > 26 ? zoomVal - 25 : 1;
			}
			return 1;

		});


	};

	// useEffect(()=>{
	// 	console.log(regions);
	// },[regions.map(reg=>[reg["start"],reg["end"]])])




	useEffect((e) => {

		if (wavesurferObj) {
			document.addEventListener("keyup", (e) => {
				e.preventDefault()
				console.log(e);
				if (e.key === "+" || e.key === "-") {
					console.log("here ", e.key);
					handleZoomSlider(e.key);
				}
				else if (e.code === "Space") {
					setIsTyping(isTyping=>{
						if(!isTyping){
							setSelectedRegionIndex((index) => {
								console.log(index);
								if (index == -1) {
									handlePlayPause(e)
								}
								else {//TODO: play loop region
									setRegions((regs) => {
										console.log("index: ", index);
										regs.forEach((reg, i) => {
											if (i === index) {
												console.log("loooooooooooooooper");
												regs[i]["obj"].play()
											}
										})
		
										return regs
		
									})
		
		
								}
								return index
							})}
							return isTyping
					})
					

				}
				else if (e.key === "MediaPlayPause") {
					handlePlayPause(e)
				}
				else if (e.key === "Delete") {
					setSelectedRegionIndex(index => {
						if (index !== -1) {
							removeRegion(index);
						}

						return index
					})
				}
				else if (e.key === "ArrowRight") {
					document.querySelector("#waveform > wave").scrollBy(100, 0)
				}
				else if (e.key === "ArrowLeft") {
					document.querySelector("#waveform > wave").scrollBy(-100, 0)
				}
				else if (e.key === "[" || e.key === "]") {
					changeSpeed(e.key)
				}
				else if (e.key === "ArrowUp") {
					changeVolume(0.1);
				}
				else if (e.key === "ArrowDown") {
					changeVolume(-0.1);
				}
				else if (e.ctrlKey && e.key === "s") {
					e.preventDefault()
					exportAnnotation()
				}
			});
			document.addEventListener("keydown", (e) => {
				if (e.ctrlKey && e.key === "s") {
					e.preventDefault()
				}
			})
		}
		// TODO: concern with changing wavesurferobject when cycling through multiple audio
	}, [wavesurferObj])

	const changeVolume = (change) => {
		setVolume(volume => volume + change < 1.1 && volume + change > 0 ? volume + change : volume)
	}
	const removeRegion = (index) => {
		setRegions((regs) => {
			console.log(regs, index);
			regs[index]["obj"].remove();
			setSelectedRegionIndex(-1);
			return regs.filter((reg, i) => i !== index);

		})
	}

	const changeSpeed = (key) => {

		setSpeed((s) => {

			if (key === "[") {
				let newSpeed = s > 0.1 ? s - 0.1 : s;
				wavesurferObj.setPlaybackRate(newSpeed);
				return newSpeed
			}
			if (key === "]") {
				let newSpeed = s < 4 ? s + 0.1 : s;
				wavesurferObj.setPlaybackRate(newSpeed);
				return newSpeed
			}
			return s
		})

	}
	const regionSelectHandler = (e) => {

		setRegions((regs) => {
			let id = e.target.getAttribute("data-id");
			let currIndex = -1;
			regs.forEach((reg, i) => {
				console.log("reg");
				if (reg["obj"].id === id) {
					currIndex = i
				}
			})
			console.log(currIndex, regs);
			setSelectedRegionIndex((index) => {
				if (index === -1 || index !== currIndex) {
					return currIndex
				}
				if (index === currIndex) {
					return -1
				}
				return -1
			})
			return regs
		})


	}

	useEffect(() => {

		regions.forEach((reg, i) => {
			if (selectedRegionIndex == i) {
				reg["obj"].color = "rgba(0, 255, 255,0.2)";
				reg["obj"].update({})
			}
			else {
				reg["obj"].color = "rgba(0,0,0,0.1)";
				reg["obj"].update({})
				console.log("//////////////////");
			}
		})


	}, [selectedRegionIndex])



	const handleScroll = (source) => {
		if (source === "wave") {
			scrollA.current.scrollTo(document.querySelector("#waveform > wave").scrollLeft, 0)
		}
		if (source === "text") {
			document.querySelector("#waveform > wave").scrollTo(scrollA.current.scrollLeft, 0)
		}
		setRegions((regs) => {
			let newRegs = regs.map((reg, i) => {
				let x = regs[i]["left"]
				regs[i]["left"] = regs[i]["dom"].getBoundingClientRect().x;
				regs[i]["width"] = regs[i]["dom"].clientWidth;
				// console.log(x, ",", regs[i]["left"], " || ", regs[i]["width"]);
				return regs[i]
			})
			// console.log(newRegs);
			return newRegs
		})
	}



	const selectHandler = (e, index, autoFocus) => {
		if (autoFocus === false) {
			setSelectedRegionIndex((currIndex) => {
				if (currIndex !== index) {
					document.getElementsByClassName("text-input")[index].focus()
					return index
				}
				return -1;
			})
		}
	}

	const TextInputHandler = (e, index) => {
		let text = e.target.value;

		setRegions((regs) => {
			return regs.map((reg, i) => {
				if (i === index) {
					return { ...reg, "text": text }
				}
				return { ...reg }
			})
		})

	}

	const handleInputClick = (e, index) => {
		if (index === selectedRegionIndex) {
			e.stopPropagation();
		}
	}

	// Add global event listeners to the document 
	useEffect(() => {
		document.querySelector("#waveform>wave").addEventListener("scroll", (e) => {
			handleScroll("wave");
		})
		scrollA.current.addEventListener("scroll", (e) => {
			handleScroll("text");
		})


	}, [])
	





	const toggleSidebar = (e) => {
		setSidebarToggled(isToggled => !isToggled);
	}

	const exportAnnotation = async () => {


		let fileHandle;
		try {
			fileHandle = await window.showSaveFilePicker({ suggestedName: `${fileNames[selectedFileIndex].replaceAll(" ", "_")}.json` })
			if (fileHandle) {
				let writableStream = await fileHandle.createWritable();

				setRegions((regs) => {
					const fileData = JSON.stringify(
						{
							"file-name": fileNames[selectedFileIndex],
							"text-timestamp": regs.map(
								(reg) => {
									return {
										"text": reg["text"],
										"start": reg["start"],
										"end": reg["end"]
									}
								})
						}
					);
					writableStream.write(fileData.replaceAll(",{", ",\n\t{").replaceAll("}]}", "}\n  ]\n}").replaceAll("[{", "\n  [\n\t{"));
					writableStream.close()
					return regs
				})

			}
		} catch (error) {
			console.log("file not saved");
		}
	}

	useEffect(()=>{
		if(document){
			document.addEventListener("focusin",(e)=>{
				if(e.path[0].tagName==="INPUT" || e.path[0].tagName==="TEXTAREA"){
					textAreaFocused(true)
				}
			})
			document.addEventListener("focusout",(e)=>{
				if(e.path[0].tagName==="INPUT" || e.path[0].tagName==="TEXTAREA"){
					textAreaFocused(false)
				}
			})
			
			
		}
		return ()=>{
			document.removeEventListener("focusin",()=>{
				textAreaFocused(true)
			})
			document.removeEventListener("focusout",()=>{
				textAreaFocused(false)
			})
		}
	},[document])

	const textAreaFocused = (typing)=>{
		setIsTyping(typing);
	}


	return (
		<div className='waveform-sidebar-container'>

			<div className='file-name-title' >
				<h3>{fileNames[selectedFileIndex]}</h3>
			</div>
			speed : {Math.round(speed * 10) / 10} volume: {Math.round(volume * 10) / 10} zoom: {zoom}
			<div ref={wavesurferRef} id='waveform' />
			<div ref={timelineRef} onScroll={(e) => { console.log(e); }} id='wave-timeline' />
			<div className="audiocontainer" style={{ "boxShadow": "0px 4px 3px 1px grey" }}>

				<div ref={scrollA} className="audiowave-container" >

					<div ref={audiowave} className="audiowave" style={{ "width": `${containerWidth}px` }} >

						{regions ? regions.map((reg, i) => {
							return <div
								key={i}
								onClick={(e) => { selectHandler(e, i, false) }}
								className={`custom-div  ${i === selectedRegionIndex ? "blue" : "yellow"}`}
								style={{
									"left": `${reg["dom"].getBoundingClientRect().x}px`,
									"width": `${reg["dom"].clientWidth}px`
								}}>
								<input
									style={{ "visibility": reg["dom"].clientWidth > 10 ? "inherit" : "hidden" }}
									className={"text-input"}
									onClick={(e) => { handleInputClick(e, i) }}
									onFocus={(e) => { selectHandler(e, i, true) }}
									onKeyUp={(e) => { TextInputHandler(e, i) }}
									// onFocusIn = {()=>{textAreaFocused(true)}}
									// onFocusOut = {()=>{textAreaFocused(false)}}
									onFocusCapture={(e)=>{console.log(e);}}
									type={"text"}>
								</input>

							</div>
						}) : ''}
					</div>
				</div>
			</div>
			<div className='media-controls-container'>



				<div className='media-buttons'>
					
					<MediaControlComponent
						MediaTitle={"volume"}
						MediaValue={Math.round(volume * 10) * 10}
						ListenerOne={() => { changeVolume(-0.1) }}
						ListenerTwo={() => { changeVolume(0.1) }}
					// style={{}}
					/>
					<MediaControlComponent
						MediaTitle={"zoom"}
						MediaValue={Math.round(zoom * 10) / 10}
						ListenerOne={() => { handleZoomSlider("-") }}
						ListenerTwo={() => { handleZoomSlider("+") }}
					// style={{}}
					/>
					<div onClick={handlePlayPause} className='play-control-container'>
						<div className='play-button'>
							<img src={playing ? './PlayIcon.png' : './PauseIcon.png'}></img>
						</div>
					</div>
					<MediaControlComponent
						MediaTitle={"speed"}
						MediaValue={Math.round(speed * 10) / 10}
						ListenerOne={() => { changeSpeed("[") }}
						ListenerTwo={() => { changeSpeed("]") }}
					// style={{}}
					/>
					<button onClick={exportAnnotation} className='export-button'>
						<img src='./SaveIcon.png'/>
						Export
					</button>
				</div>
			</div>
			<textarea ref={textArea} rows={9} cols={15} style={{"resize":"none","margin":"0 20px"}}/>
			<div className='media-nav-button-container'>
				<button className='media-nav-button grey-button' onClick={(e) => { changeFile("previous") }}>Previous</button>
				<button className='media-nav-button green-button' onClick={(e) => { changeFile("next") }}>Next</button>
			</div>
			<div className='sidebar' style={{ "left": sidebarToggled ? "-300px" : "0px" }}>
				<div className='file-list-container' style={{ "width": "300px" }}>
					<div className='sidebar-title'>
						Loaded File List
					</div>
					{
						fileNames.map((fileName, i) => {
							return <div
								key={i}
								className='sidebar-file-container'
								onClick={(e) => { changeFile("playIndex", i) }}
								style={i === selectedFileIndex ? { "backgroundColor": "aqua" } : {}}
							>{i}, {fileName}</div>
						})
					}

				</div>
				<div onClick={toggleSidebar} className='sidebar-toggle'>
					{sidebarToggled ? "<" : ">"}
				</div>
				{!sidebarToggled ? <div className='sidebar-shade'
					style={{ "width": "100vw", "height": "100vh" }}
					onClick={toggleSidebar}>
				</div> : ""}

			</div>

		</div>

	);
};

export default AudioWaveForm;
