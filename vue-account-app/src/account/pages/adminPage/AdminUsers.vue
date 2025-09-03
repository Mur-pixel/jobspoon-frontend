<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="text-h5 font-weight-bold">사용자 관리</div>
      <form @submit.prevent>
        <v-text-field
            v-model="q"
            density="compact"
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="검색(이메일/닉네임)"
            style="max-width: 320px"
        />
      </form>
    </div>

    <v-card>
      <v-table density="comfortable">
        <thead>
        <tr>
          <th>이메일</th>
          <th>닉네임</th>
          <th>가입일</th>
          <th>권한</th>
          <th>동작</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="u in filtered" :key="u.id">
          <td>{{ u.email }}</td>
          <td>{{ u.nickname }}</td>
          <td>{{ u.joinedAt }}</td>
          <td>
            <v-chip size="small" :color="u.role === 'ADMIN' ? 'primary' : 'default'">
              {{ u.role }}
            </v-chip>
          </td>
          <td>
            <v-btn size="small" variant="text" @click="toggleRole(u)">권한전환</v-btn>
            <v-btn size="small" variant="text" color="error" @click="ban(u)">차단</v-btn>
          </td>
        </tr>
        <tr v-if="filtered.length === 0">
          <td colspan="5" class="text-medium-emphasis text-center py-6">
            검색 결과가 없습니다.
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from "vue";
// API 연동 시 아래처럼 래퍼를 만들어 쓰세요.
// import { adminApi } from "@/account/services/adminApi";

type UserRow = {
  id: number;
  email: string;
  nickname: string;
  joinedAt: string;
  role: "ADMIN" | "USER";
};

const q = ref("");

const state = reactive<{ users: UserRow[] }>({
  users: [
    { id: 1, email: "kim@example.com",   nickname: "kim***", joinedAt: "2025-06-11", role: "USER" },
    { id: 2, email: "admin@example.com", nickname: "admin",  joinedAt: "2025-01-02", role: "ADMIN" },
  ],
});

const filtered = computed(() => {
  const keyword = q.value.trim().toLowerCase();
  if (!keyword) return state.users;
  return state.users.filter(
      (u) =>
          u.email.toLowerCase().includes(keyword) ||
          u.nickname.toLowerCase().includes(keyword)
  );
});

const toggleRole = async (u: UserRow) => {
  // TODO: 실제 API 연동 예시
  // const updated = await adminApi.toggleRole(u.id);
  // u.role = updated.role;
  u.role = u.role === "ADMIN" ? "USER" : "ADMIN";
};

const ban = async (u: UserRow) => {
  // TODO: 실제 API 연동 예시
  // await adminApi.banUser(u.id);
  alert(`(샘플) ${u.email} 차단`);
};
</script>

<style scoped>
/* 선택: 스타일 보정 */
</style>
