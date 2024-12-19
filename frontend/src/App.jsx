import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Home from './Home'
import Header from './Header'
import Footer from './Footer';
import {auth} from "./firebase";
import {useAuthState} from "react-firebase-hooks/auth";

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <div>
        <Header user={user} />
        <Home />
        <Footer />
      </div>
    </>
  )
}

export default App
