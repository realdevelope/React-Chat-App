import React,{ useEffect, Fragment } from 'react';
import { Switch, Route, useHistory } from "react-router-dom"; //react-router-dom에서 제공하는것들
import Media from 'react-media';

import ChatPage from './components/ChatPage/ChatPage';
import LoginPage from './components/LoginPage/LoginPage';
import RegisterPage from './components/RegisterPage/RegisterPage';
import firebase from './firebase';

import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './redux/actions/userAction'; 

const GLOBAL_MEDIA_QUERIES = {
  pc : "(min-width: 1024px) and (max-width: 1279px)",
  mobile: "(max-width: 767px)"
}

function App(props) {
  let history = useHistory();
  let dispatch = useDispatch();
  const isLoading = useSelector(state => state.user.isLoading);  //스토어에 있는 isLoading 을 사용하기위해 useSelector을 사용하여 가져옴

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => { ////로그인된 사람의 정보
      //console.log('user', user)

      //로그인이 된 상태
      if (user) {
        history.push("/"); //채팅페이지로 push
        dispatch(setUser(user)) //firebase에서 로그인된 사람의 정보를 user에 넣어줌
      }
      //로그인이 안된 상태
      else {
        history.push("login"); //로그인페이지로 push
        dispatch(clearUser())
      }
    })
  }, // eslint-disable-next-line
  [])

  if(isLoading){
    return(
      <div>
        ...loading
      </div>
    )
  }
  else{
  return (
      <div className="Apps">
        <Media queries={GLOBAL_MEDIA_QUERIES}>
          {matches => {
            console.log(matches);
            return(
            <>
              {matches.pc && <p>pc</p>}
              {matches.mobile && <p>mobile</p>}
            </>
            );  
          }}
        </Media>
        <Switch>
          <Route exact path="/" component={ChatPage}></Route>
          <Route exact path="/login" component={LoginPage}></Route>
          <Route exact path="/register" component={RegisterPage}></Route>
        </Switch>
      </div>
  );
 }
}

export default App;
