import './App.css';
import AnnotatorForm from './Components/AnnotatorForm/AnnotatorForm';
import { Provider } from "react-redux"
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import store from "./store/annotatorStore"
import HomePage from './Components/AudioUpload/UploadPage';
import { FileContextProvider } from './Contexts/fileContext';
import AudioWaveForm from './Components/AudioForm/AudioWaveForm';
function App() {
  
  return (
    <FileContextProvider>
      <Provider store={store}>
          <Router>
            <Switch>
            
                <Route path="/" component={HomePage} exact/>
                {/* <Route path="/annotate" component={AnnotatorForm} exact/> */}
                <Route path="/annotate" component={AudioWaveForm} exact/>
                </Switch>
          </Router>
      </Provider>
    </FileContextProvider>
  );
}

export default App;
