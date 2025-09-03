import React, { useEffect, useState } from "react";
import { fetchMyProfile, ProfileAppearanceResponse } from "../api/profileAppearanceApi.ts";
import '../assets/tailwind.css'
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function ProfileAppearanceCard() {
    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const navigate = useNavigate();

    // TODO: 👉 로그인 연동 전까지는 임시 하드코딩
    useEffect(() => {
        const token = "test-token2";
        fetchMyProfile(token)
            .then(setProfile)
            .catch(console.error);
    }, []);

    // TODO: 👉 실제 로그인 붙었을 때 사용할 버전 (주석으로 보관)
    // useEffect(() => {
    //     const token = localStorage.getItem("userToken") || "";
    //     fetchMyProfile(token)
    //         .then(setProfile)
    //         .catch(console.error);
    // }, []);

    // 아직 API 로드 전이면 로딩 표시
    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    return (
        <div className="rounded-[12px] shadow p-[24px] text-center space-y-[16px] bg-[rgb(249,250,251)]">
            {/* 프로필 이미지 */}
            <div className="flex justify-center mb-[20px]">
                <img
                    src={profile.photoUrl || "/default_profile.png"}
                    alt="profile"
                    className="w-[140px] h-[140px] rounded-full object-cover border border-[rgb(229,231,235)]"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = "/default_profile.png";
                    }}
                />
            </div>

            {/* 기본 정보 */}
            <div>
                <table className="mx-auto text-[14px] leading-[28px] border-separate border-spacing-x-[8px] border-collapse border-[0]">
                    <tbody>
                    <tr>
                        <td className="text-right font-semibold text-[rgb(55,65,81)] whitespace-nowrap">등급</td>
                        <td className="text-center text-[rgb(209,213,219)]">|</td>
                        <td className="text-left text-[rgb(31,41,55)] whitespace-nowrap">
                            {profile.rank?.displayName ?? "등급 없음"}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right font-semibold text-[rgb(55,65,81)] whitespace-nowrap">별명</td>
                        <td className="text-center text-[rgb(209,213,219)]">|</td>
                        <td className="text-left text-[rgb(31,41,55)] whitespace-nowrap">
                            {profile.customNickname}
                        </td>
                    </tr>
                    <tr>
                        <td className="text-right font-semibold text-[rgb(55,65,81)] whitespace-nowrap">계정</td>
                        <td className="text-center text-[rgb(209,213,219)]">|</td>
                        <td className="text-left text-[rgb(31,41,55)] whitespace-nowrap">
                            TestUser01
                        </td>
                    </tr>
                    </tbody>
                </table>
            </div>

            {/* 수정 버튼 */}
            <div className="flex justify-end mt-[24px]">
                <button
                    className="flex items-center gap-[6px] px-[16px] py-[8px]
                               bg-[rgb(59,130,246)] text-[white] text-[13px] rounded-[6px]
                               hover:bg-[rgb(37,99,235)] cursor-pointer
                               transition-colors duration-200"
                    onClick={() => navigate("/mypage/profile/edit")}>
                    <FaEdit />
                    수정하기
                </button>
            </div>
        </div>
    );
}
