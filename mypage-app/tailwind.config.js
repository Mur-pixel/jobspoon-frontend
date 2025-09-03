// / @type {import('tailwindcss').Config} */
// module.exports = {
//     content: [
//         "./index.html",
//         "./src/**/*.{vue,js,ts,jsx,tsx}",
//     ],
//     theme: { extend: {} },
//     plugins: [],
// }


const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{vue,js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {},
        colors: {
            ...colors, // ✅ v3 색상 팔레트 그대로 불러오기
        },
    },
    plugins: [],
};