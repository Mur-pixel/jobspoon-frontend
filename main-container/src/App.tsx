import React, { lazy, Suspense, useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";

import { CircularProgress, CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";

import mitt from "mitt";

import Main from "./components/Main.tsx";
import Footer from "./components/Footer";

import VueAccountAppWrapper from "./VueAccountWrapper.tsx";
import VueAiInterviewAppWrapper from "./VueAiInterviewWrapper.tsx";
import SvelteReviewAppWrapper from "./SvelteReviewWrapper.tsx";
import RequireToken from "./RequireToken";
import ThemeSync from "./ThemeSync";
import ThemeToggleButton from "./ThemeToggleButton";
import { themeAtom } from "@jobspoon/app-state";

const eventBus = mitt();

const NavigationBarApp = lazy(() => import("navigationBarApp/App"));
const StudyRoomApp = lazy(() => import("studyRoomApp/App"));
const MyPageApp = lazy(() => import("myPageApp/App"));
const SpoonWordApp = lazy(() => import("spoonWordApp/App"));

function InnerApp() {
  const [isNavigationBarLoaded, setIsNavigationBarLoaded] = useState(false);
  const mode = useRecoilValue(themeAtom);

  // ✅ 라이트/다크 팔레트 토큰
  const paletteTokens =
    mode === "dark"
      ? {
          background: { default: "#0f1115", paper: "#151922" },
          text: { primary: "#eaeaea", secondary: "#a0a0a0" },
        }
      : {
          background: { default: "#ffffff", paper: "#ffffff" },
          text: { primary: "#111111", secondary: "#666666" },
        };

  // ✅ 테마 생성 + CssBaseline에서 body에 강제 적용
  const muiTheme = useMemo(
    () =>
      createTheme({
        palette: { mode, ...paletteTokens },
        components: {
          MuiCssBaseline: {
            styleOverrides: (themeParam) => ({
              "html, body, #app": { height: "100%" },
              body: {
                backgroundColor: themeParam.palette.background.default,
                color: themeParam.palette.text.primary,
                transition: "background-color .2s ease, color .2s ease",
                backgroundImage: "none", // 브라우저 기본 그라데이션 등 제거
              },
            }),
          },
        },
      }),
    [mode]
  );

  useEffect(() => {
    import("navigationBarApp/App")
      .then(() => setIsNavigationBarLoaded(true))
      .catch((err) => console.error("Failed to load navigation bar:", err));
  }, []);


function AppRoutes() {
    const location = useLocation();
    const hideLayout = location.pathname === "/vue-account/account/login";

    return (
        <Suspense fallback={<CircularProgress />}>
            {!hideLayout && <NavigationBarApp />}
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/vue-account/*" element={<VueAccountAppWrapper eventBus={eventBus} />} />
                <Route path="/studies/*" element={<StudyRoomApp />} />
                <Route path="/spoon-word/*" element={<SpoonWordApp />} />
                <Route
                    path="/vue-ai-interview/*"
                    element={
                        <RequireToken loginPath="/vue-account/account/login">
                            <VueAiInterviewAppWrapper eventBus={eventBus} />
                        </RequireToken>
                    }
                />
                <Route path="/svelte-review/*" element={<SvelteReviewAppWrapper />} />
                <Route path="/mypage/*" element={<MyPageApp />} />
            </Routes>
            {!hideLayout && <Footer />}
        </Suspense>
    );
}


  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {/* (선택) 전역 CSS 변수로 호스트 배경/텍스트도 노출하고 싶으면 */}
      <GlobalStyles
        styles={(theme) => ({
          ":root": {
            "--host-bg": theme.palette.background.default,
            "--host-fg": theme.palette.text.primary,
          },
        })}
      />
      {/* 호스트 → theme-bridge/DOM 동기화 */}
      <ThemeSync />

      <BrowserRouter>
          <AppRoutes />
      </BrowserRouter>

      <ThemeToggleButton />
    </ThemeProvider>
  );
}




const App = () => (
  <RecoilRoot>
    <InnerApp />
  </RecoilRoot>
);

export default App;

const container = document.getElementById("app") as HTMLElement;
if (!container) throw new Error("Root container #app not found");
const root = ReactDOM.createRoot(container);
root.render(<App />);
