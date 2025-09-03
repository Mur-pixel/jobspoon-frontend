import React, { useEffect, useState } from "react";
import {
    fetchMyProfile,
    fetchMyRanks,
    fetchMyTitles,
    updateProfilePhoto,
    HistoryItem,
    ProfileAppearanceResponse
} from "../api/profileAppearanceApi.ts";
import '../assets/tailwind.css'

export default function ProfileAppearanceCardEdit() {

    const [profile, setProfile] = useState<ProfileAppearanceResponse | null>(null);
    const [ranks, setRanks] = useState<HistoryItem[]>([]);
    const [titles, setTitles] = useState<HistoryItem[]>([]);

    {/* 토글 */}
    const [showRanks, setShowRanks] = useState(false);
    const [showTitles, setShowTitles] = useState(false);

    useEffect(() => {
        const token = "test-token2";
        fetchMyProfile(token).then(setProfile).catch(console.error);
        fetchMyRanks(token).then(setRanks).catch(console.error);
        fetchMyTitles(token).then(setTitles).catch(console.error);
    }, []);

    if (!profile) {
        return <p>불러오는 중...</p>;
    }

    const handlePhotoChange = async () => {
        const token = "test-token2";
        const newUrl = prompt("새 프로필 url을 입력하세요:");

        if(!newUrl) return;

        try{
            const upddated = await updateProfilePhoto(token, newUrl);
            setProfile(upddated); // 상태 갱신
            alert("프로필 사진이 변경되었습니다!");
        } catch(error) {
            console.log(error);
            alert("프로필 사진 변경 실패");
        }
    };

    return (
        <section className="p-[24px] rounded-[12px] space-y-[20px] bg-white shadow">
            {/* 제목 */}
            <h2 className="text-[18px] font-[700] text-[rgb(17,24,39)]">
                프로필 외형 수정
            </h2>

            {/* 상단 프로필 영역 */}
            <div className="flex items-start space-x-[32px]">
                {/* 프로필 사진 */}
                <div className="flex flex-col items-center space-y-[12px]">
                    <div className="w-[112px] h-[112px] rounded-full bg-[rgb(229,231,235)] flex items-center justify-center shadow-inner">
                        {profile.photoUrl ? (
                            <img src={profile.photoUrl} alt="프로필" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-[rgb(107,114,128)] text-[14px]">
                                사진
                            </span>
                        )}
                    </div>
                    <button onClick={handlePhotoChange}
                        className="px-[16px] py-[4px] bg-[rgb(59,130,246)] text-[white] text-[14px] rounded-[8px] hover:bg-[rgb(37,99,235)]">
                        사진 변경
                    </button>
                </div>
            </div>

            {/* 닉네임 수정 -> api 연결 완료 */}
            <div className="flex-1 space-y-[8px]">
                <label className="block text-[14px] text-[rgb(75,85,99)]">
                    현재: {profile?.customNickname ?? "불러오는 중..."}
                </label>
                    <div className="flex space-x-[8px]">
                        <input type="text" placeholder="닉네임 입력"
                            className="flex-1 border rounded-[8px] px-[12px] py-[8px] text-[14px] focus:ring focus:ring-[rgb(147,197,253)]"/>
                        <button className="px-[16px] py-[8px] bg-[rgb(34,197,94)] text-[white] text-[14px] rounded-[8px] hover:bg-[rgb(22,163,74)]">
                            수정
                        </button>
                    </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[24px]">
                {/* 랭크 카드 */}
                <div className="p-[16px] bg-[rgb(249,250,251)] rounded-[8px] shadow-sm space-y-[12px]">
                    <div className="flex justify-between items-center">
                        <h3 className="font-[600] text-[rgb(31,41,55)]">
                            등급 전체 이력
                        </h3>
                        <button onClick={() => setShowRanks(!showRanks)}
                            className="text-[14px] text-[rgb(59,130,246)] hover:underline">
                            {showRanks ? "숨기기" : "보기"}
                        </button>
                    </div>

                    {/* 현재 장착 중 -> api 연결 완료 */}
                    <div className="border-[2px] border-[rgb(59,130,246)] bg-[rgb(239,246,255)] rounded-[8px] px-[12px] py-[8px] flex justify-between">
                        <span className="font-[500] text-[rgb(29,78,216)]">
                            {profile.rank?.displayName}
                        </span>
                        <span className="text-[12px] font-[600] text-[rgb(29,78,216)]">
                            장착 중
                        </span>
                    </div>

                    {/* 전체 이력 (토글 열렸을 때만) -> api 연결 완료 */}
                    {showRanks && (
                        <ul className="space-y-[8px]">
                            {ranks.map((rank) => (
                                <li key={rank.code}
                                    className="flex justify-between items-center border rounded-[8px] px-[12px] py-[8px]">
                                    <span>
                                        {rank.displayName} (
                                        {new Date(rank.acquiredAt).toLocaleDateString()})
                                    </span>
                                    <button className="text-[12px] px-[8px] py-[4px] bg-[rgb(243,244,246)] rounded-[4px] hover:bg-[rgb(229,231,235)]">
                                        장착
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}

                </div>

                {/* 칭호 카드 */}
                <div className="p-[16px] bg-[rgb(249,250,251)] rounded-[8px] shadow-sm space-y-[12px]">
                    <div className="flex justify-between items-center">
                        <h3 className="font-[600] text-[rgb(31,41,55)]">
                            칭호 전체 이력
                        </h3>
                        <button onClick={() => setShowTitles(!showTitles)}
                                className="text-[14px] text-[rgb(59,130,246)] hover:underline">
                            {showTitles ? "숨기기" : "보기"}
                        </button>
                    </div>

                    {/* 현재 장착 중 -> api 연결 완료 */}
                    <div className="border-[2px] border-[rgb(59,130,246)] bg-[rgb(239,246,255)] rounded-[8px] px-[12px] py-[8px] flex justify-between">
                        <span className="font-[500] text-[rgb(29,78,216)]">
                            {profile.title?.displayName}
                        </span>
                        <span className="text-[12px] font-[600] text-[rgb(29,78,216)]">
                            장착 중
                        </span>
                    </div>

                    {/* 전체 이력 -> api 연결 완료 */}
                    {showTitles && (
                        <ul className="space-y-[8px]">
                            {titles.map((title) => (
                                <li key={title.code}
                                    className="flex justify-between items-center border rounded-[8px] px-[12px] py-[8px]">
                                    <span>
                                        {title.displayName} (
                                        {new Date(title.acquiredAt).toLocaleDateString()})
                                    </span>
                                    <button className="text-[12px] px-[8px] py-[4px] bg-[rgb(243,244,246)] rounded-[4px] hover:bg-[rgb(229,231,235)]">
                                        장착
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    );
}
