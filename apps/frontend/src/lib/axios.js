import axios from "axios";
import { getCookie } from "cookies-next";

export default axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
    headers: {
        Authorization: `Bearer ${getCookie("token")}`,
        "Content-Type": "application/json",
    },
})