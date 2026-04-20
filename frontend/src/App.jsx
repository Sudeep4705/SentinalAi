import { BrowserRouter, Route, Routes } from "react-router-dom"
import UserLayout from "./Layouts/UserLayout"
import Events from "./Pages/Events"
function App(){
  return (
    <>
     <BrowserRouter>
     <Routes>
      <Route path="/" element={<UserLayout/>}>
          <Route index element={<Events/>}/>
      </Route>
     </Routes>
     </BrowserRouter>
    </>
  )
}
export default App
