import React, { useRef, useState } from "react";
import Layout from "@/component/layout";
import Image from "next/image";
import { FaCamera, FaPhotoVideo } from "react-icons/fa";

function Broadcast() {
  const fileInputRef = useRef(null);
  const [image, setImage] = useState(null);
  const [text, setText] = useState("");

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleTextChange = (event) => {
    setText(event.target.value);
  };

  return (
    <div className="min-h-screen p-6 flex flex-col items-center ">
      <div className="text-start w-full max-w-5xl">
        <p className="font-semibold text-2xl sm:text-3xl text-black">
          BroadCast
        </p>
        <p className="text-gray-600">ประกาศทางไลน์</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6 w-full max-w-5xl">
        <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center gap-4 w-full">
          <div
            className={`w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 rounded-xl shadow-md relative flex justify-center items-center bg-gray-300 ${image ? "bg-cover bg-center" : ""}`}
            style={image ? { backgroundImage: `url(${image})` } : {}}
          >
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
            <div
              className="absolute bg-gray-800 text-white rounded-xl px-4 py-2 cursor-pointer hover:bg-gray-700 text-xs md:text-sm"
              onClick={handleClick}
            >
              อัพโหลดภาพ
            </div>
          </div>
          <textarea
            className="textarea h-32 w-full bg-gray-50 shadow-inner border rounded-lg p-2 resize-none"
            placeholder="ใส่ข้อความ"
            value={text}
            onChange={handleTextChange}
          ></textarea>
          <button className="bg-red-600 hover:bg-red-700 text-sm w-full text-white py-2 px-4 rounded-lg shadow-md">
            ส่งข้อความไปยังลูกค้า
          </button>
        </div>
        <div className="flex justify-center w-full">
          <div className="mockup-phone border-primary w-64 sm:w-72 md:w-80">
            <div className="camera"></div>
            <div className="display bg-[#839EBC]">
              <div className="artboard phone-1 flex h-fit flex-col justify-between text-black w-full">
                <div className="h-16 flex justify-center pt-4 items-center px-4 bg-[#464E61] text-white">
                  <p>ลูกค้า</p>
                </div>

                <div className="flex flex-col p-4 space-y-4 overflow-y-auto">
                  {text && (
                    <div className="w-2/3 max-w-xs bg-[#AFEF86] text-black p-3 rounded-lg self-start">
                      {text}
                    </div>
                  )}
                  {image && (
                    <div className="w-2/3 max-w-xs bg-[#AFEF86] text-black p-3 rounded-lg self-start">
                      <Image
                        src={image}
                        alt="Uploaded Image"
                        width={150}
                        height={150}
                        className="w-36 h-36 sm:w-44 sm:h-44"
                      />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-[#FFFFFF]">
                  <div className="flex gap-4">
                    <FaCamera className="text-2xl text-gray-600" />
                    <FaPhotoVideo className="text-2xl text-gray-600" />
                  </div>
                  <input
                    type="text"
                    className="w-3/4 ml-2 mr-5 bg-[#D9D9D9] p-2 rounded-2xl text-sm text-gray-500"
                    placeholder="พิมพ์ข้อความ..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Broadcast.getLayout = (page) => <Layout>{page}</Layout>;

export default Broadcast;
