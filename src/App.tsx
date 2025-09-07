import { Outlet } from "react-router"
import CommomLayout from "./components/layout/CommomLayout"

 
function App() { 

  return (
    <> 
     <CommomLayout>
      <Outlet />
     </CommomLayout>
    </>
  )
}

export default App
