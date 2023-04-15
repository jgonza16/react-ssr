import { useState } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  console.log('render');

  return (
    <div className="App">
      <h1>Vite - React - client</h1>
      <div className="card">
        <button className='gap' onClick={() => setCount((count) => ++count)}>
          + 1
        </button>
        <button className='gap' onClick={() => setCount((count) => ++count)}>
          - 1
        </button>
        <p>count is {count}</p>
      </div>
    </div>
  )
}

export default App
