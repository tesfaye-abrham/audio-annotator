import React, { createContext, useState } from 'react';

const FileContext = createContext();

const FileContextProvider = ({ children }) => {
	const [fileURLs, setFileURLs] = useState([]);
	const [fileNames, setFileNames] = useState([]);
	return (
		<FileContext.Provider value={{ fileURLs, setFileURLs,fileNames, setFileNames }}>
			{children}
		</FileContext.Provider>
	);
};

export { FileContext, FileContextProvider };
