import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Home from './Home'
import Header from './Header'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="App">
        <Header />
        <h1>ログインを実装しようね</h1>
        <Home />
      </div>
    </>
  )
}

export default App
