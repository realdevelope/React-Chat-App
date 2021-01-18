import React from 'react';
import './App.css';
// eslint-disable-next-line
import {BrowserRouter as Router, Switch, Route, Link} from "react-router-dom"; //react-router-dom에서 제공하는것들
import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={ChatPage}></Route>
        <Route exact path="/login" component={LoginPage}></Route>
        <Route exact path="/register" component={RegisterPage}></Route>
      </Switch>
  </Router>
  );
}

export default App;
