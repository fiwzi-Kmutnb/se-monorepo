import Layout from "@/components/layout";
// import axios from "@/lib/axios";
import Image from "next/image";

const Order = () => {
    // const [, setOrderAccept] = useState([]);
    // const [, setOrderPending] = useState([]);
    // const fetchAccept = () => {
    //     axios.post("/v1/restricted/order/vieworder",{
    //         "status": "ACCEPTED"
    //     }).then((response) => {
    //         setOrderAccept(response.data.data)
    //     }).catch((e) => {

    //     })
    // }
    // const fetchPadding = () => {
    //     axios.post("/v1/restricted/order/vieworder",{
    //         "status": "PENDING"
    //     }).then((response) => {
    //         setOrderPending(response.data.data)
    //     }).catch((e) => {

    //     })
    // }
    return (
        <>

            <div className="border-gray-300 bg-white shadow-lg p-6 rounded-xl m-10">
                <table className="w-full border-collapse text-center mx-auto table-fixed">
                    <thead>
                        <tr>
                            <th className="text-gray-500 p-2 w-[10%]">ออเดอร์</th>
                            <th className="text-gray-500 p-2 w-[20%]">รายละเอียดสินค้าเพิ่มเติม</th>
                            <th className="text-gray-500 p-2 w-[20%]">ที่อยู่</th>
                            <th className="text-gray-500 p-2 w-[10%]">ราคา</th>
                            <th className="text-gray-500 p-2 w-[10%]">วันที่</th>
                            <th className="text-gray-500 p-2 w-[10%]">สถานะ</th>
                            <th className="text-gray-500 p-2 w-[10%]">สลิป</th>
                            <th className="text-gray-500 p-2 w-[10%]">Action</th>
                        </tr>
                    </thead>
                </table>
            </div>

            <div className="border-gray-300 bg-white shadow-lg p-6 rounded-xl m-10">
                <table className="w-full border-collapse text-center mx-auto table-fixed">
                    <tbody>
                        <tr>
                            <td className="p-2 w-[10%]">
                                <div className="flex items-center gap-1">
                                    <span className="text-[#EF233C] text-xl font-semibold">#00001</span>
                                    <span>คุณ</span>
                                    <span>kakakak</span>
                                </div>
                            </td>
                            <td className="p-2 w-[20%]">
                                <div className="flex flex-col justify-center">
                                    <li>
                                        ก๋วยเตี๋ยวหมูแดงหวาน x1
                                    </li>
                                    <span className="text-xs text-gray-500">
                                        พิเศษ | ไม่เอาผัก
                                    </span>
                                </div>

                            </td>
                            <td className="p-2 w-[20%]">หอ Grove residence วงศ์สว่าง11</td>
                            <td className="p-2 w-[10%]">฿189.00 (x1)</td>
                            <td className="p-2 w-[10%]">16-12-2567 14:13</td>
                            <td className="p-2 w-[10%]">
                                <div className="rounded-lg bg-[#E1D7FF] text-sm text-[#9068FF] px-4 py-1 mx-auto w-fit">ไม่จ่าย</div>
                            </td>
                            <td className="p-2 w-[10%]">
                                <button className="btn btn-sm bg-[#D90429] text-white rounded-full px-6">สลิป</button>
                            </td>
                            <td className="p-2 w-[10%]">
                                <button className="btn btn-sm bg-[#D90429] text-white rounded-full text-xs px-6">แก้ไข</button>
                                <button className="btn btn-sm bg-[#D90429] text-white rounded-full text-xs" onClick={() => document.getElementById('my_modal_1').showModal()}>ดูเพิ่มเติม</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>





            <dialog id="my_modal_1" className="modal">
                <div className="modal-box max-w-2xl p-5  rounded-xl shadow-lg">

                    <div className="flex justify-between">
                        <div className="flex flex-col items-start gap-2">
                            <div className="text-2xl">Ph. #ID001</div>
                            <span className=" text-gray-500">วันที่เวลา : <span className="text-black">16-12-2567 14:13</span></span>
                        </div>

                        <div className="items-end">
                            <form method="dialog">
                                <button className="text-gray-800 hover:text-red-700 text-lg">✖</button>
                            </form>
                        </div>

                    </div>


                    <div className="gird grid-cols-2 gap-2 mt-4">
                        <div className="flex flex-col gap-4 col-span-2 col-start-1 ml-2">
                            <div className="flex items-center gap-4">
                                <Image
                                    src="/assets/img/image.png"
                                    width={67}
                                    height={67}
                                    alt="logo"
                                    className="rounded-lg shadow-sm"
                                />

                                <div className="flex flex-col justify-center">
                                    <div className="text-xl font-medium">
                                        ก๋วยเตี๋ยวหมูแดงหวาน
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        พิเศษ | ไม่เอาผัก
                                    </div>
                                </div>

                                <div className="flex flex-col ml-auto">
                                    <div className="text-sm">
                                        ฿189.00
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        จำนวน: 1
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row justify-between mt-5 gap-2">
                        <div className="flex flex-col gap-2">
                            <div className="text-[13px] font-semibold ">ที่อยู่</div>
                            <div className="text-[13px] ">หอ Grove residence วงศ์สว่าง11</div>
                            <div className="text-[13px] ">ห้อง 314 เบอร์ 099-999-9911</div>
                        </div>


                        <div className="grid grid-cols-2 gap-2">
                            <div className="text-[13px] text-gray-500">ค่าสินค้า</div>
                            <div className="text-[13px] text-gray-500 ml-auto">฿189.00</div>
                            <div className="flex col-span-2 col-start-1 justify-between border-b border-dashed border-gray-300 ">
                                <div className="text-[13px] text-gray-500 ">ค่าส่ง</div>
                                <div className="text-[13px] text-gray-500 ml-auto ">฿0.00</div>
                            </div>
                            <div className="mt-auto text-[13px]">รวม</div>
                            <div className="ml-auto mt-auto text-[13px]">฿189.00</div>
                        </div>
                    </div>

                </div>
            </dialog>

        </>
    );
};

Order.getLayout = (page) => <Layout>{page}</Layout>;

export default Order;
