import { useState } from "react";
import { FaSearch, FaPaperPlane, FaSmile, FaUserAlt } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import Layout from "@/components/layout";
import { useEffect } from "react";
import axios from "@/lib/axios";
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";
import toast from "react-hot-toast";
import { getCookie } from "cookies-next";
import { useRef } from "react";
let socket;
const ChatApp = () => {
  const [chat, setChat] = useState([]);
  const [messages, setMessages] = useState([
    { text: "สวัสดีครับ ข้าวหนูแดงครับ", sender: "other" },
    { text: "หอ Grove residence วงศ์สว่าง11 ห้อง 314", sender: "other" },
    { text: "โอเคครับผม", sender: "me" },
  ]);
  const [input, setInput] = useState("");
  const chatBoxRef = useRef(null);
  const selectedChatRef = useRef(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [template, setTemplate] = useState(null);
  const [image, setImage] = useState(null);
  const [newChat, setNewChat] = useState([]);
  const [msgNotRead, setMsgNotRead] = useState([]);
  useEffect(() => {
    selectedChatRef.current = selectedChat;
  }, [selectedChat]);
  const onFilter = (e) => {
    const value = e.target.value;
    if (value) {
      if (template == null) setTemplate(chat);
      const filter = chat?.filter((item) => {
        return item.displayName.toLowerCase().includes(value.toLowerCase());
      });
      setChat(filter);
    } else {
      setChat(template);
      setTemplate(null);
    }
  };

  const sendMessage = (e) => {
    if (input.trim() !== "") {
      const newMessage = { message: input, userID: selectedChat.UserID };
      Array.isArray(newChat) && newChat.length > 0
        ? setNewChat((prev) => [
            ...prev,
            { text: input, type: "text", sender: "admin" },
          ])
        : setNewChat([{ text: input, type: "text", sender: "admin" }]);
      socket.emit("sendmessage", newMessage);
      setInput("");
      setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }, 50);
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };
  const getChats = async () => {
    axios.get("v1/restricted/chat").then((response) => {
      setChat(response.data.data.data);
    });
  };
  const newMSG = async (msg) => {
    const currentSelected = selectedChatRef.current;
    getChats();
    if (currentSelected && currentSelected.UserID === msg.cusID) {
      setNewChat((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        { text: msg.message, type: "text", sender: "self" },
      ]);
      setTimeout(() => {
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }, 50);
    } else {
      setMsgNotRead((prev) => [...(Array.isArray(prev) ? prev : []), msg]);
      setUn((prev) => [
        ...(Array.isArray(prev) ? prev : []),
        msg,
      ]);
    }
  };
  useEffect(() => {
    getChats();
    socket = io(process.env.NEXT_PUBLIC_API_SOCKET, {
      transports: ["websocket"],
      auth: {
        token: `Bearer ${getCookie("token")}`,
      },
    });
    console.log(socket);

    socket.on("connect", () => {
      console.log("Connected", socket.id);
    });
    socket.on("MsgError", (msg) => {
      toast.error(msg.message);
    });
    socket.on("new-message", (msg) => {
      newMSG(msg);
      toast.success("มีข้อความใหม่!");
    });

    //   socket.on("message", (msg) => {
    //     setMessages((prev) => [...prev, msg]);
    //   });
  }, []);
  const [un,setUn] = useState([])
  const selectend = (item) => {
    setSelectedChat(item);
    setNewChat(null);
    // setNewChat((prev) => [
    //     ...(Array.isArray(prev) ? prev : []),
    //     { text: msg.message, type: "text", sender: "self" },
    //   ]);
    setMsgNotRead((prev) => prev.filter((msg) => msg.cusID !== item.UserID));
    setTimeout(() => {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }, 50);
  };

  return (
    <>
      <Toaster zindex={9999} position="top-center" reverseOrder={false} />
      <div className="grid grid-cols-12 max-md:grid-cols-2 md:h-[85vh] border-gray-300 bg-white shadow-lg p-6 rounded-xl m-5">
        <div className=" col-span-4 bg-white p-4 border-r flex flex-col">
          <div className="flex items-center gap-2 mb-4 p-2 bg-gray-200 rounded-full">
            <FaSearch className="text-black text-2xl" />
            <input
              type="text"
              placeholder="ค้นหารายชื่อ"
              className="bg-transparent outline-none w-full"
              onKeyUp={onFilter}
            />
          </div>
          <div className="space-y-2 overflow-y-auto flex-1">
            {chat?.map((item) => (
              <div
                key={item}
                onClick={() => selectend(item)}
                className={`flex items-center p-3 rounded-lg cursor-pointer 
                                    ${selectedChat === item ? "bg-gray-300" : "hover:bg-gray-200"}`}
              >
                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                  <img
                    src={item.pictureUrl}
                    alt="user"
                    className="w-full h-full rounded-full"
                  />
                </div>
                <div className="ml-3">
                  <div className="font-semibold">{item.displayName}</div>
                  <div className="text-sm text-gray-500">
                    {(item.chat[0].data
                      .filter((chat) => chat.typeSender == "self")
                      .slice(-1)[0]?.type == "text"
                      ? item.chat[0].data
                          .filter((chat) => chat.typeSender == "self")
                          .slice(-1)[0]?.text
                      : "- ส่งรูปภาพ") || "ไม่มีข้อความ"}
                  </div>
                </div>
                {msgNotRead.filter((msg) => msg.cusID == item.UserID).length >
                  0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {
                      msgNotRead.filter((msg) => msg.cusID == item.UserID)
                        .length
                    }
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="col-span-8 flex flex-col">
          <div className="bg-white p-4 border-b flex items-center">
            <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
              {selectedChat && (
                <img
                  src={selectedChat?.pictureUrl}
                  alt="user"
                  className="w-full h-full rounded-full"
                />
              )}
            </div>
            <span className="ml-3 font-semibold text-lg">
              {selectedChat?.displayName || "เลือกผู้ใช้"}
            </span>
          </div>
          {!selectedChat && (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">ไม่มีข้อความ</p>
            </div>
          )}
          <div
            className="flex-1 p-4 overflow-y-auto md:max-h-[60vh]"
            ref={chatBoxRef}
          >
            {selectedChat?.chat[0].data.map((msg, index) => (
              <div
                key={index}
                className={`flex items-center mb-2 ${msg.typeSender !== "self" ? "justify-end" : "justify-start"}`}
              >
                {msg.typeSender !== "self" && (
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-2">
                    <FaUserAlt className="text-[#773333]" />
                  </div>
                )}
                <div
                  className={`p-3 rounded-lg max-w-xs ${
                    msg.typeSender !== "self"
                      ? "border bg-white shadow-lg text-black"
                      : "border bg-white shadow-lg"
                  }`}
                >
                  {msg.type === "text" ? (
                    msg.text
                  ) : (
                    <img
                      src={
                        process.env.NEXT_PUBLIC_API_IMAGE + "/slip/" + msg.text
                      }
                      alt="image"
                      className="w-32 h-32 rounded-lg"
                    />
                  )}
                </div>
              </div>
            ))}
              {un &&
              un?.filter((msg => msg.cusID == selectedChat?.UserID))?.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center mb-2 justify-start`}
                >
                  <div
                    className={`p-3 rounded-lg max-w-xs border bg-white shadow-lg`}
                  >
                    {msg.type === "text" ? (
                      msg.message
                    ) : (
                      <img
                        src={
                          process.env.NEXT_PUBLIC_API_IMAGE +
                          "/slip/" +
                          msg.message
                        }
                        alt="image"
                        className="w-32 h-32 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
              {newChat &&
              newChat.map((msg, index) => (
                <div
                  key={index}
                  className={`flex items-center mb-2 ${msg.sender !== "self" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender !== "self" && (
                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-2">
                      <FaUserAlt className="text-[#773333]" />
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-xs ${
                      msg.sender !== "self"
                        ? "border bg-white shadow-lg text-black"
                        : "border bg-white shadow-lg"
                    }`}
                  >
                    {msg.type === "text" ? (
                      msg.text
                    ) : (
                      <img
                        src={
                          process.env.NEXT_PUBLIC_API_IMAGE +
                          "/slip/" +
                          msg.text
                        }
                        alt="image"
                        className="w-32 h-32 rounded-lg"
                      />
                    )}
                  </div>
                </div>
              ))}
          </div>
          {selectedChat && (
            <div className="p-4 border-t bg-white flex items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="ส่งข้อความ"
                className="flex-1 p-3 border rounded-full mx-2 outline-none shadow"
              />
              <button
                onClick={sendMessage}
                type="submit"
                className="text-blue-500 px-2"
              >
                <FaPaperPlane className="text-[#D90429] text-2xl" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

ChatApp.getLayout = (page) => <Layout>{page}</Layout>;
export default ChatApp;
