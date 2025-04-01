import axios from '@/lib/axios';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
const Rider = () => {
    const data = useParams()
    const router = useRouter();
     const { token } = router.query;
    const fetch = () => {
        axios.get("/v1/guest/order/"+token).then((response) => {
            console.log(response.data.data)
        }).catch((error) => {
            // router.push("/")
        })
    }
    const handleClick = () => {
        axios.post("/v1/guest/order/"+token).then((response) => {
            
        }).catch((error) => {
            // router.push("/")
        })
    }
    useEffect(() => {
        fetch()
    },[router.isReady])
    return (
        <div className='bg-[#FFFAFA] absolute inset-0'>
            <div className="logo-details mt-6">
                <img
                    src="/logo.svg"
                    className="p-2 rounded-2xl w-80 mx-auto logo"
                    alt=""
                />
            </div>
            <Toaster zindex={9999} position="top-center" reverseOrder={false} />
            <div className="border-gray-300 bg-white shadow-[-2px_-4px_17px_rgba(0,0,0,0.2)] p-6 rounded-[4rem] w-fit mx-auto mt-10">


                <div className="flex justify-center text-2xl font-semibold mt-4">
                    Delivery Detils | รายละเอียดการจัดส่งสินค้า
                </div>

                <div className="grid lg:grid-cols-7 md:grid-cols-6 gap-12 p-6 grid-cols-1">

                    <div className='flex flex-col gap-4 lg:col-span-3 md:col-span-2'>
                        <div className="text-[#EF233C] font-semibold text-xl">สินค้า</div>
                        <div className="flex flex-row gap-4">
                            <Image
                                src="/assets/img/image.png"
                                width={67}
                                height={67}
                                alt="logo"
                                className="rounded-lg shadow-sm"
                            />
                            <div className="flex flex-col justify-center">
                                <div className="text-xl">
                                    ก๋วยเตี๋ยวหมูแดงหวาน
                                </div>
                                <div className="text-xs text-gray-500">
                                    พิเศษ | ไม่เอาผักแต่เอาเธอ
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:col-start-4 ml-auto  md:col-span-2">
                        <div className="text-[#EF233C] font-semibold text-xl">ราคา</div>
                        <div>
                            <div className="text-sm">
                                ฿189.00
                            </div>
                            <div className="text-xs text-gray-500">
                                จำนวน: 1
                            </div>
                        </div>

                    </div>

                    <div className="flex flex-col gap-4 lg:col-span-2 md:col-span-2">
                        <div className="text-[#EF233C] font-semibold text-xl">รายละเอียดการจัดส่ง</div>
                        <div className="flex flex-col">
                            <div className="text-[13px] "><span className="text-[17px] font-semibold">ชื่อลูกค้า:</span> sud lor CS</div>
                            <div className="text-[13px] ">หอ Grove residence วงศ์สว่าง11</div>
                            <div className="text-[13px] ">ห้อง 314</div>
                            <div className="text-[13px]"><span className='text-[17px] font-semibold'>เบอร์</span> 099-999-9911</div>
                        </div>
                    </div>

                    <div className='flex flex-col gap-1 col-span-3 col-start-2 ml-auto mt-auto'>
                        <div className="text-sm">
                            ราคารวม: 189.00 บาท
                        </div>
                        <div className="text-xs text-gray-500">
                            จำนวน: 1
                        </div>
                    </div>

                    <div className='flex flex-row gap-1 col-span-3 col-start-6'>
                        <div className="w-[100px] mr-[10%]"><button className="btn bg-[#323232] text-white rounded-lg text-[14px] w-full h-min">ไม่รับ</button></div>
                        <div className="w-[120px]mr-[10%]"><button className="btn bg-[#D90429] text-white rounded-lg text-[14px] w-full h-min">จัดส่งแล้ว</button></div>
                    </div>

                </div>


            </div>
        </div>
    );
};
export default Rider;