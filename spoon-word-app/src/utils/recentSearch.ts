// 최근 검색어 로컬스토리지 유틸
export const RECENT_KEY = "recent_search_terms";
const LIMIT_DEFAULT = 10;

function readRaw(): string[] {
    try {
        const raw = localStorage.getItem(RECENT_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
    } catch {
        return [];
    }
}

function writeRaw(items: string[]) {
    localStorage.setItem(RECENT_KEY, JSON.stringify(items));
}

export function getRecent(): string[] {
    return readRaw();
}

export function addRecent(term: string, limit: number = LIMIT_DEFAULT): string[] {
    const t = term.trim();
    if (!t) return getRecent();
    const prev = readRaw().filter((x) => x.toLowerCase() !== t.toLowerCase());
    const next = [t, ...prev].slice(0, limit);
    writeRaw(next);
    return next;
}

export function removeRecent(term: string): string[] {
    const t = term.trim();
    const next = readRaw().filter((x) => x !== t);
    writeRaw(next);
    return next;
}

export function clearRecent(): void {
    writeRaw([]);
}