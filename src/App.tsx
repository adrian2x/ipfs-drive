import React from 'react'
import Routes from './routes/root'

function App() {
  return (
    <div className='App'>
      <nav className='nav'>
        <div className='nav-start'>
          <a className='brand' href='#'>
            IPFS Drive
          </a>
          <a>Link 1</a>
          <a className='active'>Link 2</a>
        </div>
        <div className='nav-end'>
          <a className='button outline'>Button</a>
        </div>
      </nav>

      <Routes />
    </div>
  )
}

export default App
