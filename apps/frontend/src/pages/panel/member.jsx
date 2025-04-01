import React from "react";
import Layout from "@/components/layout";
import { FaPlus, FaTrash, FaPencilRuler } from "react-icons/fa";
import axios from "@/lib/axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";

function Member() {
  const [members, setMembers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);

  const [createMember, setCreateMember] = useState({
    email: "",
    username: "",
    password: "",
    role: 0,
  });

  const modalEdit = (id) => {
    setSelectedMember(members.find((member) => member.id === id));
    document.getElementById("my_modal_6").showModal();
  };
  const handleEdit = async () => {
    setLoading(true);
    axios
      .patch(
        `/v1/restricted/member/${selectedMember.id}`,
        {
          role: currentRole,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("แก้ไขข้อมูลสมาชิกสำเร็จ");
        fetchMembers();
        document.getElementById("my_modal_6").close();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  const handleDelete = async (id) => {
    if (confirm("คุณต้องการลบสมาชิกนี้ใช่หรือไม่?"))
      axios
        .delete(`/v1/restricted/member/${id}`, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
        .then((response) => {
          toast.success("ลบสมาชิกสำเร็จ");
          setMembers(members.filter((member) => member.id !== id));
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
  };
  const handleAdd = async () => {
    const { email, username, password, role } = createMember;
    if (!email || !username || !password || !role) {
      toast.error("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }
    axios
      .post(
        "/v1/restricted/member",
        {
          email,
          username,
          password,
          role,
        },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("เพิ่มสมาชิกสำเร็จ");
        fetchMembers();
        setCreateMember({
          email: "",
          username: "",
          password: "",
          role: 0,
        });
        // setMembers([...members, response.data.data]);
        document.getElementById("my_modal_5").close();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchMembers = async () => {
    axios
      .get("/v1/restricted/member", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setMembers(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const fetchRole = async () => {
    axios
      .get("/v1/restricted/permission", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((response) => {
        console.log(response.data.data);
        setRoles(response.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  useEffect(() => {
    fetchMembers();
    fetchRole();
  }, []);
  return (
    <>
      <Toaster zindex={9999} position="top-center" reverseOrder={false} />
      <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black">
          <h3 className="font-bold text-lg text-center">แก้ไขข้อมูลสมาชิก</h3>
          <div>
            <div className="pt-4">
              <label className="form-control w-full max-w-md ">
                <div className="label ">
                  <span className="label-text text-black">อีเมล</span>
                </div>
                <input
                  type="email"
                  placeholder="กรุณากรอกอีเมลของสมาชิก"
                  value={selectedMember?.email}
                  className="input input-bordered w-full disabled:bg-gray-100 disabled:border-none disabled:text-gray-600  bg-white"
                  disabled
                />
                <div className="label ">
                  <span className="label-text text-black">ชื่อผู้ใช้</span>
                </div>
                <input
                  value={selectedMember?.username}
                  type="text"
                  placeholder="กรุณากรอกชื่อผู้ใช้ของสมาชิก"
                  className="input input-bordered w-full disabled:bg-gray-100 disabled:border-none disabled:text-gray-600  bg-white"
                  disabled
                />
                <div className="label ">
                  <span className="label-text text-black">บทบาท</span>
                </div>
                <select
                  defaultChecked={selectedMember?.role.id}
                  onChange={(e) => {
                    setCurrentRole(Number(e.target.value));
                  }}
                  className="select select-bordered bg-white"
                >
                  <option disabled selected>
                    เลือกตำแหน่งของสมาชิก
                  </option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
          <div className="modal-action flex justify-between gap-2">
            <form method="dialog">
              <button className="text-white p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300">
                ยกเลิก
              </button>
            </form>
            <button
              disabled={loading}
              onClick={handleEdit}
              className="text-white p-3 rounded-xl bg-green-600 shadow-lg transition-all duration-200 hover:bg-green-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
            >
              {loading ? (
                <span class="loading loading-spinner loading-md"></span>
              ) : (
                "ยืนยัน"
              )}
            </button>
          </div>
        </div>
      </dialog>
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black max-w-lg w-full">
          <h3 className="font-bold text-lg text-center">
            เพิ่มสมาชิกเข้าสู่ระบบ
          </h3>
          <div className="pt-4 space-y-4">
            <label className="form-control w-full">
              <span className="label-text text-black">อีเมล</span>
              <input
                onChange={(e) =>
                  setCreateMember({
                    ...createMember,
                    email: e.target.value,
                  })
                }
                type="email"
                placeholder="กรุณากรอกอีเมลของสมาชิก"
                className="input input-bordered w-full bg-white"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-black">ชื่อผู้ใช้</span>
              <input
                onChange={(e) => {
                  setCreateMember({
                    ...createMember,
                    username: e.target.value,
                  });
                }}
                type="text"
                placeholder="กรุณากรอกชื่อผู้ใช้ของสมาชิก"
                className="input input-bordered w-full bg-white"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-black">รหัสผ่าน</span>
              <input
                onChange={(e) => {
                  setCreateMember({
                    ...createMember,
                    password: e.target.value,
                  });
                }}
                type="password"
                placeholder="กรุณากรอกรหัสผ่านของสมาชิก"
                className="input input-bordered w-full bg-white"
              />
            </label>
            <label className="form-control w-full">
              <span className="label-text text-black">บทบาท</span>
              <select
                onChange={(e) => {
                  setCreateMember({
                    ...createMember,
                    role: Number(e.target.value),
                  });
                }}
                className="select select-bordered bg-white"
              >
                <option disabled selected>
                  เลือกตำแหน่งของสมาชิก
                </option>
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="modal-action flex justify-between">
            <form method="dialog">
              <button className="text-white p-3 rounded-xl bg-gray-800 shadow-lg hover:bg-gray-700">
                ยกเลิก
              </button>
            </form>
            <button
              disabled={loading}
              onClick={handleAdd}
              className="text-white p-3 rounded-xl bg-green-600 shadow-lg hover:bg-green-700"
            >
              {loading ? (
                <span class="loading loading-spinner loading-md"></span>
              ) : (
                "ยืนยัน"
              )}
            </button>
          </div>
        </div>
      </dialog>

      <div className="grid grid-cols-12">
        <div className="col-span-10 col-start-2">
             <div className="grid grid-row-2 gap-1 mt-10">
                        <div className="text-4xl font-bold bg-gray mx-10">Member</div>
                        <div className="text-xs font-bold text-gray-400 ml-10">
                          พนักงาน
                        </div>
                      </div>
                      <div className="mx-auto flex justify-end p-5 mt-[-80px]">
                        <button
                          className="p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
                          onClick={() => document.getElementById("my_modal_5").showModal()}
                        >
                          <p className="text-white">
                            <FaPlus />
                          </p>
                        </button>
                      </div>
          <div className="mx-auto p-5 bg-white shadow-lg rounded-lg">
            <div className="overflow-x-auto rounded-xl">
              <table className="table w-full">
                <thead>
                  <tr className=" text-black text-[13px] ">
                    <th className="p-3">UserID</th>
                    <th className="p-3">ชื่อผู้ใช้</th>
                    <th className="p-3">อีเมล</th>
                    <th className="p-3">ตำแหน่ง</th>
                    <th className="p-3 hidden md:table-cell">
                      เข้าสู่ระบบล่าสุด
                    </th>
                    <th className="p-3">ตั้งค่า</th>
                  </tr>
                </thead>
                <tbody>
                  {members.map((member, i) => (
                    <tr key={member.id}>
                      <th className="p-3">{i + 1}</th>
                      <td className="p-3">{member.username}</td>
                      <td className="p-3">{member.email}</td>
                      <td className="p-3">{member.role.name}</td>
                      <td className="p-3 hidden md:table-cell">
                        {new Date(
                          member.logLogin?.[0]?.createdAt
                        ).toLocaleDateString("th-TH", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="p-3 flex justify-center gap-2">
                        <button
                          className="p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
                          onClick={() => modalEdit(member.id)}
                        >
                          <p className="text-white">
                            <FaPencilRuler />
                          </p>
                        </button>

                        <button
                          onClick={() => handleDelete(member.id)}
                          className="p-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-red-300"
                        >
                          <FaTrash className="text-white" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

Member.getLayout = (page) => <Layout>{page}</Layout>;

export default Member;
