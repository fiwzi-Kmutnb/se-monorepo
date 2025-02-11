"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import { MdOutlineSpaceDashboard } from "react-icons/md";

const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  return (
    <div>
      <div
        // onMouseEnter={() => setOpen(true)}
        // onMouseLeave={() => setOpen(false)}
        className={`${open ? "open" : ""} sidebar`}
      >
        <div className="logo-details mt-3">
          <img
            src="/logo.svg"
            className="bg-white p-2 mt-4 rounded-2xl w-44 mx-auto logo"
            alt=""
          />
          {/* <div className="logo_name">StritySlip</div> */}
        </div>
        <ul className="nav-list">
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">Dashboard</span>
            </a>
          </li>
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">Member</span>
            </a>
          </li>
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">Stock</span>
            </a>
          </li>
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">History</span>
            </a>
          </li>
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">Order</span>
            </a>
          </li>
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">BroadCast</span>
            </a>
          </li>
          <li>
            <a href="/home">
              <div className="icon px-2">
                <MdOutlineSpaceDashboard />
              </div>
              <span className="links_name mx-auto">Configuration</span>
            </a>
          </li>
          <li className="profile">
            <div className="profile-details">
              <div className="name_job">
                <div className="flex">
                  <div className="self-end text-black">
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
            asas ?
    {/* ใส่ที่นี้ */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
