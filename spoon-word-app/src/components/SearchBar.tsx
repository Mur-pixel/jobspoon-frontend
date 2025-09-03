import React, { useEffect, useMemo, useRef, useState } from "react";
import RecentSearchList from "./RecentSearchList.tsx";
import { addRecent, clearRecent, getRecent, removeRecent } from "../utils/recentSearch.ts";

type Props = {
    value: string;
    onChange: (v: string) => void;
    onSearch: (term: string) => void;
};

const SearchBar: React.FC<Props> = ({ value, onChange, onSearch }) => {
    const [open, setOpen] = useState(false);
    const [recent, setRecent] = useState<string[]>(() => getRecent());
    const [highlight, setHighlight] = useState(-1);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listboxId = "recent-search-listbox";

    // 외부 클릭 닫기
    useEffect(() => {
        function onDocDown(e: MouseEvent) {
            if (!wrapperRef.current) return;
            const target = e.target as Node;
            if (!wrapperRef.current.contains(target)) {
                setOpen(false);
                setHighlight(-1);
            }
        }
        document.addEventListener("mousedown", onDocDown);
        return () => document.removeEventListener("mousedown", onDocDown);
    }, []);

    // storage 이벤트(다른 탭) 동기화
    useEffect(() => {
        const handler = (e: StorageEvent) => {
            if (e.key === "recent_search_terms") {
                setRecent(getRecent());
            }
        };
        window.addEventListener("storage", handler);
        return () => window.removeEventListener("storage", handler);
    }, []);

    // 검색 실행: 추가 → 저장(유틸에 포함) → 콜백
    const runSearch = (term: string) => {
        if (!term.trim()) return;
        const updated = addRecent(term);
        setRecent(updated);
        setOpen(false);
        setHighlight(-1);
        onSearch(term);
    };

    const filtered = useMemo(() => recent, [recent]);

    // 포커스 트랩: 열린 동안 탭을 드롭다운 내부에서 순환
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!open) return;

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlight((h) => {
                const next = Math.min(filtered.length - 1, h + 1);
                return next;
            });
            return;
        }
        if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlight((h) => Math.max(-1, h - 1));
            return;
        }
        if (e.key === "Enter") {
            e.preventDefault();
            if (highlight >= 0 && filtered[highlight]) runSearch(filtered[highlight]);
            else runSearch(value);
            return;
        }
        if (e.key === "Escape") {
            e.preventDefault();
            setOpen(false);
            setHighlight(-1);
            return;
        }
        if (e.key === "Tab") {
            // 순환 탭
            if (!wrapperRef.current) return;
            const focusables = wrapperRef.current.querySelectorAll<HTMLElement>(
                'input,button,[tabindex]:not([tabindex="-1"])'
            );
            if (focusables.length === 0) return;
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement as HTMLElement;
            if (!e.shiftKey && active === last) {
                e.preventDefault();
                first.focus();
            } else if (e.shiftKey && active === first) {
                e.preventDefault();
                last.focus();
            }
        }
    };

    return (
        <div className="relative" ref={wrapperRef} onKeyDown={handleKeyDown}>
            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <input
                        ref={inputRef}
                        type="text"
                        value={value}
                        onChange={(e) => {
                            onChange(e.target.value);
                            // 입력 중에도 최근 검색 드롭다운은 유지 (원하면 필터링 로직 추가 가능)
                        }}
                        onFocus={() => setOpen(true)}
                        placeholder="찾고 싶은 용어를 입력해 주세요."
                        aria-haspopup="listbox"
                        aria-expanded={open}
                        aria-controls={listboxId}
                        className="w-full rounded-2xl border border-gray-300 bg-white px-4 py-3 pr-12 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700"
                        aria-label="검색"
                        onClick={() => runSearch(value)}
                    >
                        검색
                    </button>
                </div>
            </div>

            {/* 드롭다운 */}
            {open && (
                <div
                    role="dialog"
                    aria-modal="true"
                    className="absolute left-0 right-0 z-20 mt-2 rounded-2xl border border-gray-200 bg-white shadow-lg"
                >
                    <RecentSearchList
                        items={filtered}
                        highlightedIndex={highlight}
                        onSelect={(v) => runSearch(v)}
                        onDelete={(v) => setRecent(removeRecent(v))}
                        onClear={() => {
                            clearRecent();
                            setRecent([]);
                            // 비어있는 상태도 열어둔 채 문구가 보여야 하므로 open 유지
                        }}
                        listboxId={listboxId}
                    />
                </div>
            )}
        </div>
    );
};

export default SearchBar;