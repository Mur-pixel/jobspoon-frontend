import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SearchBar from "../components/SearchBar.tsx";

// ---- 검색 API 스텁(추후 백엔드 붙이면 대체) ----
export type TermItem = { id: number; title: string; description: string };
async function searchTerms(q: string, page = 0, size = 20): Promise<{ total: number; items: TermItem[] }> {
    // TODO: 백엔드 연동시 아래를 교체
    await new Promise((r) => setTimeout(r, 200));
    const mock = Array.from({ length: 5 }).map((_, i) => ({
        id: i + 1,
        title: `${q} - 샘플 ${i + 1}`,
        description: `${q} 관련 샘플 설명 ${i + 1}입니다.`,
    }));
    return { total: mock.length, items: mock };
}

// ---- 간단 세션 캐시 ----
const CACHE_PREFIX = "search_cache:";
const readCache = (q: string) => {
    try {
        const raw = sessionStorage.getItem(CACHE_PREFIX + q);
        return raw ? JSON.parse(raw) as { total: number; items: TermItem[] } : null;
    } catch { return null; }
};
const writeCache = (q: string, data: { total: number; items: TermItem[] }) => {
    try { sessionStorage.setItem(CACHE_PREFIX + q, JSON.stringify(data)); } catch {}
};

export default function SearchPage() {
    const [sp] = useSearchParams();
    const nav = useNavigate();
    const q = (sp.get("q") || "").trim();

    // 입력창 값은 URL q와 동기화
    const [term, setTerm] = useState(q);
    useEffect(() => setTerm(q), [q]);

    const [items, setItems] = useState<TermItem[]>([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    // q 변경 시: 캐시 먼저 복원 → 서버 재검증(fetch)
    useEffect(() => {
        if (!q) { setItems([]); setTotal(0); return; }
        const cached = readCache(q);
        if (cached) { setItems(cached.items); setTotal(cached.total); }
        let cancel = false;
        (async () => {
            setLoading(true); setErr(null);
            try {
                const data = await searchTerms(q, 0, 20);
                if (!cancel) {
                    setItems(data.items);
                    setTotal(data.total);
                    writeCache(q, data);
                }
            } catch (e: any) {
                if (!cancel) setErr(e?.message || "검색 실패");
            } finally {
                if (!cancel) setLoading(false);
            }
        })();
        return () => { cancel = true; };
    }, [q]);

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <SearchBar
                value={term}
                onChange={setTerm}
                onSearch={(t) => nav(`/search?q=${encodeURIComponent(t)}`)}
            />

            {/* 상태 출력 */}
            {!q && <div className="mt-6 text-gray-500">검색어가 비어 있습니다.</div>}
            {q && loading && <div className="mt-6">로딩 중…</div>}
            {q && err && <div className="mt-6 text-red-600">에러: {err}</div>}
            {q && !loading && !err && items.length === 0 && (
                <div className="mt-6">검색 결과가 없습니다.</div>
            )}

            {q && items.length > 0 && (
                <div className="mt-6">
                    <div className="text-sm text-gray-500 mb-2">총 {total}건</div>
                    <ul className="space-y-3">
                        {items.map((t) => (
                            <li key={t.id} className="rounded-xl border p-4">
                                <div className="font-semibold">{t.title}</div>
                                <div className="text-sm text-gray-600 mt-1">{t.description}</div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}