import Layout from "@/component/layout";
import Image from "next/image";

function HistoryOrder() {
  return (
    <>
      <div className="grid grid-row-2 gap-1 mt-10">
        <div className="text-4xl font-bold bg-gray mx-10">Order History</div>
        <div className="text-xs font-bold text-gray-400 ml-10">
          ประวัติการสั่งซื้อ
        </div>
      </div>

      <div className=" border-gray-300 bg-white shadow-lg p-6 rounded-lg m-10">
        <div className="flex flex-row justify-between p-4">
          <div className="text-xl font-bold">
            Order#ID001{" "}
            <span className="text-xs text-gray-400"> Dec 16, 2024 14:13</span>{" "}
          </div>
          <div className="text-xl font-bold text-[#23C60E] ml-auto">
            Complete
          </div>
        </div>

        <div className="grid grid-cols-5 gap-2 mt-5 p-4">
          <div className="flex flex-col gap-3 col-span-2 col-start-1">
            <div className="text-2xl font-semibold text-[#EF233C] ml-[10%]">
              รายละเอียดสินค้า
            </div>

            <div className="flex items-center gap-4 px-4 ml-[10%]">
              <Image
                src="/assets/img/image.png"
                width={67}
                height={67}
                alt="logo"
                className="rounded-lg shadow-sm"
              />

              <div className="flex flex-col justify-center">
                <div className="text-xl font-medium">ก๋วยเตี๋ยวหมูแดงหวาน</div>
                <div className="text-xs text-gray-500">
                  พิเศษ | ไม่เอาผักแต่เอาเธอ
                </div>
              </div>

              <div className="flex flex-col ml-[20%]">
                <div className="text-sm">฿189.00</div>
                <div className="text-xs text-gray-500">จำนวน 1 ชิ้น</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2 col-span-2 col-start-3 ml-[30%]">
            <div className="text-2xl font-semibold text-[#EF233C]">
              รายละเอียดการจัดส่ง
            </div>
            <div className="text-xs">
              <span className="text-xl font-semibold">ชื่อลูกค้า:</span> sud lor
              CS
            </div>
            <div className="text-xs">
              หอ Grove residence วงศ์สว่าง11 ห้อง 314
            </div>
          </div>

          <div className="flex flex-col gap-2 col-span-1 col-start-5">
            <div className="text-2xl font-semibold text-[#EF233C] text-end">
              สรุปรายการ
            </div>

            <div className="self-end">
              <button
                className="btn bg-[#2B2D42] rounded-full text-white text-xs p-4"
                onClick={() =>
                  document.getElementById("my_modal_1").showModal()
                }
              >
                ดูเพิ่มเติม
              </button>
              <dialog id="my_modal_1" className="modal">
                <div className="modal-box max-w-2xl p-5  rounded-xl shadow-lg">
                  <div className="flex justify-between ">
                    <div className="flex flex-col">
                      <div className="text-2xl">
                        Order <span className=" text-gray-500">#ID001</span>
                      </div>
                      <span className=" text-gray-500">
                        วันที่เวลา :{" "}
                        <span className="text-black">16-12-2567 14:13</span>
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <form method="dialog">
                        <button className="text-gray-800 hover:text-red-700 text-lg">
                          ✖
                        </button>
                      </form>

                      <div className="w-[80px] mr-[10%]">
                        <button className="btn bg-[#D9D9D9] rounded-full text-[14px] w-full h-min">
                          ดูสลิป
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="gird grid-cols-2 gap-2 mt-5">
                    <div className="flex flex-col gap-3 col-span-2 col-start-1 ml-2">
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
                            พิเศษ | ไม่เอาผักแต่เอาเธอ
                          </div>
                        </div>

                        <div className="flex flex-col ml-auto">
                          <div className="text-sm">฿189.00</div>
                          <div className="text-xs text-gray-500">จำนวน: 1</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-row justify-between mt-5">
                    <div className="flex flex-col gap-1">
                      <div className="text-[13px] ">
                        <span className="text-[17px] font-semibold">
                          ชื่อลูกค้า:
                        </span>{" "}
                        sud lor CS
                      </div>
                      <div className="text-[13px] ">
                        หอ Grove residence วงศ์สว่าง11
                      </div>
                      <div className="text-[13px] ">
                        ห้อง 314 เบอร์ 099-999-9911
                      </div>
                      <span className="text-gray-500 text-[13px] mt-1">
                        Delivery Date{" "}
                        <span className="text-gray-800">
                          Dec 16, 2024{" "}
                          <span className="text-gray-500">
                            {" "}
                            | ชำระเงินผ่าน{" "}
                            <span className="text-gray-800">COD</span> 14:20
                          </span>
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-[13px] text-gray-500">ค่าสินค้า</div>
                      <div className="text-[13px] text-gray-500 ml-auto">
                        ฿189.00
                      </div>
                      <div className="flex col-span-2 col-start-1 justify-between border-b border-dashed border-gray-300 ">
                        <div className="text-[13px] text-gray-500 ">ค่าส่ง</div>
                        <div className="text-[13px] text-gray-500 ml-auto ">
                          ฿0.00
                        </div>
                      </div>
                      <div className="mt-auto text-[13px]">รวม</div>
                      <div className="ml-auto mt-auto text-[13px]">฿189.00</div>
                    </div>
                  </div>
                </div>
              </dialog>
            </div>
          </div>
        </div>

        <div className="flex flex-row justify-between mt-4 p-4">
          <div className=" text-gray-500 mt-5">
            Delivery Date{" "}
            <span className="font-semibold text-gray-500">Dec 16, 2024</span> |
            ชำระเงินผ่าน{" "}
            <span className="font-semibold text-gray-500">COD</span> 14:20{" "}
          </div>
          <div className="flex flex-col justify-items-stretch">
            <div>ราคารวม: 189.00 บาท</div>
            <div className="text-xs text-gray-500 ml-auto">รวม: 1 ชิ้น</div>
          </div>
        </div>
      </div>
    </>
  );
}

HistoryOrder.getLayout = (page) => <Layout>{page}</Layout>;

export default HistoryOrder;
