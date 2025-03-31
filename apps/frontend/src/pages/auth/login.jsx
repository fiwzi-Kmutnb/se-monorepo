import React, { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import Link from "next/link";
import axios from "@/lib/axios";
import { setCookie } from "cookies-next";
import { useRouter } from "next/router";

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async(e) => {
    e.preventDefault();
    if(email == "" || !email.includes("@"))
      return toast.error("กรุณากรอกอีเมลให้ถูกต้อง")
    if(password == "")
      return toast.error("กรุณากรอกรหัสผ่าน")
    setLoading(true)
    await axios.post("/v1/guest/auth/login", {
      email,
      password,
    }).then((response) => {
      setCookie("token", response.data.data.token, { maxAge: 60 * 60 * 24 * 7 });
      toast.success("เข้าสู่ระบบสำเร็จ")
      setTimeout(() => {
        router.push("/panel/dashboard")
      }, 1000)
    }).catch((error) => {
      toast.error("อีเมลหรือรหัสผ่านไม่ถูกต้อง")
    }).finally(() => {
      setLoading(false)
    })
  };

  return (
    <>
    <Toaster 
     position="top-center"
          reverseOrder={false}
    />
      <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen bg-[#FFFAFA]">
      <div className="flex items-center col-span-3 justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-20">
          <h1 className="text-4xl font-semibold text-black text-center">
            ยินดีต้อนรับกลับมา!
          </h1>
          {error && <p className="text-red-500 text-center">{error}</p>}

          <div className="space-y-6">
            <div>
              <label className="block text-black mb-1">อีเมล</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลของท่าน"
                className="w-full p-3 border rounded-lg bg-[#F3F3F3] focus:outline-none  text-black"
              />
            </div>
    
            <div>
              <label className="block text-black mb-1">รหัสผ่าน</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="กรอกรหัสผ่านของท่าน"
                className="w-full p-3 border rounded-lg bg-[#F3F3F3] focus:outline-none text-black"
              />
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full bg-[#C43D2B] text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
            >
              {loading ? (
                <span class="loading loading-spinner loading-md"></span>
              ) : (
                "เข้าสู่ระบบ"  
              )}
            </button>

            <p className="text-center text-[#F93F5F] cursor-pointer hover:underline">
              <Link href={"/auth/forgotpassword"} >
                ลืมรหัสผ่านใช่หรือไม่? คลิกที่นี่
              </Link>
            </p>
          </div>
        </form>
      </div>

      <div className="bg-gradient-to-br max-md:hidden from-[#FF6464] col-span-2 to-[#993C3C] rounded-3xl m-4 mr-[3%]  flex items-center justify-center">
        <div className="text-center space-y-4 flex flex-col items-center justify-center p-8 ">
          <Image
            src="/assets/img/logo.svg"
            width={250}
            height={250}
            alt="logo"
          />
          <h2 className="text-white text-4xl font-bold">WELCOME TO</h2>
          <h3 className="text-white text-2xl">TUM GAP KAO MAI PEN</h3>
          <p className="text-white text-lg">Admin Panel Management</p>
        </div>
      </div>
    </div>
    </>
  );
}

export default LoginPage;
