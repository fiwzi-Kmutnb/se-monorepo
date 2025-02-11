import React, { useState } from "react";
import Image from "next/image";

function confirmpassword() {
 
    return (
    <div className="grid grid-cols-1 md:grid-cols-5 min-h-screen">
      <div className="flex items-center col-span-3 justify-center p-8">
        <form className="w-full max-w-md space-y-20">
          <h1 className="text-4xl font-semibold text-black text-center">
            ยืนยันรหัสผ่าน!
          </h1>

          <div className="space-y-6">
          <div>
            <label className="block text-black mb-1">รหัสผ่านใหม่</label>
            <input
              type="emaipassword"
              placeholder="กรอกรหัสผ่านของท่าน"
              className="w-full p-3 border rounded-lg bg-[#F3F3F3] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-black mb-1">ยืนยันรหัสผ่าน</label>
            <input
              type="password"
              placeholder="กรอกรหัสผ่านของท่าน"
              className="w-full p-3 border rounded-lg bg-[#F3F3F3] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#C43D2B] text-white py-3 rounded-lg hover:bg-red-700 transition duration-300"
          >
            เปลี่ยนรหัสผ่าน
          </button>
          </div>

        </form>
      </div>

      <div className="bg-gradient-to-br from-[#FF6464] col-span-2 to-[#993C3C] rounded-3xl m-4 mr-[7%]  flex items-center justify-center">
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
  );
}

export default confirmpassword;