  import { RouterProvider } from "react-router-dom"
  import { router } from "./app.routes"
  import { useAuth } from "../features/auth/hook/UseAuth"
  import { useEffect } from "react"
  import { useAuthInit } from "../features/auth/hook/UseAuthInit"

  function App() {
  


useAuthInit();

    return (
      <><RouterProvider router={router}/></>
        
    )
  }

  export default App
