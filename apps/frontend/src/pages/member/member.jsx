import React from "react";
import Layout from "@/component/layout";
import { FaPlus, FaUser, FaTrash } from "react-icons/fa";
import Button1 from "@/component/button";

function Member() {
  return (
    <>
      <div className="mx-auto my-8 max-w-6xl p-5 rounded-lg bg-white shadow-lg min-h-[70vh]">
        <div className="flex md:flex-row justify-between items-center p-4">
          <div className="flex text-xl text-black gap-2">
            <FaUser />
            <p>Account member</p>
          </div>

          <button
            className="p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
            onClick={() => document.getElementById("my_modal_5").showModal()}
          >
            <p className="text-white">
              <FaPlus />
            </p>
          </button>
          <dialog
            id="my_modal_5"
            className="modal modal-bottom sm:modal-middle"
          >
            <div className="modal-box bg-white text-black max-w-lg w-full">
              <h3 className="font-bold text-lg text-center">
                เพิ่มสมาชิกเข้าสู่ระบบ
              </h3>
              <div className="pt-4 space-y-4">
                <label className="form-control w-full">
                  <span className="label-text text-black">Email</span>
                  <input
                    type="email"
                    placeholder="กรุณากรอกอีเมลของสมาชิก"
                    className="input input-bordered w-full bg-white"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-black">Username</span>
                  <input
                    type="text"
                    placeholder="กรุณากรอกชื่อผู้ใช้ของสมาชิก"
                    className="input input-bordered w-full bg-white"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-black">Password</span>
                  <input
                    type="password"
                    placeholder="กรุณากรอกรหัสผ่านของสมาชิก"
                    className="input input-bordered w-full bg-white"
                  />
                </label>
                <label className="form-control w-full">
                  <span className="label-text text-black">Role</span>
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

        <div className="overflow-x-auto border border-gray-300 shadow-md rounded-lg">
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
              {/* Row 1 */}
              <tr className="border-b border-gray-300">
                <th className="p-3">1</th>
                <td className="p-3">Cy Ganderton</td>
                <td className="p-3">cy@example.com</td>
                <td className="p-3">Admin</td>
                <td className="p-3 hidden md:table-cell">16-12-2567 14:13</td>
                <td className="p-3 flex justify-center gap-2">
                  <Button1 />
                  <button className="p-3 rounded-xl bg-red-500 hover:bg-red-600">
                    <FaTrash className="text-white" />
                  </button>
                </td>
              </tr>
              {/* Row 2 */}
              <tr className="border-b border-gray-300">
                <th className="p-3">2</th>
                <td className="p-3">Hart Hagerty</td>
                <td className="p-3">hart@example.com</td>
                <td className="p-3">Member</td>
                <td className="p-3 hidden md:table-cell">16-12-2567 14:13</td>
                <td className="p-3 flex justify-center gap-2">
                  <Button1 />
                  <button className="p-3 rounded-xl bg-red-500 hover:bg-red-600">
                    <FaTrash className="text-white" />
                  </button>
                </td>
              </tr>
              {/* Row 3 */}
              <tr>
                <th className="p-3">3</th>
                <td className="p-3">Brice Swyre</td>
                <td className="p-3">brice@example.com</td>
                <td className="p-3">Member</td>
                <td className="p-3 hidden md:table-cell">16-12-2567 14:13</td>
                <td className="p-3 flex justify-center gap-2">
                  <Button1 />
                  <button className="p-3 rounded-xl bg-red-500 hover:bg-red-600">
                    <FaTrash className="text-white" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

Member.getLayout = (page) => <Layout>{page}</Layout>;

export default Member;
