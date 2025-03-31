import { useState } from "react";
import { FaSearch, FaPaperPlane, FaSmile, FaUserAlt } from "react-icons/fa";
import { AiOutlinePicture } from "react-icons/ai";
import Layout from "@/component/layout";

const ChatApp = () => {
    const [messages, setMessages] = useState([
        { text: "สวัสดีครับ ข้าวหนูแดงครับ", sender: "other" },
        { text: "หอ Grove residence วงศ์สว่าง11 ห้อง 314", sender: "other" },
        { text: "โอเคครับผม", sender: "me" },
    ]);
    const [input, setInput] = useState("");
    const [selectedChat, setSelectedChat] = useState(1);
    const [image, setImage] = useState(null); // เก็บรูปที่เลือก

    const sendMessage = () => {
        if (input.trim() !== "") {
            setMessages([...messages, { text: input, sender: "me" }]);
            setInput("");
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") sendMessage();
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file)); // แปลงเป็น URL เพื่อแสดงภาพ
        }
    };

    return (
        <>
            <div className="grid grid-row-2 gap-1 mt-5">
                <div className="text-4xl font-bold mx-10">Chat</div>
                <div className="text-xs font-bold text-gray-400 ml-10">กล่องข้อความ</div>
            </div>

            <div className="flex h-[80vh] border-gray-300 bg-white shadow-lg p-6 rounded-xl m-5">
                {/* Sidebar */}
                <div className="w-1/4 bg-white p-4 border-r flex flex-col">
                    {/* Search Bar */}
                    <div className="flex items-center gap-2 mb-4 p-2 bg-gray-200 rounded-full">
                        <FaSearch className="text-black text-2xl" />
                        <input type="text" placeholder="ค้นหารายชื่อ" className="bg-transparent outline-none w-full" />
                    </div>

                    {/* Chat List */}
                    <div className="space-y-2 overflow-y-auto flex-1">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                onClick={() => setSelectedChat(item)}
                                className={`flex items-center p-3 rounded-lg cursor-pointer 
                                    ${selectedChat === item ? "bg-gray-300" : "hover:bg-gray-200"}`}
                            >
                                <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                                    <FaUserAlt className="text-[#773333]" />
                                </div>
                                <div className="ml-3">
                                    <div className="font-semibold">Kanunny</div>
                                    <div className="text-sm text-gray-500">สวัสดี! มีข้อความใหม่</div>
                                </div>
                                <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">3</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Chat Window */}
                <div className="w-3/4 flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-white p-4 border-b flex items-center">
                        <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center">
                            <FaUserAlt className="text-[#773333]" />
                        </div>
                        <span className="ml-3 font-semibold text-lg">Kanunny</span>
                    </div>

                    <div className="flex-1 p-4 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex items-center mb-2 ${msg.sender === "me" ? "justify-end" : "justify-start"}`}
                            >
                                {/* ถ้าเป็นข้อความของ "other" ให้มีไอคอนด้านซ้าย */}
                                {msg.sender === "other" && (
                                    <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center mr-2">
                                        <FaUserAlt className="text-[#773333]" />
                                    </div>
                                )}

                                <div
                                    className={`p-3 rounded-lg max-w-xs ${msg.sender === "me"
                                        ? "border bg-white shadow-lg text-black"
                                        : "border bg-white shadow-lg"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>


                    {/* Message Input */}
                    <div className="p-4 border-t bg-white flex items-center">
                        <button className="text-gray-500 px-2">
                            <FaSmile className="text-[#D90429] text-2xl" />
                        </button>

                        {/* ปุ่มอัปโหลดรูป */}
                        <label className="text-gray-500 px-2 cursor-pointer">
                            <AiOutlinePicture className="text-[#D90429] text-2xl" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                        </label>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="ส่งข้อความ"
                            className="flex-1 p-3 border rounded-full mx-2 outline-none"
                        />
                        <button onClick={sendMessage} className="text-blue-500 px-2">
                            <FaPaperPlane className="text-[#D90429] text-2xl" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

ChatApp.getLayout = (page) => <Layout>{page}</Layout>;
export default ChatApp;
