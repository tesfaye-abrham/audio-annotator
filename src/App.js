import logo from './logo.svg';
import './App.css';
import AnnotatorForm from './AnnotatorForm/AnnotatorForm';
import { Provider } from "react-redux"
import store from "./store/annotatorStore"
function App() {
  // document.addEventListener("keydown", e=>{
  //   if(e.ctrlKey){
  //     // e.preventDefault();
  //     console.log(e.which);
  //   }
  // });
  // document.addEventListener("keydown", e=>{
  //   if(e.ctrlKey){
  //     e.preventDefault();
  //     // console.log(e.which);
  //   }
  // });
  return (
    <Provider store={store}>
      <AnnotatorForm/>
    </Provider>
  );
}

export default App;
