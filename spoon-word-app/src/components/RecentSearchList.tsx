import React from "react";

type Props = {
    items: string[];
    highlightedIndex: number;
    onSelect: (v: string) => void;
    onDelete: (v: string) => void;
    onClear: () => void;
    listboxId?: string;
};

const RecentSearchList: React.FC<Props> = ({
                                               items,
                                               highlightedIndex,
                                               onSelect,
                                               onDelete,
                                               onClear,
                                               listboxId,
                                           }) => {
    if (items.length === 0) {
        return (
            <div
                role="note"
                className="px-3 py-3 text-sm text-gray-500"
                id={listboxId}
                aria-live="polite"
            >
                최근 검색어가 없습니다.
            </div>
        );
    }

    return (
        <div className="max-h-72 overflow-auto" id={listboxId} role="listbox" aria-label="최근 검색어">
            <ul className="py-1">
                {items.map((item, idx) => {
                    const active = idx === highlightedIndex;
                    return (
                        <li
                            key={item + idx}
                            role="option"
                            aria-selected={active}
                            className={`group flex items-center justify-between px-3 py-2 cursor-pointer ${
                                active ? "bg-gray-100" : "hover:bg-gray-50"
                            }`}
                            // onMouseDown: blur 전에 선택 처리되도록
                            onMouseDown={(e) => {
                                e.preventDefault();
                                onSelect(item);
                            }}
                        >
                            <button
                                type="button"
                                className="text-left flex-1 outline-none"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => onSelect(item)}
                                tabIndex={-1}
                            >
                                <span className="text-sm text-gray-800">{item}</span>
                            </button>
                            <button
                                type="button"
                                className="ml-2 text-xs text-gray-400 hover:text-gray-600"
                                aria-label={`${item} 삭제`}
                                onMouseDown={(e) => {
                                    // 부모 li의 onMouseDown(선택 실행)을 막아야 드롭다운이 안 닫힘
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}
                            onClick={(e) => {
                            e.stopPropagation();
                            onDelete(item);
                        }}
                            tabIndex={-1}
                            >
                            ✕
                        </button>
                        </li>
                    );
                })}
            </ul>

            <div className="border-t px-3 py-2">
                <button
                    type="button"
                    className="text-xs text-gray-500 hover:text-gray-700"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={onClear}
                >
                    전체 삭제
                </button>
            </div>
        </div>
    );
};

export default RecentSearchList;