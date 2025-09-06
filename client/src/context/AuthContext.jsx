import { createContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {io} from "socket.io-client";



const backendUrl = import.meta.env.VITE_BACKEND_URL;
axios.defaults.baseURL = backendUrl;

export const AuthContext = createContext();

export const AuthProvider = ({children})=>{
    
    // const [currentUser, setCurrentUser] = useState(null);
    const[token,setToken] = useState(localStorage.getItem("token"))
    const[authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem("chat-user")) || null)
    const[onlineUsers,setOnlineUsers] = useState([]);
    const[socket,setSocket] = useState(null);


    //Check if user is authenticated and if so, set the user data and connect the socket

    const checkAuth = async()=>{    
        try{
            const{data} = await axios.get("/api/auth/check");
            if(data.success){
                setAuthUser(data.user);
                localStorage.setItem("chat-user", JSON.stringify(data.user));
                connectSocket(data.user);
            }
        }catch(error){
            toast.error(error.message);
        }
    }

//Login function to handle user authentication and socket token

const login = async (state,credentials)=>{
   
    try{
        const {data} = await axios.post(`/api/auth/${state}`,credentials);
        if(data.success){
            setAuthUser(data.userData);
            localStorage.setItem("chat-user", JSON.stringify(data.userData)); // ✅
            axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
            setToken(data.token);
            localStorage.setItem("token",data.token)
            connectSocket(data.userData);
            toast.success(data.message)
            console.log(data)
            localStorage.setItem("userId", data?.userData?._id)
        }else{
            toast.error(data.message);
            logout();
        }
    }catch(error){
        toast.error(error.message);
        logout();
    }
}

//Logout function to handle user logout and disconnect the socket disconnection
const logout = async()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("chat-user");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    delete axios.defaults.headers.common["Authorization"];
    if(socket)socket.disconnect();
    axios.defaults.headers.common["token"]=null;
    toast.success("Logged out successfully");
    
}

    // Update profile function to handle user profile updates 
    const updateProfile = async (body)=>{
        try{
            const {data} = await axios.put("/api/auth/update-profile",body);
            if(data.success){
                const updatedUser = {
          ...data.user,
          profilePic: data.user.profilePic
            ? `${data.user.profilePic}?v=${Date.now()}`
            : null,};

                setAuthUser(updatedUser);
                localStorage.setItem("chat-user", JSON.stringify(updatedUser));
                toast.success("Profile updated successfully");
            }
        }catch(error){
            toast.error(error.message);
        }
    }

    //connect sockt function to handle socket conection and online users updates
    const connectSocket=(userData)=>{
        if(!userData || socket?.connected) return;
        const newSocket = io(backendUrl,{
            query:{
                userId:userData._id,
            }
            });
            newSocket.connect();
            setSocket(newSocket);

            newSocket.on("getOnlineUsers",(userIds)=>{
                setOnlineUsers(userIds);
            })

    }


    useEffect(()=>{
    // const user = JSON.parse(localStorage.getItem("chat-user")); // adjust key
    // setCurrentUser(user);

        if(token){
            axios.defaults.headers.common["Authorization"]=`Bearer ${token}`;
            checkAuth();
        }
    },[token])


    const value = {
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return(
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}