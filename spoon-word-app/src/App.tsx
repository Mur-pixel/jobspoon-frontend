import React from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import "./index.css";
import SearchBar from "./components/SearchBar";
import SearchPage from "./pages/SearchPage";

function HomePage() {
    const [q, setQ] = React.useState("");
    const nav = useNavigate();

    return (
        <div className="mx-auto max-w-3xl px-4 py-10">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-4">
                잡스푼과 함께, 기술 용어를 나만의 언어로!
            </h1>

            <SearchBar
                value={q}
                onChange={setQ}
                onSearch={(term) => nav(`/search?q=${encodeURIComponent(term)}`)}
            />
        </div>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/search" element={<SearchPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;