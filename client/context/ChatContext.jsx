import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // functions to get all users for sidebar

  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnseenMessages(data.unseenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to get messages for selected user
  const getMessages = async (userId) => {
    // console.log('hii')
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      
      if (data.success) {
        setMessages(data.messages);
        // console.log('data',data.messages)
        // console.log(messages)
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // function to send messages to selected user
  const sendMessage = async (messageData) => {
    try {
      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        messageData
      );
    //   console.log('data',data)
      if (data.success) setMessages((prevMessages) => [...prevMessages, data.newMessage]);
    } catch (error) {
      toast.error(error.message);
    }
  };

  //function to subscribe to messages for selected user
  const subscribeToMessages = async () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
        console.log(newMessage)
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessages((prevUnseenMessages) => ({
          ...prevUnseenMessages,
          [newMessage.senderId]: prevUnseenMessages[newMessage.senderId]
            ? prevUnseenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  //function to unsubscribe from messages
  const unsubscribeFromMessages = () =>{
    if(socket) socket.off("newMessage");
  }

  useEffect(()=>{
    subscribeToMessages();
    return ()=>{
        unsubscribeFromMessages();
    }
  },[socket,selectedUser])

  const value = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    getMessages,
    sendMessage,
    setSelectedUser,
    unseenMessages,
    setUnseenMessages
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
