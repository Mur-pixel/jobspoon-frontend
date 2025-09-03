export const mfConfig = {
  name: "html_container",
  remotes: {
    vueAccountApp: `vueAccountApp@${process.env.VUE_ACCOUNT_APP}/remoteEntry.js`,
    navigationBarApp: `navigationBarApp@${process.env.REACT_NAVIGATION_APP}/remoteEntry.js`,
    studyRoomApp: `studyRoomApp@${process.env.REACT_STUDYROOM_APP}/remoteEntry.js`,
    vueAiInterviewApp: `vueAiInterviewApp@${process.env.VUE_AI_INTERVIEW_APP}/remoteEntry.js`,
    svelteReviewApp: `svelteReviewApp@${process.env.SVELTE_REVIEW_APP}/remoteEntry.js`,
    myPageApp: `myPageApp@${process.env.REACT_MYPAGE_APP}/remoteEntry.js`
    spoonWordApp: `spoonWordApp@${process.env.REACT_SPOONWORD_APP}/remoteEntry.js`
  },
  shared: {
    react: { singleton: true, requiredVersion: "^18.2.0" },
    "react-dom": { singleton: true, requiredVersion: "^18.2.0" },
    "@mui/material": { singleton: true, requiredVersion: "^7.0.1" },
    "@mui/icons-material": { singleton: true, requiredVersion: "^7.0.1" },
    "react-router-dom": { singleton: true, requiredVersion: "^6.30.0" },
    three: { singleton: true, requiredVersion: "^0.177.0" },
    '@jobspoon/app-state': { singleton: true, eager: true },
    '@jobspoon/theme-bridge': { singleton: true },
    "styled-components": { singleton: true, requiredVersion: "^6.1.19" },
  },
};
