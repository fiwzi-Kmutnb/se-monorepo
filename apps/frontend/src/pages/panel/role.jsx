import React from "react";
import Layout from "@/components/layout";
import { FaPlus, FaTrash, FaPencilRuler } from "react-icons/fa";
import axios from "@/lib/axios";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
const perm =  {
    "memberRegister": 1,
    "memberEditRoles": 2,
    "rolesCreate": 4,
    "rolesEdit": 8,
    "stockEdit": 16,
    "productEdit": 32,
    "historyOrder": 64,
    "dashboardAnalysis": 128,
    "lineChat": 256,
    "broadCast": 512,
    "logSystem": 1024
  }
function Role() {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState({
    name: "",
    id: 0,
    permission: 0,
    permissions: [],
  });
  const [loading, setLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState(0);

  const [createRole, setCreateRole] = useState({
    name: "",
    permissions: [],
  });

  const modalEdit = (id) => {
    const role = roles.find((role) => role.id === id);
    const perms = [];
    Object.entries(perm).map(([key, value]) => {
        if(!!(value & role.permission)){
            perms.push(key);
        }
    })
    setSelectedRole({
        ...selectedRole,
        id: role.id,
        name: role.name,
        permission: role.permission,
        permissions: perms,
    });
    setTimeout(() => {
        document.getElementById("my_modal_6").showModal();
    }, 300);
  };
  const handleEdit = async () => {
    setLoading(true);
    axios
      .patch(
        `/v1/restricted/permission/${selectedRole.id}`,
        selectedRole,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("แก้ไขข้อมูลสมาชิกสำเร็จ");
        fetchRole();
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
        .delete(`/v1/restricted/permission/${id}`, {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        })
        .then((response) => {
          toast.success("ลบตำแหน่งสำเร็จ");
            fetchRole();
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
  };
  const handleAdd = async () => {
    const { name, permissions } = createRole;
    if (name === "") return toast.error("กรุณากรอกชื่อตำแหน่ง");
    if (permissions.length === 0) return toast.error("กรุณาเลือกสิทธิ์การเข้าถึง");
    axios
      .post(
        "/v1/restricted/permission",
        createRole,
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      )
      .then((response) => {
        toast.success("เพิ่มสมาชิกสำเร็จ");
        fetchRole();
        setCreateRole({
          name: "",
            permissions: [],
        });
        document.getElementById("my_modal_5").close();
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setLoading(false);
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
    fetchRole();
  }, []);
  return (
    <>
      <Toaster zindex={9999} position="top-center" reverseOrder={false} />
      <dialog id="my_modal_6" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black">
          <h3 className="font-bold text-lg text-center">
            แก้ไขข้อมูลสมาชิก
          </h3>
          <div className="pt-4 space-y-4">
          <label className="form-control w-full">
              <span className="label-text text-black">ชื่อตำแหน่ง</span>
              <input
                defaultValue={selectedRole.name}
                onChange={(e) =>
                    setSelectedRole({
                        ...selectedRole,
                        name: e.target.value,
                    })
                }
                type="text"
                placeholder="กรุณากรอกชื่อตำแหน่ง"
                className="input input-bordered w-full bg-white"
              />
            </label>
            <label className="form-control w-full">
                <div>
                <span className="label-text text-black">สิทธิ์การเข้าถึง</span>
                </div>
                <div>
                    {Object.entries(perm).map(([key, value]) => (
                        <div class="form-control">
                        <label class="label cursor-pointer">
                          <span class="label-text">
                            {key} <span className="text-gray-400">({parseInt(value)})</span>
                          </span>
                          <input type="checkbox" class="checkbox"
                            checked={selectedRole.permissions.includes(key)}
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setSelectedRole({
                                    ...selectedRole,
                                    permissions: [...selectedRole.permissions, key],
                                    });
                                } else {
                                    setSelectedRole({
                                    ...selectedRole,
                                    permissions: selectedRole.permissions.filter(
                                        (perm) => perm !== key
                                    ),
                                    });
                                }
                            }}
                          />
                        </label>
                      </div>
                    ))}
                </div>
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
              onClick={handleEdit}
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
      <dialog id="my_modal_5" className="modal modal-bottom sm:modal-middle">
        <div className="modal-box bg-white text-black max-w-lg w-full">
          <h3 className="font-bold text-lg text-center">
            เพิ่มตำแหน่งใหม่
          </h3>
          <div className="pt-4 space-y-4">
            <label className="form-control w-full">
              <span className="label-text text-black">ชื่อตำแหน่ง</span>
              <input
                onChange={(e) =>
                    setCreateRole({
                        ...createRole,
                        name: e.target.value,
                    })
                }
                type="text"
                placeholder="กรุณากรอกชื่อตำแหน่ง"
                className="input input-bordered w-full bg-white"
              />
            </label>
            <label className="form-control w-full">
                <div>
                <span className="label-text text-black">สิทธิ์การเข้าถึง</span>
                </div>
                <div>
                    {Object.entries(perm).map(([key, value]) => (
                        <div class="form-control">
                        <label class="label cursor-pointer">
                          <span class="label-text">
                            {key} <span className="text-gray-400">({parseInt(value)})</span>
                          </span>
                          <input type="checkbox" class="checkbox"
                            onChange={(e) => {
                                if (e.target.checked) {
                                    setCreateRole({
                                    ...createRole,
                                    permissions: [...createRole.permissions, key],
                                    });
                                } else {
                                    setCreateRole({
                                    ...createRole,
                                    permissions: createRole.permissions.filter(
                                        (perm) => perm !== key
                                    ),
                                    });
                                }
                            }}
                          />
                        </label>
                      </div>
                    ))}
                </div>
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
                        <div className="text-4xl font-bold bg-gray mx-10">Role</div>
                        <div className="text-xs font-bold text-gray-400 ml-10">
                            จัดการบทบาท
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
              <table className="table w-full text-center">
                <thead>
                  <tr className=" text-black text-[13px] ">
                    <th className="p-3">#</th>
                    <th className="p-3">ชื่อยศ</th>
                    <th className="p-3">สิทธิ์การเข้าถึง</th>
                    <th className="p-3">ตั้งค่า</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((member, i) => (
                    <tr key={member.id}>
                      <th className="p-3">{i + 1}</th>
                      <td className="p-3">{member.name}</td>
                      <td className="p-3">
                        {
                            Object.entries(perm).map(([key, value]) => {
                                if(!!(value & member.permission)){
                                    return (
                                        <>
                                            <div className="badge badge-outline">{key}</div>
                                        </>
                                    )
                                }
                            })
                        }
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

Role.getLayout = (page) => <Layout>{page}</Layout>;

export default Role;
