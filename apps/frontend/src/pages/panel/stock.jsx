import React, { useState } from "react";
import Layout from "@/components/layout";
import { FaPlus } from "react-icons/fa";
import axios from "@/lib/axios";
import { getCookie } from "cookies-next";
import { useEffect } from "react";
import { useRef } from "react";
import toast from "react-hot-toast";
import { Toaster } from "react-hot-toast";
import { MdAttachFile } from "react-icons/md";

function Stock() {
  const [product, setProduct] = useState([]);
  const [addFormProduct, setAddFormProduct] = useState({
    name: "",
    price: "",
    info: "",
    quantity: 1,
    status: true,
  })
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [addFile, setAddFile] = useState(null);
  const fetchProduct = async () => {
    axios
      .get("/v1/authroized/product", {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
        },
      })
      .then((res) => {
        setProduct(res.data.data.data);
      });
  };
  const createProduct = async (e) => {
    e.preventDefault();
    if(!addFile)
        return toast.error("กรุณาอัปโหลดไฟล์");
    if(!addFormProduct.name)
        return toast.error("กรุณากรอกชื่อสินค้า");
    if(!addFormProduct.price)
        return toast.error("กรุณากรอกราคา");
    if(!addFormProduct.quantity)
        return toast.error("กรุณากรอกจำนวนสินค้า");
    if(!addFormProduct.info)
        return toast.error("กรุณากรอกรายละเอียดสินค้า");
    if(!addFormProduct.status)
       return toast.error("กรุณาเลือกสถานะสินค้า");
    const formData = new FormData();
    formData.append("name", addFormProduct.name);
    formData.append("price", addFormProduct.price);
    formData.append("quantity", addFormProduct.quantity);
    formData.append("info", addFormProduct.info);
    formData.append("status", addFormProduct.status);
    formData.append("files", addFile);
    setLoading(true);
    axios.post(
      "/v1/authroized/product",
        formData,
      {
        headers: {
          Authorization: `Bearer ${getCookie("token")}`,
            "Content-Type": "multipart/form-data",
        },
      }
    ).then((e) => {
        document.getElementById("add").close();
        toast.success("เพิ่มสินค้าเรียบร้อย");
        fetchProduct();
    }).catch((e) => {
        toast.error(e.response.data.message);
    }).finally(() => {
        setLoading(false)
    })
  };
  const deleteProduct = async (id) => {
  if(confirm("จะทำการลบสินค้าหรือไม่")) {
    axios
    .delete(`/v1/authroized/product/${id}`, {
      headers: {
        Authorization: `Bearer ${getCookie("token")}`,
      },
    })
    .then((res) => {
      toast.success("ลบสินค้าเรียบร้อย");
      fetchProduct();
    })
    .catch((err) => {
      toast.error(err.response.data.message);
    });
  }
  }
