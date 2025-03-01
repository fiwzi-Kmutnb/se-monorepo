import React from "react";
import Layout from "@/component/layout";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const stats = [
  { title: "รายได้วันนี้", value: 3298, unit: "THB" },
  { title: "รายได้เดือนนี้", value: 35298, unit: "THB" },
  { title: "รายได้ปีนี้", value: 253525, unit: "THB" },
  { title: "จำนวนสมาชิก", value: 64, unit: "คน" },
  { title: "รายได้ทั้งหมด", value: 2244526, unit: "THB", colSpan: 2 },
];

const customers = [
  {
    name: "Cy Ganderton",
    month: "12/2567",
    amount: "35,000",
    image:
      "https://www.allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg",
  },
  {
    name: "Hart Hagerty",
    month: "12/2567",
    amount: "30,500",
    image:
      "https://www.allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg",
  },
  {
    name: "Brice Swyre",
    month: "12/2567",
    amount: "25,200",
    image:
      "https://www.allprodad.com/wp-content/uploads/2021/03/05-12-21-happy-people.jpg",
  },
];

const popularProducts = [
  { id: 1, name: "Product A", sales: 500 },
  { id: 2, name: "Product B", sales: 450 },
  { id: 3, name: "Product C", sales: 420 },
];

const worstProducts = [
  { id: 1, name: "Product X", sales: 10 },
  { id: 2, name: "Product Y", sales: 15 },
  { id: 3, name: "Product Z", sales: 20 },
];
const grap = [
  { month: "JAN", total: 400, current: 100 },
  { month: "FEB", total: 400, current: 150 },
  { month: "MAR", total: 400, current: 200 },
  { month: "APR", total: 400, current: 250 },
  { month: "MAY", total: 400, current: 280 },
  { month: "JUN", total: 400, current: 200 },
  { month: "JUL", total: 400, current: 230 },
  { month: "AUG", total: 400, current: 120 },
  { month: "SEP", total: 400, current: 270 },
  { month: "OCT", total: 400, current: 320 },
  { month: "NOV", total: 400, current: 360 },
  { month: "DEC", total: 400, current: 400 },
];

function Dashboard() {
  return (
    <div className="m-5 md:m-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-[70vh]">
        <div className="grid grid-rows-2 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`stats bg-white text-black shadow ${stat.colSpan ? "col-span-2" : ""}`}
              >
                <div className="stat">
                  <div className="stat-title text-black">{stat.title}</div>
                  <div className="stat-value text-3xl">
                    {stat.value}{" "}
                    <span className="text-lg text-gray-500">{stat.unit}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white text-black shadow-lg rounded-lg p-4">
            <p className="text-lg font-semibold">
              ลูกค้าที่ซื้อสินค้ามากที่สุดต่อเดือน
            </p>
            <div className="overflow-x-auto">
              <table className="table w-full text-left">
                <thead>
                  <tr className="border-none">
                    <th className="p-2">รูปภาพ</th>
                    <th className="p-2">ชื่อลูกค้า</th>
                    <th className="p-2">เดือน/ปี</th>
                    <th className="p-2">มูลค่า (บาท)</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.map((customer, index) => (
                    <tr key={index} className="border-none">
                      <td className="p-2">
                        <img
                          src={customer.image}
                          alt={customer.name}
                          className="w-10 h-10 rounded-full"
                        />
                      </td>
                      <td className="p-2">{customer.name}</td>
                      <td className="p-2">{customer.month}</td>
                      <td className="p-2">{customer.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className="grid grid-rows-2 gap-4">
          <div>
            <div className="p-4 bg-white rounded-xl shadow-lg">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                รายได้ต่อ วัน / เดือน / ปี
              </h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={grap} barGap={8}>
                  <XAxis dataKey="month" tick={{ fill: "#6B7280" }} />
                  <YAxis tick={{ fill: "#6B7280" }} />
                  <Tooltip />

                  <Bar
                    dataKey="current"
                    fill="#E11D48"
                    barSize={20}
                    radius={[10, 10, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className=" grid grid-row-2 gap-4">
            <div className="bg-white text-black shadow-lg rounded-lg p-4">
              <p className="text-lg font-semibold">สินค้ายอดนิยม</p>
              <div className="overflow-x-auto">
                <table className="table w-full text-left">
                  <thead>
                    <tr className="border-none">
                      <th className="p-2">#</th>
                      <th className="p-2">ชื่อสินค้า</th>
                      <th className="p-2">ยอดขาย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {popularProducts.map((product) => (
                      <tr key={product.id} className="border-none">
                        <td className="p-2">{product.id}</td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-white text-black shadow-lg rounded-lg p-4">
              <p className="text-lg font-semibold">สินค้ายอดแย่</p>
              <div className="overflow-x-auto">
                <table className="table w-full text-left">
                  <thead>
                    <tr className="border-none">
                      <th className="p-2">#</th>
                      <th className="p-2">ชื่อสินค้า</th>
                      <th className="p-2">ยอดขาย</th>
                    </tr>
                  </thead>
                  <tbody>
                    {worstProducts.map((product) => (
                      <tr key={product.id} className="border-none">
                        <td className="p-2">{product.id}</td>
                        <td className="p-2">{product.name}</td>
                        <td className="p-2">{product.sales}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

Dashboard.getLayout = (page) => <Layout>{page}</Layout>;

export default Dashboard;
