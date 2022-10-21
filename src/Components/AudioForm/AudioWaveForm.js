import React, { useState, useEffect, useContext, useRef } from 'react';
import TimelinePlugin from 'wavesurfer.js/dist/plugin/wavesurfer.timeline.min.js';
import RegionsPlugin from 'wavesurfer.js/dist/plugin/wavesurfer.regions.min.js';
import { FileContext } from '../../Contexts/fileContext';
import Wavesurfer from 'wavesurfer.js';
import ToggleButton from './ToggleButton';
import "./AudioWaveForm.css"

const AudioWaveForm = () => {
	const wavesurferRef = useRef(null);
	const timelineRef = useRef(null);

	// fetch file url from the context
	const { fileURL, setFileURL } = useContext(FileContext);

	// crate an instance of the wavesurfer
	let [wavesurferObj, setWavesurferObj] = useState();
	// let wavesurferObj = Wavesurfer.create()
	// wavesurferObj.setPlaybackRate

	const [playing, setPlaying] = useState(true); // to keep track whether audio is currently playing or not
	const [volume, setVolume] = useState(1); // to control volume level of the audio. 0-mute, 1-max
	const [zoom, setZoom] = useState(1); // to control the zoom level of the waveform
	const [duration, setDuration] = useState(0); // duration is used to set the default region of selection for trimming the audio
	const [regions,setRegions] = useState([])
	const [selectedRegionIndex,setSelectedRegionIndex] = useState(-1)
	const [speed,setSpeed] = useState(1);

	
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

	
	// once the file URL is ready, load the file to produce the waveform
	useEffect(() => {
		if (fileURL && wavesurferObj) {
			wavesurferObj.load(fileURL);
		}
	}, [fileURL, wavesurferObj]);

	useEffect(() => {
		if (wavesurferObj) {
			
			// once the waveform is ready, play the audio
			wavesurferObj.on('ready', () => {
				wavesurferObj.play();
				wavesurferObj.enableDragSelection({}); // to select the region to be trimmed
				setDuration(Math.floor(wavesurferObj.getDuration())); // set the duration in local state
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
				// const regions = region.wavesurfer.regions.list;
				// const keys = Object.keys(regions);
				// console.log(region.setLoop(true));
				setRegions((regs)=>{
					if(regs){
						console.log(regs);
						let regionPresentInArray = false;
						regs.forEach((reg)=>{
							if(reg["obj"].id==region.id){
								regionPresentInArray=true;
							}
						})
						if(! regionPresentInArray){
							// region.color = "red";
							let regionDoms = document.querySelectorAll("region");
							let newDom = null;
							regionDoms.forEach((dom)=>{
								if(dom.getAttribute("data-id")===region.id){
									console.log("found match");
									newDom = dom;
								}
							})
							newDom.addEventListener("click",regionSelectHandler)
							
							// TODO: Create the annotator here using the width and position of the region
							return [...regs,{"obj":region,"dom":newDom}]
						}
						return regs
					}
				})
				
				

				// console.log(keys,"000000000000000");
				// console.log(region.fireEvent('remove'));
				// if (keys.length > 1) {
				// 	regions[keys[0]].remove();
				// }
			});

			
		}
	}, [wavesurferObj]);

	// set volume of the wavesurfer object, whenever volume variable in state is changed
	useEffect(() => {
		if (wavesurferObj) {
			wavesurferObj.setVolume(volume);
			
		}
	}, [volume, wavesurferObj]);

	// set zoom level of the wavesurfer object, whenever the zoom variable in state is changed
	useEffect(() => {
		if (wavesurferObj) wavesurferObj.zoom(zoom);
	}, [zoom, wavesurferObj]);

	// when the duration of the audio is available, set the length of the region depending on it, so as to not exceed the total lenght of the audio
	useEffect(() => {
		if (duration && wavesurferObj) {
			// add a region with default length
			// wavesurferObj.addRegion({
			// 	start: Math.floor(duration / 2) - Math.floor(duration) / 5, // time in seconds
			// 	end: Math.floor(duration / 2), // time in seconds
			// 	color: 'hsla(265, 100%, 86%, 0.4)', // color of the selected region, light hue of purple
			// });
			// wavesurferObj.addRegion({
			// 	start: Math.floor(duration / 2) - Math.floor(duration) / 5 + 30, // time in seconds
			// 	end: Math.floor(duration / 2) + 60, // time in seconds
			// 	color: '#ff0064', // color of the selected region, light hue of purple
			// });
			
		}
	}, [duration, wavesurferObj]);

	const handlePlayPause = (e) => {
		wavesurferObj.playPause();
		setPlaying(!playing);
	};

	const handleReload = (e) => {
		// stop will return the audio to 0s, then play it again
		wavesurferObj.stop();
		wavesurferObj.play();
		setPlaying(true); // to toggle the play/pause button icon
	};

	const handleVolumeSlider = (e) => {
		setVolume(e.target.value);
		// wavesurferObj.setPlaybackRate(e.target.value)
		// wavesurferObj.setCurrentTime(10)
		// wavesurferObj.setPlayEnd(20)

	};

	const handleZoomSlider = (key) => {
		setZoom((zoomVal)=>{
			if(key==="+"){
				return  zoomVal<175?zoomVal+25:200;
				
			}else if(key === "-"){
				return  zoomVal>26?zoomVal-25:1;	
			}
			return 1;
				
		});
		
		
	};

	

	useEffect(()=>{
		if(wavesurferObj!=null){
			// document.querySelector("#waveform > wave").addEventListener("scroll",(e)=>{console.log("scroll")})
		}
		
	},[wavesurferObj])

	useEffect((e)=>{
		
		if(wavesurferObj){
			document.addEventListener("keyup",(e)=>{
				e.preventDefault()		
				console.log(e);
				if(e.key === "+" || e.key === "-"){		
					console.log("here ",e.key);		
					handleZoomSlider(e.key);
				}
				else if (e.code === "Space"){
					setSelectedRegionIndex((index)=>{
						console.log(index);
						if(index==-1){
							handlePlayPause(e)
						}
						else{//TODO: play loop region
							setRegions((regs)=>{
									console.log("index: ",index);
									regs.forEach((reg,i)=>{
										if(i===index){
											console.log("loooooooooooooooper");
											regs[i]["obj"].play()
										}
									})
									
									return regs
								
							})
							

						}
						return index
					})
					
				}
				else if (e.key=== "MediaPlayPause"){
					handlePlayPause(e)
				}
				else if(e.key==="Delete"){
					setSelectedRegionIndex(index=>{
						if(index!==-1){
							removeRegion(index);
						}
						
						return index
					})
				}
				else if( e.key==="ArrowRight"){
					document.querySelector("#waveform > wave").scrollBy(100,0)
				}
				else if( e.key==="ArrowLeft"){
					document.querySelector("#waveform > wave").scrollBy(-100,0)
				}
				else if(e.key==="[" || e.key==="]"){
					changeSpeed(e.key)
				}
				else if(e.key==="ArrowUp"){
					changeVolume(0.1);
				}
				else if( e.key==="ArrowDown"){
					changeVolume(-0.1);
				}
			});
		}
		// TODO: concern with changing wavesurferobject when cycling through multiple audio
		},[wavesurferObj])
	
	const changeVolume = (change)=>{
		setVolume(volume=>volume+change<1.1 && volume+change > 0?volume+change:volume )
	}
	const removeRegion = (index)=>{
		// testing only
		// id = regions[0]["obj"].id;
		setRegions((regs)=>{
			console.log(regs,index);
			regs[index]["obj"].remove();
			setSelectedRegionIndex(-1);
			return regs.filter((reg,i)=> i !== index);//also consider when deleted selected index to -1

		})
	}

	const changeSpeed = (key)=>{
		
		setSpeed((s)=>{
			
			if(key==="["){
				let newSpeed = s>0.1?s-0.1:s;
				wavesurferObj.setPlaybackRate(newSpeed);
				return newSpeed
			}
			if(key==="]"){
				let newSpeed = s<4?s+0.1:s;
				wavesurferObj.setPlaybackRate(newSpeed);
				return newSpeed
			}
			return s
		})
		
	}
	const regionSelectHandler = (e)=>{
		
		setRegions((regs)=>{
			let id = e.target.getAttribute("data-id");
			let currIndex = -1;
			regs.forEach((reg,i)=>{
				console.log("reg");
				if(reg["obj"].id===id){
					currIndex = i
				}
			})
			console.log(currIndex,regs);
			
			setSelectedRegionIndex((index)=>{
				if(index===-1 || index!==currIndex){
					regs.forEach((reg,i)=>{
						if(currIndex==i){
							reg["obj"].color = "rgba(0, 255, 255,0.2)";
							reg["obj"].update({})
						}
						else{
							reg["obj"].color = "rgba(0,0,0,0.1)";
							reg["obj"].update({})
							console.log("//////////////////");
						}
					})
					
					return currIndex
				}
				if(index === currIndex){
					regs[currIndex]["obj"].color = "rgba(0,0,0,0.1)";
					regs[currIndex]["obj"].update({})
					return -1
				}
				return -1
			})
			return regs
		})
		
		
	}
	

	return (
		<div className='waveform-container'>
			speed : {Math.round(speed*10)/10} volume: {Math.round(volume*10)/10} zoom: {zoom}
			<div ref={wavesurferRef}  id='waveform' />
			<div ref={timelineRef} onScroll={(e)=>{console.log(e);}} id='wave-timeline' />
			<div className='all-controls'>
				<button onClick={(e)=>{
					removeRegion("regionId")
				}}>remove first region</button>
				{/* <div className='left-container'>
					<ToggleButton />
					<button
						title='play/pause'
						className='controls'
						onClick={handlePlayPause}>
						{playing ? (
							<i className='material-icons'>pause</i>
						) : (
							<i className='material-icons'>play_arrow</i>
						)}
					</button>
					<button
						title='reload'
						className='controls'
						onClick={handleReload}>
						<i className='material-icons'>replay</i>
					</button>
					<button className='trim' onClick={handleTrim}>
						<i
							style={{
								fontSize: '1.2em',
								color: 'white',
							}}
							className='material-icons'>
							content_cut
						</i>
						Trim
					</button>
				</div>
				<div className='right-container'>
					<div className='volume-slide-container'>
						<i className='material-icons zoom-icon'>
							remove_circle
						</i>
						<input
							type='range'
							min='1'
							max='1000'
							value={zoom}
							onChange={handleZoomSlider}
							class='slider zoom-slider'
						/>
						<i className='material-icons zoom-icon'>add_circle</i>
					</div>
					<div className='volume-slide-container'>
						{volume > 0 ? (
							<i className='material-icons'>volume_up</i>
						) : (
							<i className='material-icons'>volume_off</i>
						)}
						<input
							type='range'
							min='0'
							max='1'
							step='0.05'
							value={volume}
							onChange={handleVolumeSlider}
							className='slider volume-slider'
						/>
					</div>
				</div> */}
			</div>
		</div>
	);
};

export default AudioWaveForm;
