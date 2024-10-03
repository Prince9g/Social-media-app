import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import React, { useState } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";

const LeftSideBar = () => {
    const navigate = useNavigate();
    const {user} = useSelector(store=>store.auth);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:8080/api/v1/user/logout', {withCredentials:true});
            console.log(res);
            if(res.data.success){
                dispatch(setAuthUser(null));
                navigate('/login');
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    }
    const sidebarHandler = (textType) => {
        if(textType === 'Logout'){
            logoutHandler();
        } else if(textType === 'Create'){
            setOpen(true);
        }
    }

    const sidebarItems = [
      { icon: <Home />, text: "Home" },
      { icon: <Search />, text: "Search" },
      { icon: <TrendingUp />, text: "Explore" },
      { icon: <MessageCircle />, text: "Messages" },
      { icon: <Heart />, text: "Notifications" },
      { icon: <PlusSquare />, text: "Create" },
      {
        icon: (
          <Avatar className="w-7 h-7">
            <AvatarImage src={user?.profilePicture} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ),
        text: "Profile",
      },
      { icon: <LogOut />, text: "Logout" }
    ];
  return (
  <div className="fixed sm:top-0 sm:z-10 sm:left-0 sm:px-4 sm:border-r sm:border-gray-300 sm:min-w-[16%] sm:h-screen ">
    <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div className="sm:fixed sm:top-0 sm:left-0  sm:flex-col sm:flex sm:relative fixed bottom-0 left-0 w-full z-10 flex justify-around bg-white">

        
    {sidebarItems.map((item, index) => {
        return (
            <div onClick={() => sidebarHandler(item.text)} key={index} className="flex items-center gap-4 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3">
                {item.icon}
                <span className="hidden lg:block">{item.text}</span>
            </div>
        )
    })
    }
    </div>
    </div>

    <CreatePost open={open} setOpen={setOpen}/>
  </div>
  )
};

export default LeftSideBar;
