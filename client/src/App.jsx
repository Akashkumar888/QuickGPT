import React, { useState } from 'react'
import { Routes,Route, useLocation } from 'react-router-dom'
import {ToastContainer} from 'react-toastify'
import ChatBox from './components/ChatBox'
import Sidebar from './components/Sidebar'
import Credits from './pages/Credits'
import Message from './components/Message'
import Community from './pages/Community'
import { assets } from './assets/assets'
import Loading from './pages/Loading'
import Login from './pages/Login'
import { useAppContext } from './context/AppContext'

const App = () => {
  const {user}=useAppContext();
  const [isMenuOpen,setIsMenuOpen]=useState(false);
  const {pathname}=useLocation();

 if(pathname==='/loading')return <Loading/>
  return (
    <>
    <ToastContainer/>

    {!isMenuOpen && <img src={assets.menu_icon} className='absolute top-3 left-3 w-8 h-8 cursor-pointer md:hidden not-dark:invert' onClick={()=>setIsMenuOpen(true)}/> }
    { user ? (
    <div className='dark:bg-gradient-to-b from-[#242421] to-[#000000] dark:text-white'>
      <div className='flex h-screen w-screen'>
        <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}/>
        <Routes>
          <Route path='/' element={<ChatBox/>}/>
          <Route path='/credits' element={<Credits/>}/>
          <Route path='/message' element={<Message/>}/>
          <Route path='/community' element={<Community/>}/>
        </Routes>
      </div>
    </div>
    ):
    (
    <div className="bg-gradient-to-b from-[#242124] to-[#000000] flex items-center justify-center h-screen w-screen">
      <Login/>
    </div>
    )
    }

    
    </>
  )
}

export default App

