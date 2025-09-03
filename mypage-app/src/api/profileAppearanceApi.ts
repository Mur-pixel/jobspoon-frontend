import axios from "axios";

const API_BASE_URL = "http://localhost:8080";

// 프로필 조회 응답
export interface ProfileAppearanceResponse {
    photoUrl: string | null;
    customNickname: string;
    rank?: { code: string; displayName: string };
    title?: { code: string; displayName: string };
}

// 공통 Rank/Title 이력 타입
export interface HistoryItem{
    code: string;
    displayName: string;
    acquiredAt: string; // ISO datetime
}

// 내 프로필 조회
export async function fetchMyProfile(token: string) {
    const res = await axios.get(`${API_BASE_URL}/profile-appearance/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 프로필 사진 교체
export async function updateProfilePhoto(token: string, photoUrl: string) {
    const res = await axios.put<ProfileAppearanceResponse>(
        `${API_BASE_URL}/profile-appearance/photo`,
        { photoUrl },
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 닉네임 변경
export async function updateNickname(token: string, customNickname: string) {
    const res = await axios.put<ProfileAppearanceResponse>(
        `${API_BASE_URL}/profile-appearance/nickname`,
        { customNickname },
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 보유 랭크 조회
export async function fetchMyRanks(token: string): Promise<HistoryItem[]> {
    const res = await axios.get<HistoryItem[]>(
        `${API_BASE_URL}/profile-appearance/rank/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 랭크 장착
export async function equipRank(token: string, rankId: number): Promise<HistoryItem> {
    const res = await axios.put<HistoryItem>(
        `${API_BASE_URL}/profile-appearance/rank/${rankId}/equip`,
        {},
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 보유 칭호 조회
export async function fetchMyTitles(token: string): Promise<HistoryItem[]> {
    const res = await axios.get<HistoryItem[]>(
        `${API_BASE_URL}/profile-appearance/title/my`,
        { headers: { Authorization: token } }
    );
    return res.data;
}

// 칭호 장착
export async function equipTitle(token: string, titleId: number): Promise<HistoryItem> {
    const res = await axios.put<HistoryItem>(
        `${API_BASE_URL}/profile-appearance/title/${titleId}/equip`,
        {},
        { headers: { Authorization: token } }
    );
    return res.data;
}