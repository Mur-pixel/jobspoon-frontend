<template>
  <!-- 좌상단 로고 -->
  <div class="fixed top-0 left-0 p-4 z-50">
    <img
        :src="Logo"
        alt="Logo"
        style="width: 180px; height: 70px; object-fit: contain;"
        @click="goHome"
    >
  </div>

  <div class="w-full overflow-hidden flex items-center justify-center min-h-screen bg-white">
    <!-- 왼쪽 로그인 영역 -->
    <div class="w-1/2 h-full flex items-center justify-center ml-12">
      <!-- 컨테이너 전체 -->
      <div class="w-2/3 pt-10 mt-10 pl-5 flex flex-col items-start">
        <!-- 상단 텍스트 -->
        <div class="text-[28px] font-bold mb-2">
          Sign In
        </div>
        <div class="text-gray-500 text-sm mb-1">
          If you don’t have an account register
        </div>
        <div class="text-gray-500 text-sm mb-6">
          You can Register here!
        </div>

        <!-- 이메일/비밀번호 입력 폼 -->
        <form class="flex flex-col mt-7 gap-6 w-full" @submit.prevent>
          <!-- 이메일 -->
          <div class="flex flex-col w-full max-w-[350px]">
            <label class="text-gray-400 text-[12px]" for="email">
              Email
            </label>
            <input
                id="email"
                type="email"
                placeholder="📧 Enter your email address"
                class="w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2 placeholder-gray-400"
                v-model="email"
            />
          </div>

          <!-- 비밀번호 -->
          <div class="flex flex-col mt-10 w-full max-w-[350px]">
            <label class="text-gray-400 text-[12px]" for="password">
              Password
            </label>
            <input
                id="password"
                type="password"
                placeholder="🔒 Enter your password"
                class="w-full border-b-2 border-gray-300 focus:border-blue-500 focus:outline-none py-2 placeholder-gray-400"
                v-model="password"
            />
          </div>

          <div class="flex items-center max-w-[350px]">
            <input
                id="remember"
                type="checkbox"
                class="mt-4 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                v-model="remember"
            />
            <label for="remember" class="text-gray-500 text-[12px] mt-4 select-none">
              Remember me
            </label>
          </div>

          <!-- 로그인 버튼 -->
          <button
              type="button"
              class="w-full max-w-[350px] mt-6 py-3 text-white font-semibold rounded-xl transition-colors"
              style="background-color: #2563eb;"
              @click="triggerSocialLogin"
          >
            Log In
          </button>
        </form>

        <!-- 로그인 버튼들/구분선 -->
        <div
            class="w-full pr-16 flex justify-center my-6 text-sm font-medium"
            style="color: #9CA3AF !important;"
        >
          or continue with
        </div>

        <!-- Kakao Login Button (Tailwind 버튼) -->
        <button
            class="w-full max-w-[350px] h-[50px] bg-yellow-400 rounded-[1.4vh] flex items-center justify-center hover:bg-yellow-500 transition-colors"
            @click="() => goToPrivacyAgreementPage('KAKAO')"
            @mouseenter="hoverKakao = true"
            @mouseleave="hoverKakao = false"
        >
          <img :src="kakaoBtn" alt="Kakao Login" class="h-3/4 object-contain" />
        </button>

        <!-- ===== 기존 Vuetify 버튼 블록: 유지(주석) =====
        <v-btn
          :style="guestBtnStyle"
          class="guest-login-btn"
          @click="handleGuestLogin"
          @mouseenter="hoverGuest = true"
          @mouseleave="hoverGuest = false"
        >
          게스트 로그인
        </v-btn>

        <v-btn
          :style="googleBtnStyle"
          class="google-login-btn"
          @click="() => goToPrivacyAgreementPage('GOOGLE')"
          @mouseenter="hoverGoogle = true"
          @mouseleave="hoverGoogle = false"
        ></v-btn>

        <v-btn
          :style="naverBtnStyle"
          class="naver-login-btn"
          @click="() => goToPrivacyAgreementPage('NAVER')"
          @mouseenter="hoverNaver = true"
          @mouseleave="hoverNaver = false"
        ></v-btn>

        <v-btn
          :style="adminBtnStyle"
          class="admin-login-btn"
          @click="goToAdminLogin"
          @mouseenter="hoverAdmin = true"
          @mouseleave="hoverAdmin = false"
        ></v-btn>
        ============================================== -->
      </div>
    </div>

    <!-- 오른쪽 이미지 영역 -->
    <div
        class="relative w-[64%] mr-5 flex items-center justify-center bg-[#181824] rounded-xl overflow-hidden"
        style="height: calc(100vh - 4rem);"
    >
      <img :src="LoginImage" class="w-full h-full object-contain" />

      <!-- 관리자(GitHub) 버튼: Alt 키를 누를 때만 노출, 우상단에서 '빼꼼' -->
      <button
          v-show="altPressed"
          @click="goToAdminLogin"
          aria-label="관리자 로그인"
          title="관리자 로그인"
          class="absolute top-3 z-10 rounded-full shadow-lg border border-white/20 hover:scale-105 transition-transform focus:outline-none"
          style="
          right:-12px;               /* 컨테이너 밖으로 살짝(빼꼼) */
          width:48px;height:48px;
          background: white;
          display:flex;align-items:center;justify-content:center;
          opacity:0.95;
        "
      >
        <img :src="githubIcon" alt="" style="width:26px;height:26px;" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useGuestAuthenticationStore } from '../../../guest/stores/guestAuthenticationStore'
