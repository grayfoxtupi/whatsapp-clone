import { useEffect } from 'react'
import Navbar from "./components/Navbar"
import { Route, Routes, Navigate, useLocation  } from "react-router-dom"
import LoginPage from "./pages/LoginPage"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import SettingsPage from "./pages/SettingsPage"
import SignUp from "./pages/SignUpPage"
import { Toaster } from 'react-hot-toast';
import { Loader } from 'lucide-react'

import useAuthStore  from "./hooks/useAuthStore"
import useThemeStore from './hooks/useThemStore'

function App() {
  const location = useLocation()
  
  const authUser = useAuthStore((state) => (state.authUser))
  // it can be like this to: const authUser = useAuthStore().getState().authUser 
  const checkAuth = useAuthStore((state) => (state.checkAuth))
  const isCheckingAuth = useAuthStore((state) => (state.isCheckingAuth))
  const theme = useThemeStore((store) => store.theme)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  console.log("OOOOOOOOOOO",authUser)

  //  if(isCheckingAuth && !authUser)
  //    return (
  //      <div className='flex items-center justify-center h-screen'>
  //        <Loader className='size-10 animate-spin' />
  //      </div>
  //    )

  return (
    <div data-theme={theme} className="flex flex-col h-screen w-screen">

    <Navbar />

    {/* Div para dar espaço abaixo da Navbar */}
    <div className="pt-16 h-full w-full">
      <Routes key={location.pathname}>
        <Route path="/login" element={!authUser ? <LoginPage /> : <Navigate to={"/"} />} />
        <Route path="/" element={authUser ? <HomePage /> : <Navigate to={"/login"} />} />
        <Route path="/profile" element={authUser ? <ProfilePage /> : <Navigate to={"/login"} />} />
        <Route path="/settings" element={authUser ? <SettingsPage /> : <Navigate to={"/login"} />} />
        <Route path="/signup" element={ !authUser ? <SignUp /> : <Navigate to={"/"} /> } />
      </Routes>
    </div>

    <div><Toaster/></div>

  </div>
  )
}

export default App
