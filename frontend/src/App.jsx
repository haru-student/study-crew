import { useState } from 'react'
import './App.css'
import Home from './Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div class="App">
        <h1>ログインを実装しようね</h1>
        <Home />
      </div>
    </>
  )
}

export default App
