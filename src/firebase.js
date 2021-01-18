import firebase from "firebase/app";
import "firebase/auth"; //인증 사용할수 있게
import "firebase/database"; //데이터베이스 사용할 수 있게
import "firebase/storage";  //스토리지 사용할 수 있게


  // Your web app's Firebase configuration
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  var firebaseConfig = {
    apiKey: "AIzaSyA2lCYn5KPDIn7fsNak22fhIoS-EQTD-Xk",
    authDomain: "react-react-chat-app.firebaseapp.com",
    projectId: "react-react-chat-app",
    storageBucket: "react-react-chat-app.appspot.com",
    messagingSenderId: "465919921687",
    appId: "1:465919921687:web:0fb7bb44d68936d39d1652",
    measurementId: "G-7D4E89C53M"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics(); //통계를 보여주는부분
