
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {dummyChats,dummyUserData} from '../../src/assets/assets'
import api from '../api/axios'
import { toast } from "react-toastify";

const AppContext=createContext();


export const AppContextProvider=({children})=>{

  const navigate=useNavigate();
  const [user,setUser]=useState(null);
  const [chats,setChats]=useState([]);
  const [selectedChat,setSelectedChat]=useState(null);
  const [theme,setTheme]=useState(localStorage.getItem('theme') || 'light');
  
  const [token,setToken]=useState(localStorage.getItem("token") || null);
  const [loadingUser, setLoadingUser] = useState(true);



  const fetchUser=async()=>{
    try {
      const {data}=await api.get('/api/user/data',{
        headers:{
          Authorization:`Bearer ${token}`
        }
      });
      if(data.success){
       setUser(data.user);
      }
      else{
        toast.error(data.error);
      }
    } catch (error) {
      toast.error(error.message);
    }finally{
      setLoadingUser(false);
    }
  }

  const createNewChat=async()=>{
    try {
      
    } catch (error) {
      
    }
  }

  const fetchUserChats=async()=>{
      setChats(dummyChats);
      setSelectedChat(dummyChats[0]);
  }

  useEffect(()=>{
  if(theme==='dark'){
    document.documentElement.classList.add('dark');
  }
  else{
    document.documentElement.classList.remove('dark');
  }
  localStorage.setItem('theme',theme);
  },[theme])

  useEffect(()=>{
   if(user){
    fetchUserChats();
   }
   else{
    setChats([]);
    setSelectedChat(null);
   }
  },[user])

  useEffect(()=>{
    fetchUser();
  },[])
  

  const value={
    navigate,
    user,
    setUser,
    fetchUser,
    chats,
    setChats,
    selectedChat,
    setSelectedChat,
    theme,
    setTheme
  };

  return (
  <AppContext.Provider value={value}>
   {children}
  </AppContext.Provider>
  )
}

export const useAppContext=()=> useContext(AppContext);
