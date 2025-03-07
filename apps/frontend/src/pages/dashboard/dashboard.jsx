import React, { useState } from "react";
import Layout from "@/component/layout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
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
const yearlyData = [
  { year: "2021", total: 5000, current: 3500 },
  { year: "2022", total: 6000, current: 4000 },
  { year: "2023", total: 7000, current: 4500 },
  { year: "2024", total: 8000, current: 5000 },
];

const generateDailyData = () => {
  const months = [
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ];
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  let dailyData = [];

  for (let day = 1; day <= 31; day++) {
    let entry = { day };

    months.forEach((month, index) => {
      if (day <= daysInMonth[index]) {
        entry[month] = Math.floor(Math.random() * (1200 - 400 + 1) + 400); // สุ่มค่า 400 - 1200
      }
    });

    dailyData.push(entry);
  }

  return dailyData;
};

const dailyData = generateDailyData();

const colors = [
  "#FF0000",
  "#FF7F00",
  "#FFFF00",
  "#7FFF00",
  "#00FF00",
  "#00FF7F",
  "#00FFFF",
  "#007FFF",
  "#0000FF",
  "#7F00FF",
  "#FF00FF",
  "#FF007F",
];

function Dashboard() {
  const [selectedOption, setSelectedOption] = useState("daily");
  const [selectedMonths, setSelectedMonths] = useState([
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]);

  const toggleMonth = (month) => {
    setSelectedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  return (
    <div className="m-5 md:m-10">
      <div className="p-4 bg-white shadow-lg rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-700">
            {selectedOption === "daily" ? "รายได้รายวัน" : "รายได้รายปี"}
          </h2>
          <select
            className="border p-2 rounded-lg bg-white text-black border-none"
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="daily">รายวัน</option>
            <option value="yearly">รายปี</option>
          </select>
        </div>

        {selectedOption === "daily" && (
          <div className="grid grid-cols-6 gap-2 mb-4">
            {Object.keys(dailyData[0])
              .slice(1)
              .map((month, index) => (
                <label key={month} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedMonths.includes(month)}
                    onChange={() => toggleMonth(month)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span style={{ color: colors[index] }}>{month}</span>
                </label>
              ))}
          </div>
        )}

        {selectedOption === "daily" ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dailyData}>
              <XAxis
                dataKey="day"
                tick={{ fill: "#6B7280" }}
                label={{
                  value: "วันที่",
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                tick={{ fill: "#6B7280" }}
                label={{
                  value: "รายได้ (บาท)",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />

              {selectedMonths.map((month, index) => (
                <Line
                  key={month}
                  type="monotone"
                  dataKey={month}
                  stroke={colors[index]}
                  strokeWidth={0.5}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={yearlyData} barGap={8}>
              <XAxis dataKey="year" tick={{ fill: "#6B7280" }} />
              <YAxis tick={{ fill: "#6B7280" }} />
              <Tooltip />
              <Bar
                dataKey="total"
                fill="#3B82F6"
                barSize={40}
                radius={[5, 5, 0, 0]}
              />
              <Bar
                dataKey="current"
                fill="#E11D48"
                barSize={40}
                radius={[5, 5, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="grid grid-cols-1 mt-10 gap-4 min-h-[70vh]">
        <div className="grid grid-rows-2 gap-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`stats bg-white text-black shadow ${stat.colSpan ? "col-span-2" : ""}`}
              >
                <div className="stat">
                  <div className="stat-title text-black">{stat.title}</div>
                  <div className="stat-value font-semibold text-3xl">
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
          <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
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
