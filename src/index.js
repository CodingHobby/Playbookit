import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import firebase from 'firebase'
import './index.css'

// Firebase initialization
firebase.initializeApp({
  apiKey: "AIzaSyBaZp_EwJr0ROZbP5ynhB90Y-jNLAD8i3I",
  authDomain: "fiddles-1ea3a.firebaseapp.com",
  databaseURL: "https://fiddles-1ea3a.firebaseio.com",
  projectId: "fiddles-1ea3a",
  storageBucket: "fiddles-1ea3a.appspot.com",
  messagingSenderId: "745472223253"
})

ReactDOM.render(
  <App/>, document.getElementById('root')
)
