import React from 'react';
import AudioUpload from './AudioUpload';

const HomePage = ({ history }) => {
	return (
		<div>
			<AudioUpload history={history} />
		</div>
	);
};

export default HomePage;