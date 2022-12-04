import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from './home'

export default function () {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home key={Math.random()} />} />
        <Route path='/:path/*' element={<Home key={Math.random()} />} />
      </Routes>
    </BrowserRouter>
  )
}
