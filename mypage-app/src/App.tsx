// import React from "react";
// import MyPageLayout from "./components/MyPageLayout";
//
// export default function App() {
//     return <MyPageLayout />;
// }

import React from "react";
import { Routes, Route } from "react-router-dom";
import MyPageLayout from "./components/MyPageLayout.tsx";
import DashboardSection from "./components/DashboardSection.tsx";
import ProfileAppearanceCardEdit from "./components/ProfileAppearanceCardEdit";

export default function App() {
    return (
        <Routes>

            <Route path="/" element={<MyPageLayout />}>
                {/* 기본: 대시보드 */}
                <Route index element={<DashboardSection />} />
                {/* 프로필 외형 수정 */}
                <Route path="profile/edit" element={<ProfileAppearanceCardEdit />} />
            </Route>

        </Routes>
    )
}