import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Home from './Home'
import Header from './Header'
import Footer from './Footer';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Header />
        <Home />
        <Footer />
      </div>
    </>
  )
}

export default App