import { useHead } from '@vueuse/head' // 필요 시 SEO 메타 사용
import '../../../assets/tailwind.css'

// 이미지/리소스
import loginBg from '@/assets/images/fixed/login_bg61.jpg'
import logo1 from '@/assets/images/fixed/logo1.png'
import Logo from '@/assets/images/fixed/Logo.png'
import LoginImage from '@/assets/images/fixed/LoginImage.png'
import kakaoBtn from '@/assets/images/fixed/btn_login_kakao.png'
import googleBtn from '@/assets/images/fixed/btn_login_google.png'
import naverBtn from '@/assets/images/fixed/btn_login_naver.png'
import githubIcon from '@/assets/images/fixed/icon-github.svg'

// 액션/스토어
import { kakaoAuthenticationAction as kakaoAuthentication } from '@/kakao/stores/kakaoAuthenticationActions'

// 라우터/스토어
const router = useRouter()
const guestAuthentication = useGuestAuthenticationStore()

// 폼 상태
const email = ref('')
const password = ref('')
const remember = ref(false)

// hover 상태 (보존)
const hoverGuest = ref(false)
const hoverKakao = ref(false)
const hoverGoogle = ref(false)
const hoverNaver = ref(false)
const hoverAdmin = ref(false)

// 공통/버튼 스타일 (보존)
const btnCommon = {
  width: '100%',
  height: '50px',
  margin: '1.3vh auto',
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  borderRadius: '1.4vh',
}

const guestBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundColor: hoverGuest.value ? '#00c0ef' : '#00d0ff',
  color: 'white',
}))

const kakaoBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundImage: `url('${kakaoBtn}')`,
  backgroundColor: hoverKakao.value ? '#f6db00' : '#ffea00',
  marginBottom: '1vh',
}))

const googleBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundImage: `url('${googleBtn}')`,
  backgroundColor: hoverGoogle.value ? '#f7f7f7' : '#fff',
  marginBottom: '1vh',
}))

const naverBtnStyle = computed(() => ({
  ...btnCommon,
  backgroundImage: `url('${naverBtn}')`,
  backgroundColor: hoverNaver.value ? '#02b04f' : '#03c75a',
}))

const adminBtnStyle = computed(() => ({
  width: '70px',
  height: '50px',
  backgroundImage: `url('${githubIcon}')`,
  backgroundColor: 'transparent',
  boxShadow: 'none',
  padding: 0,
  margin: '10px auto',
  display: 'block',
  minWidth: 0,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  filter: hoverAdmin.value ? 'brightness(0.9)' : 'none',
}))

// Alt 키 감지 상태
const altPressed = ref(false)
function onKeyDown(e: KeyboardEvent) {
  if (e.altKey) altPressed.value = true
}
function onKeyUp(e: KeyboardEvent) {
  if (!e.altKey) altPressed.value = false
}
function onBlur() {
  altPressed.value = false
}
onMounted(() => {
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', onBlur)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', onBlur)
})

// 네비게이션/액션
function goHome() {
  window.location.href = '/'
}

function triggerSocialLogin() {
  alert('준비중입니다 소셜 로그인을 이용해주세요')
  console.log('로그인 버튼 클릭')
}

const goToPrivacyAgreementPage = async (loginType: string) => {
  sessionStorage.setItem('tempLoginType', loginType)
  await kakaoAuthentication.requestKakaoLoginToSpring(router)
  // 필요 시: router.push('/account/privacy')
}

const handleGuestLogin = async () => {
  try {
    localStorage.setItem('loginType', 'GUEST')
    const userToken = await guestAuthentication.requestGuestLoginToDjango()
    localStorage.setItem('userToken', userToken)
    router.push('/')
  } catch (error) {
    console.error('게스트 로그인 실패:', error)
    alert('게스트 로그인에 실패했습니다.')
  }
}

// 관리자 코드 입력 페이지로 이동
const goToAdminLogin = () => {
  // Alt 키와 함께 클릭했을 때만 허용하고 싶다면 아래처럼 가드 추가 가능
  // if (!altPressed.value) return;
  router.push('/account/admin-code')
}
</script>
