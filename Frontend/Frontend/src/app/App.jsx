import { RouterProvider } from "react-router"
import { router } from "./app.routes"
import { useAuth } from "../features/auth/hook/UseAuth"
import { useEffect } from "react"

function App() {
 

  const auth=useAuth()

  useEffect(()=>{
    auth.handlegetMe()
  },[])

  return (
    <><RouterProvider router={router}/></>
      
  )
}

export default App
