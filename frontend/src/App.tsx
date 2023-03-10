import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./components/Login"
import Home from "./components/Home"
import Signup from "./components/Signup"
import Npinheir from "./components/npinheir/Npinheir"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Home />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/npinheir' element={<Npinheir />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App