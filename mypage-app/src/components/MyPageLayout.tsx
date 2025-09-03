import React from "react";
import { Outlet } from "react-router-dom";
import SideBar from "./SideBar";
import '../assets/tailwind.css'

export default function MyPageLayout() {
    return (
        <div className="flex min-h-screen w-full">
            {/* 좌측 메뉴바 */}
            <aside className="w-[300px] sm:w-80 md:w-96 lg:w-[28rem] border-r border-r-[rgb(229,231,235)] flex-shrink-0">
                <SideBar />
            </aside>

            {/* 메인 컨텐츠 */}
            <main className="flex-1 p-6 space-y-6">
                <Outlet />
            </main>
        </div>
    );
}