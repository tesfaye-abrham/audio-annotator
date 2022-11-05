import React, { useState, useEffect, useRef, useContext } from 'react';
import { FileContext } from '../../Contexts/fileContext';
import styles from "./AudioUpload.module.css"

const AudioUpload = ({ history }) => {
	const inputFile = useRef(null);
	const { fileURLs, setFileURLs, fileNames, setFileNames } = useContext(FileContext);
	const [files, setFiles] = useState([]);
	const [names, setNames] = useState([])

	useEffect(() => {
		if (files.length > 0) {
			setFileURLs(files);
			setFileNames((nam) => { console.log(names); return names; })
			history.push("/annotate")

		}
	}, [files, setFileURLs, history, names]);

	const handleButtonClick = () => {
		inputFile.current.click();
	};

	const handleFileUpload = (e) => {
		console.log(e.target.files[0]);
		// setFiles([...URL.createObjectURL(e.target.files)]);
		let urls = Array(...e.target.files).map((file) => URL.createObjectURL(file))
		setNames(Array(...e.target.files).map((file) => file.name))

		setFiles(urls);


	};
	const dragOverHandler = (e)=>{
		e.preventDefault()
		console.log("holding");
	}
	const dropHandler = (e)=>{
		e.preventDefault();
		const files = [...e.dataTransfer.items].map((item)=>{
			return item.getAsFile();
		})
		handleFileUpload({"target":{"files":files}})
	}

	return (
		<div 
		onDragOver={dragOverHandler}
		onDrop={dropHandler}
		className={styles['upload-audio']}>
			
			<div className={styles['upload-title']}>
				<h1>Upload your audio file here</h1>
			</div>
			<div 
				className={styles['upload-btn']} 
				onClick={handleButtonClick}
				>
				Upload
			</div>
			<input
				type='file'
				id='file'
				ref={inputFile}
				style={{ display: 'none' }}
				accept='audio/*'
				onChange={handleFileUpload}
				multiple={true}
			/>
		</div>
	);
};

export default AudioUpload;
