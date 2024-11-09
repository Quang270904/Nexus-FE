import { AddPhotoAlternate } from "@mui/icons-material";
import AddIcCallIcon from "@mui/icons-material/AddIcCall";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import VideoCallIcon from "@mui/icons-material/VideoCall";
import { Avatar, Backdrop, Grid, IconButton } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SockJS from "sockjs-client";
import Stom from "stompjs";
import { createMessage, getAllChats } from "../../Redux/Message/message.action";
import SearchUser from "../../components/SearchUser/SearchUser";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import ChatMessage from "./ChatMessage";
import "./Message.css";
import UserChatCard from "./UserChatCard";

const Message = () => {
  const dispatch = useDispatch();

  const [currentChat, setCurrentChat] = useState();
  const [messages, setMessages] = useState([]);
  const [selectedImage, setSelectedImage] = useState();
  const [loading, setLoading] = useState(false);
  const [stompClient, setStompClient] = useState(null);
  const chatContainerRef=useRef(null)

  const { message, auth } = useSelector((store) => store);

  console.log("chats  ", message);

  const handleSelectImage = async (e) => {
    setLoading(true);
    console.log("image");
    const imgUrl = await uploadToCloudinary(e.target.files[0], "image");
    setSelectedImage(imgUrl);
    setLoading(false);
  };

  const handelCreateMessage = (value) => {
    const message = {
      chatId: currentChat?.id,
      content: value,
      image: selectedImage,
    };
    dispatch(createMessage({ message, sendMessageToServer }));
  };

  useEffect(() => {
    dispatch(getAllChats());
  }, []);

  // useEffect(() => {
  //   setMessages([...messages, message.message]);
  // }, [message.message]);

  useEffect(() => {
    const sock = new SockJS("http://localhost:1010/ws");
    const stomp = Stom.over(sock);
    setStompClient(stomp);

    stomp.connect({}, onConnect, onErr);
  }, []);

  const onConnect = () => {
    console.log("websocket connected...");
  };

  const onErr = (error) => {
    console.log("err", error);
  };

  useEffect(() => {
    if (stompClient && auth.user && currentChat) {
      const subscription = stompClient.subscribe(
        `/user/${currentChat.id}/private`,
        onMessageReice
      );
    }
  });

  const sendMessageToServer = (newMessage) => {
    if (stompClient && newMessage) {
      stompClient.send(
        `/app/chat/${currentChat?.id.toString()}`,
        {},
        JSON.stringify(newMessage)
      );
    }
  };

  const onMessageReice = (payload) => {
    const recivedMessage = JSON.parse(payload.body);
    console.log("message revice from websocket", recivedMessage);
    setMessages([...messages, recivedMessage]);
  };

  useEffect(()=>{
    if(chatContainerRef.current){
      chatContainerRef.current.scrollTop= chatContainerRef.current.scrollHeight;
    }
  },[messages])
  return (
    <div>
      <Grid container className="h-screen overflow-y-hidden">
        <Grid className="px-5" item xs={3}>
          <div className="flex h-full justify-between space-x-2">
            <div className="w-full ">
              <div className="flex space-x-4 items-center py-5">
                <ArrowBackIosNewIcon />
                <h1 className="text-xl font-bold ">Home</h1>
              </div>
              <div className="h-[83vh">
                <div className="">
                  <SearchUser />
                </div>
                <div className="h-full space-y-4 mt-5 overflow-y-scroll hideScrollbar">
                  {message.chats.map((item) => (
                    <div
                      onClick={() => {
                        setCurrentChat(item);
                        setMessages(item.messages);
                      }}
                    >
                      <UserChatCard key={item.id} chat={item} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Grid>
        <Grid className="h-full" item xs={9}>
          {currentChat ? (
            <div>
              <div className="flex justify-between items-center border-1 p-5">
                <div className="flex items-center space-x-3">
                  <Avatar src="https://media.istockphoto.com/id/864516870/photo/young-woman-photographing-the-autumn-season.jpg?s=612x612&w=0&k=20&c=M3G2SwKJ15zolsSaFABsneLitdWXCrrJ3LkTEKnIOys=" />
                  <p>
                    {auth.user?.id === currentChat.users[0].id
                      ? currentChat.users[1].firstName +
                        " " +
                        currentChat.users[1].lastName
                      : currentChat.users[0].firstName +
                        " " +
                        currentChat.users[0].lastName}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <IconButton>
                    <AddIcCallIcon />
                  </IconButton>
                  <IconButton>
                    <VideoCallIcon />
                  </IconButton>
                </div>
              </div>

              <div ref={chatContainerRef} className="hideScrollbar overflow-y-scroll h-[82vh] px-2 space-x-5 py-5">
                {messages.map((item) => (
                  <ChatMessage item={item} />
                ))}
              </div>
              <div className="sticky bottom-0 border-1">
                {selectedImage && (
                  <img
                    className="w-[5rem] h-[5rem] object-cover px-2"
                    src={selectedImage}
                    alt=""
                  />
                )}
                <div className="py-5 flex items-center justify-center space-x-5">
                  <input
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && e.target.value) {
                        handelCreateMessage(e.target.value);
                        setSelectedImage("");
                      }
                    }}
                    className="bg-transparent border border-[#3b40544] rounded-full w-[90%] py-3 px-5"
                    placeholder="Type message..."
                  />
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSelectImage}
                      className="hidden"
                      id="image-input"
                    />
                    <label htmlFor="image-input">
                      <AddPhotoAlternate />
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full space-x-5 flex flex-col justify-center items-center">
              <ChatBubbleOutlineIcon sx={{ fontSize: "15rem" }} />
              <p className="text-xl font-semibold">No chat selected</p>
            </div>
          )}
        </Grid>
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
};

export default Message;
