<template>
  <!-- [1] 페이지 뼈대: 밝은 배경 + 중앙 카드 레이아웃 -->
  <div class="bg-grey-lighten-5" style="font-family: 'Noto Sans KR', sans-serif">
    <v-container class="bg-white">
      <v-row justify="center">
        <v-col cols="auto" style="padding-bottom: 90px">
          <v-card width="460">
            <v-card-text class="text-center px-12 py-16">

              <!-- [2] 타이틀/로고 -->
              <div class="text-h4 font-weight-black mb-10">관리자 코드 입력</div>
              <div class="d-flex">
                <v-img :src="githubIconSrc" width="120" class="mx-auto mb-6" />
              </div>

              <!-- [3] 에러 메시지 노출 영역 (401/네트워크/기타 서버오류 시) -->
              <v-alert
                  v-if="errorMessage"
                  type="error"
                  variant="tonal"
                  class="mb-4"
                  density="compact"
              >
                {{ errorMessage }}
              </v-alert>

              <!-- [4] 사용자 입력: 관리자 ID (Enter 누르면 verify 실행) -->
              <v-text-field
                  v-model="administerId"
                  label="관리자 ID"
                  variant="outlined"
                  class="mb-3"
                  @keydown.enter="verifyAdminCode"
              />

              <!-- [5] 사용자 입력: 관리자 비밀번호 (Enter 누르면 verify 실행) -->
              <v-text-field
                  v-model="administerpassword"
                  label="관리자 비밀번호"
                  type="password"
                  variant="outlined"
                  @keydown.enter="verifyAdminCode"
              />

              <!-- [6] 확인 버튼: loading 중/입력 미완성 시 비활성화 -->
              <v-btn
                  block
                  rounded
                  color="primary"
                  class="mt-4"
                  :loading="loading"
                  :disabled="loading || !canSubmit"
                  @click="verifyAdminCode"
              >
                확인
              </v-btn>

              <!-- [7] 취소 버튼: 로그인 화면으로 복귀 -->
              <v-btn
                  block
                  rounded
                  variant="tonal"
                  class="mt-4"
                  :disabled="loading"
                  @click="cancel"
              >
                취소
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
/**
 * [A] 의존성/리소스 임포트
 */
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import githubIconSrc from "@/assets/images/fixed/icon-github.svg";

/**
 * [A-1] 공용 axios 인스턴스에서 adminAxiosInstance 사용
 *  - 반드시 axiosInstances.ts에 adminAxiosInstance 생성 로직과
 *    VUE_APP_ADMIN_API_BASE_URL(.env)이 준비되어 있어야 합니다.
 */
import {createAxiosInstances, springAxiosInstance} from "@/account/utility/axiosInstance";

/**
 * [C] 라우터 준비
 */
const router = useRouter();

/**
 * [D] 반응형 상태
 */
const administerId = ref("");
const administerpassword = ref("");
const loading = ref(false);
const errorMessage = ref("");

/**
 * [E] 제출 가능 여부 계산
 */
const canSubmit = computed(
    () => administerId.value.trim().length > 0 && administerpassword.value.trim().length > 0
);

/**
 * [F] 제출 처리: verifyAdminCode
 *  - fetch + CODE_LOGIN_URL 제거
 *  - adminAxiosInstance.post("/code_login") 사용
 *  - axios가 4xx/5xx에서 예외를 던지지 않도록 validateStatus로 직접 분기
 */
const { springAxiosInstance } = createAxiosInstances();

const verifyAdminCode = async () => {
  if (!canSubmit.value || loading.value) return;
  loading.value = true;
  errorMessage.value = "";

  if (!springAxiosInstance) {
    errorMessage.value = "관리자 API 클라이언트를 초기화하지 못했습니다. (.env 설정 확인)";
    loading.value = false;
    return;
  }

  try {
    const res = await springAxiosInstance.post(
        "/administer/code_login",
        {
          administerId: administerId.value,
          administerpassword: administerpassword.value,
        },
        {
          // 2xx가 아니어도 throw하지 않게 해서 status로 분기
          validateStatus: () => true,
          headers: { "Content-Type": "application/json" },
        }
    );

    if (res.status === 200) {
      // 인증 성공 → 홈 또는 관리자 전용 라우트로 이동
      localStorage.setItem("isAdmin", "true");
      router.push({ name: "AdminOverview" });
    } else if (res.status === 401) {
      errorMessage.value = "아이디 또는 비밀번호가 올바르지 않습니다.";
    } else {
      errorMessage.value = `서버 오류가 발생했습니다. (status: ${res.status})`;
    }
  } catch (e) {
    errorMessage.value = "네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
    console.error(e);
  } finally {
    loading.value = false;
  }
};

/**
 * [G] 취소 처리: 로그인 화면으로 복귀
 */
const cancel = () => {
  if (loading.value) return;
  router.push("/account/login");
};
</script>
