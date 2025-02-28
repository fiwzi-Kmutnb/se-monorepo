import React from "react";
import { FaPlus, FaUser, FaPencilRuler, FaTrash } from "react-icons/fa";

function button() {
  return (
    <>
      <button
        className="p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
        onClick={() => document.getElementById("my_modal_6").showModal()}
      >
        <p className="text-white">
          <FaPencilRuler />
        </p>
      </button>
      <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black">
          <h3 className="font-bold text-lg text-center">แก้ไขข้อมูลสมาชิก</h3>
          <div>
            <div className="pt-4">
              <label className="form-control w-full max-w-md ">
                <div className="label ">
                  <span className="label-text text-black">Email</span>
                </div>
                <input
                  type="email"
                  placeholder="กรุณากรอกอีเมลของสมาชิก"
                  value="example@email.com"
                  className="input input-bordered w-full disabled:bg-gray-400 disabled:border-none disabled:text-gray-600  bg-white"
                  disabled
                />
                <div className="label ">
                  <span className="label-text text-black">Username</span>
                </div>
                <input
                  type="text"
                  placeholder="กรุณากรอกชื่อผู้ใช้ของสมาชิก"
                  className="input input-bordered w-full  bg-white"
                />
                <div className="label ">
                  <span className="label-text text-black">Password</span>
                </div>
                <input
                  type="Password"
                  placeholder="กรุณากรอกรหัสผ่านของสมาชิก"
                  value="12131313131"
                  className="input input-bordered w-full bg-white  disabled:bg-gray-400 disabled:border-none disabled:text-gray-600"
                  disabled
                />
                <div className="label ">
                  <span className="label-text text-black">Role</span>
                </div>
                <select className="select select-bordered bg-white">
                  <option disabled selected>
                    เลือกตำแหน่งของสมาชิก
                  </option>
                  <option>Star Wars</option>
                  <option>Harry Potter</option>
                  <option>Lord of the Rings</option>
                  <option>Planet of the Apes</option>
                  <option>Star Trek</option>
                </select>
              </label>
            </div>
          </div>
          <div className="modal-action flex justify-between gap-2">
            <form method="dialog">
              {/* if there is a button in form, it will close the modal */}
              <button className="text-white p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300">
                ยกเลิก
              </button>
            </form>
            <button className="text-white p-3 rounded-xl bg-green-600 shadow-lg transition-all duration-200 hover:bg-green-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300">
              ยืนยัน
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
}

export default button;
