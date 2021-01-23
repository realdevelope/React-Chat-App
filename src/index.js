import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import promiseMiddleware from 'redux-promise';
import ReduxThunk from 'redux-thunk';
import Reducer from './redux/reducers';
import { BrowserRouter as Router } from "react-router-dom"; //history객체를 사용하기위해서는 React Router Context가 
                                                            //있어야 하기 때문에 App.js에서 가져와서 <App/>을 <Router></Router>로 감싸줌

import 'bootstrap/dist/css/bootstrap.min.css';  //  react-bootstrap  stylesheets!!!

const createStoreWithMiddleware = applyMiddleware(promiseMiddleware, ReduxThunk)(createStore)


ReactDOM.render(
  <React.StrictMode>
  <Provider store={ createStoreWithMiddleware(
    Reducer,  
    window.__REDUX_DEVTOOLS_EXTENSION__ &&
    window.__REDUX_DEVTOOLS_EXTENSION__())    //아래의 코드는 history객체를 위해서 
    }>  
      <Router>    
        <App />
      </Router>
  </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