const fileInput = useRef(null);
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <>
    <Toaster
     position="top-center"
          reverseOrder={false}
    />
      <dialog id="add" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <div className="flex flex-col items-center">
            <input type="file" hidden 
            accept="image/*"
                ref={fileInput}
            onChange={(e) => {
                setAddFile(e.target.files[0]);
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  setImagePreview(reader.result);
                };
                if (file) {
                  reader.readAsDataURL(file);
                } else {
                  setImagePreview(null);
                }
            }}
            />
            <button className={`w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center ${imagePreview ? "bg-cover bg-center" : ""}`}
             style={imagePreview ? { backgroundImage: `url(${imagePreview})` } : {}}
             onClick={() => fileInput.current.click()}  
             >
                <MdAttachFile/>
            </button>
          </div>

          <form 
            onSubmit={createProduct}
          >
          <div className="mt-4">
            <label className="block text-sm font-semibold">ชื่อสินค้า:</label>
            <input

                onChange={(e) => setAddFormProduct({...addFormProduct, name: e.target.value})}
              type="text"
              placeholder="กรอกชื่อวัตถุดิบ"
              className="input input-bordered w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <label className="block text-sm font-semibold">ราคา:</label>
              <input
                min={1}
                onChange={(e) => setAddFormProduct({...addFormProduct, price: e.target.value})}
                type="number"
                className="input input-bordered w-full"
                placeholder="00.00"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold">จำนวน:</label>
              <input
                min={1}
                onChange={(e) => setAddFormProduct({...addFormProduct, quantity: e.target.value})}
                type="number"
                className="input input-bordered w-full"
                placeholder="00.00"
              />
            </div>
          </div>

          <div className="mt-2">
            <label className="block text-sm font-semibold">
              รายละเอียดสินค้า:
            </label>
            <textarea
                onChange={(e) => setAddFormProduct({...addFormProduct, info: e.target.value})}
              className="textarea textarea-bordered w-full"
              placeholder="กรอกรายละเอียด"
            ></textarea>
          </div>
          <label className="form-control w-full ">
            <div className="label">
              <label className="block text-sm font-semibold">สถานะ:</label>
            </div>
            <div className="form-control w-52">
              <label className="label cursor-pointer">
                <span className="label-text">เปิดการใช้งาน</span>
                <input
                    onChange={(e) => setAddFormProduct({...addFormProduct, status: e.target.checked})}
                  type="checkbox"
                  className="toggle toggle-accent"
                  defaultChecked
                />
              </label>
            </div>
          </label>
          <div className="flex justify-end mt-4">
            <button disabled={loading} type="submit" className="btn bg-gray-800 text-white px-4 py-2 rounded-lg">
            {loading ? (
                <span class="loading loading-spinner loading-md"></span>
            ): ("บันทึกข้อมูล")}
            </button>
          </div>
          </form>
        </div>
      </dialog>
      <dialog id="edit" class="modal">
        <div class="modal-box">
          <form method="dialog">
            <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 class="text-lg font-bold">Hello!</h3>
          <p class="py-4">Press ESC key or click on ✕ button to close</p>
        </div>
      </dialog>
      <div className="grid grid-cols-12 ">
        <div className="col-span-10 col-start-2">
          <div className="grid grid-row-2 gap-1 mt-10">
            <div className="text-4xl font-bold bg-gray mx-10">Stock</div>
            <div className="text-xs font-bold text-gray-400 ml-10">
              คลังสินค้า
            </div>
          </div>
          <div className="mx-auto flex justify-end p-5 mt-[-80px]">
            <button
              className="p-3 rounded-xl bg-gray-800 shadow-lg transition-all duration-200 hover:bg-gray-700 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-gray-300"
              onClick={() => document.getElementById("add").showModal()}
            >
              <p className="text-white">
                <FaPlus />
              </p>
            </button>
          </div>

          <div className="mx-auto  p-5 bg-white shadow-lg min-h-[70vh] rounded-3xl mt-[20px]">
            <div className="overflow-x-auto">
              <table className="table w-full">
                <thead>
                  <tr className="">
                    <th>#</th>
                    <th>ชื่อสินค้า</th>
                    <th>รูปภาพ</th>
                    <th>รายละเอียด</th>
                    <th>ราคา</th>
                    <th>มีในสต็อก</th>
                    <th>สถานะ</th>
                    <th>จัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  {product?.map((item, index) => (
                    <tr key={item.id} className="hover:bg-gray-100">
                      <td>{index + 1}</td>
                      <td>{item.name}</td>
                      <td>
                        <img
                          src={process.env.NEXT_PUBLIC_API_IMAGE + "/product/" + item.img_product}
                          alt={item.name}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                      </td>
                      <td className="max-w-xs truncate">{item.info}</td>
                      <td>{item.price}</td>
                      <td>{item.quantity} ชิ้น</td>
                      <td>
                        <span
                          className={`badge px-3 py-1 text-white ${
                            item.status === true
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        >
                            {item.status === true ? "พร้อม" : "ไม่พร้อม"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-outline btn-sm rounded-3xl"
                          onClick={() =>
                            document.getElementById("edit").showModal()
                          }
                        >
                          แก้ไข
                        </button>
                        <button  
                            onClick={() => deleteProduct(item.id)}
                            className="btn btn-error btn-sm ml-2 rounded-3xl">
                          ลบ
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
      {/* 
      {isModalOpen && (
        <dialog
          id="my_modal_3"
          className="modal modal-bottom sm:modal-middle"
          open
        >
          <div className="modal-box relative">
            <form method="dialog">
              <button
                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                onClick={handleModalToggle}
              >
                ✕
              </button>
            </form>

            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                <button className="bg-gray-800 text-white px-2 py-2 rounded-lg">
                  อัปโหลดภาพ
                </button>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-semibold">Name</label>
              <input
                type="text"
                placeholder="กรอกชื่อวัตถุดิบ"
                className="input input-bordered w-full"
                defaultValue={currentItem?.name || ""}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-2">
              <div>
                <label className="block text-sm font-semibold">Price</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="00.00"
                  defaultValue={currentItem?.price || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Amount</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="00.00"
                  defaultValue={currentItem?.stock || ""}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold">Discount</label>
                <input
                  type="number"
                  className="input input-bordered w-full"
                  placeholder="00.00"
                />
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-sm font-semibold">
                Discristions
              </label>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="กรอกรายละเอียด"
                defaultValue={currentItem?.description || ""}
              ></textarea>
            </div>

            <div className="flex items-center space-x-2 mt-2">
              <span className="text-sm font-semibold">Status :</span>
              <span className="badge badge-success">พร้อม</span>
              <span className="badge badge-error">ไม่พร้อม</span>
            </div>
            <div className="flex justify-end mt-4">
              <button className="btn bg-gray-800 text-white px-4 py-2 rounded-lg">
                บันทึกข้อมูล
              </button>
            </div>
          </div>
        </dialog>
      )} */}
    </>
  );
}

Stock.getLayout = (page) => <Layout>{page}</Layout>;

export default Stock;
