import React from "react";
import Layout from "@/component/layout";
import { FaPlus, FaUser, FaTrash } from "react-icons/fa";
import Button1 from "@/component/button";

const members = [
  {
    id: 1,
    name: "Cy Ganderton",
    email: "cy@example.com",
    role: "Admin",
    lastLogin: "16-12-2567 14:13",
  },
  {
    id: 2,
    name: "Hart Hagerty",
    email: "hart@example.com",
    role: "Member",
    lastLogin: "16-12-2567 14:13",
  },
  {
    id: 3,
    name: "Brice Swyre",
    email: "brice@example.com",
    role: "Member",
    lastLogin: "16-12-2567 14:13",
  },
];

function Member() {
  return (
    <>
      <div className="mx-auto  max-w-6xl flex justify-end p-5">
        <button
          className="p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
          onClick={() => document.getElementById("my_modal_5").showModal()}
        >
          <p className="text-white">
            <FaPlus />
          </p>
        </button>
        <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
          <div className="modal-box bg-white text-black max-w-lg w-full">
            <h3 className="font-bold text-lg text-center">
              เพิ่มสมาชิกเข้าสู่ระบบ
            </h3>
            <div className="pt-4 space-y-4">
              <label className="form-control w-full">
                <span className="label-text text-black">อีเมล</span>
                <input
                  type="email"
                  placeholder="กรุณากรอกอีเมลของสมาชิก"
                  className="input input-bordered w-full bg-white"
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-black">ชื่อ-นามสกุล</span>
                <input
                  type="text"
                  placeholder="กรุณากรอกชื่อผู้ใช้ของสมาชิก"
                  className="input input-bordered w-full bg-white"
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-black">รหัสผ่าน</span>
                <input
                  type="password"
                  placeholder="กรุณากรอกรหัสผ่านของสมาชิก"
                  className="input input-bordered w-full bg-white"
                />
              </label>
              <label className="form-control w-full">
                <span className="label-text text-black">บทบาท</span>
                <select className="select select-bordered bg-white">
                  <option disabled selected>
                    เลือกตำแหน่งของสมาชิก
                  </option>
                  <option>Admin</option>
                  <option>Member</option>
                </select>
              </label>
            </div>
            <div className="modal-action flex justify-between">
              <form method="dialog">
                <button className="text-white p-3 rounded-xl bg-gray-800 shadow-lg hover:bg-gray-700">
                  ยกเลิก
                </button>
              </form>
              <button className="text-white p-3 rounded-xl bg-green-600 shadow-lg hover:bg-green-700">
                ยืนยัน
              </button>
            </div>
          </div>
        </dialog>
      </div>
      <div className="mx-auto  max-w-6xl p-5 l bg-white shadow-lg min-h-[70vh]">
        <div className="flex md:flex-row justify-start items-center p-4">
          <div className="flex text-xl text-black gap-2">
            <FaUser />
            <p>Account member</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-gray-300  rounded-3xl">
          <table className="table text-black text-center min-w-full">
            <thead>
              <tr className="border-b border-gray-300 text-black text-[16px] bg-gray-100">
                <th className="p-3">UserID</th>
                <th className="p-3">ชื่อ-นามสกุล</th>
                <th className="p-3">อีเมล</th>
                <th className="p-3">ตำแหน่ง</th>
                <th className="p-3 hidden md:table-cell">เข้าสู่ระบบล่าสุด</th>
                <th className="p-3">ตั้งค่า</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id} className="border-b border-gray-300">
                  <th className="p-3">{member.id}</th>
                  <td className="p-3">{member.name}</td>
                  <td className="p-3">{member.email}</td>
                  <td className="p-3">{member.role}</td>
                  <td className="p-3 hidden md:table-cell">
                    {member.lastLogin}
                  </td>
                  <td className="p-3 flex justify-center gap-2">
                    <Button1 />
                    <button className="p-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300">
                      <FaTrash className="text-white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Member.getLayout = (page) => <Layout>{page}</Layout>;

export default Member;
