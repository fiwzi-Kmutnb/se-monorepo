"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdChat, MdHistory, MdOutlineSpaceDashboard, MdSettings } from "react-icons/md";
import Link from "next/link";
import { FaBroadcastTower, FaList, FaUsers, FaUserShield } from "react-icons/fa";
import { RiAlignItemLeftFill } from "react-icons/ri";
import { usePathname } from "next/navigation";


const Layout = ({ children }) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div>
      <div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        className={`${open ? "open" : ""} sidebar`}
      >
        <div className="logo-details mt-3">
          <img
            src="/logo.svg"
            className="bg-white p-2 mt-4 rounded-2xl w-44 mx-auto logo"
            alt=""
          />
        </div>
        <ul className="nav-list">
          <li>
            <Link href="/panel/dashboard" className={
              pathname === "/panel/dashboard" ? "active" : ""
            }>
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name">Dashboard | แดชบอร์ด</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/member" className={
              pathname === "/panel/member" ? "active" : ""
            }>
              <div className="icon px-2">
                <FaUsers />
              </div>
              <span className="links_name">Member | สมาชิก</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/chat" className={
              pathname === "/panel/chat" ? "active" : ""
            }>
              <div className="icon px-2">
                <FaUserShield />
              </div>
              <span className="links_name">Role | ตำแหน่ง</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/stock" className={
              pathname === "/panel/stock" ? "active" : ""
            }>
              <div className="icon px-2">
                <RiAlignItemLeftFill />
              </div>
              <span className="links_name">Stock | สินค้า</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/history/order" className={
              pathname === "/panel/history/order" ? "active" : ""
            }>
              <div className="icon px-2">
                <MdHistory />
              </div>
              <span className="links_name">History | ประวัติ</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/order" className={
              pathname === "/panel/order" ? "active" : ""
            }>
              <div className="icon px-2">
                <FaList />
              </div>
              <span className="links_name">Order | ออเดอร์</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/broadcast" className={
              pathname === "/panel/broadcast" ? "active" : ""
            }>
              <div className="icon px-2">
                <FaBroadcastTower />
              </div>
              <span className="links_name">BroadCast | ประกาศ</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/setting" className={
              pathname === "/panel/setting" ? "active" : ""
            }>
              <div className="icon px-2">
                <MdSettings />
              </div>
              <span className="links_name">Config | ข้อมูลเบื้องต้น</span>
            </Link>
          </li>
          <li>
            <Link href="/panel/chat" className={
              pathname === "/panel/chat" ? "active" : ""
            }>
              <div className="icon px-2">
                <MdChat />
              </div>
              <span className="links_name">Chat | แชท</span>
            </Link>
          </li>
          <li className="profile">
            <div className="profile-details">
              <div className="name_job">
                <div className="flex">
                  <div className="self-end text-black text-[12px]">
                    &copy; Copyright 2025 all rights reserved by tumgap
                  </div>

                  {/* <div>
                            <img src="../../assets/img/rdcw_logo_transparent.png" className="w-28" alt="" />
                        </div> */}
                </div>
              </div>
            </div>
            <i className="bx bx-log-out" id="log_out" />
          </li>
        </ul>
      </div>
      <div className="app-main flex flex-col">
        <div className="bg-white shadow-md w-full py-5">da</div>
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
