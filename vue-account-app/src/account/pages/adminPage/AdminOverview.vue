<template>
  <div>
    <div class="text-h5 font-weight-bold mb-4">대시보드</div>

    <!-- KPI 카드 -->
    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-item>
            <div class="text-subtitle-2 text-medium-emphasis">총 사용자 수</div>
            <div class="text-h5 font-weight-bold">
              {{ kpi.totalUsers.toLocaleString() }}
            </div>
          </v-card-item>
          <v-card-text>
            <v-sparkline :value="spark.users" :auto-draw="true" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-item>
            <div class="text-subtitle-2 text-medium-emphasis">일일 면접 응시</div>
            <div class="text-h5 font-weight-bold">
              {{ kpi.dailyInterviews.toLocaleString() }}
            </div>
          </v-card-item>
          <v-card-text>
            <v-sparkline :value="spark.interviews" :auto-draw="true" />
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-item>
            <div class="text-subtitle-2 text-medium-emphasis">완주율(%)</div>
            <div class="text-h5 font-weight-bold">
              {{ kpi.completionRate }}%
            </div>
          </v-card-item>
          <v-card-text>
            <v-progress-linear
                :model-value="kpi.completionRate"
                height="8"
                rounded
            />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- 알림/이상징후 + 최근 항목 -->
    <v-row class="mt-2">
      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-subtitle-1">이상 징후</v-card-title>
          <v-divider />
          <v-list density="compact">
            <v-list-item
                v-for="(a, idx) in alerts"
                :key="idx"
                :title="a.title"
                :subtitle="a.subtitle"
            >
              <template #prepend>
                <v-icon :icon="a.icon" />
              </template>
              <template #append>
                <v-chip size="small" :color="a.levelColor" variant="flat">
                  {{ a.level }}
                </v-chip>
              </template>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card>
          <v-card-title class="text-subtitle-1">최근 신청(샘플)</v-card-title>
          <v-divider />
          <v-table density="comfortable">
            <thead>
            <tr>
              <th>사용자</th>
              <th>유형</th>
              <th>상태</th>
              <th>요청일</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="row in recent" :key="row.id">
              <td>{{ row.user }}</td>
              <td>{{ row.type }}</td>
              <td>
                <v-chip
                    size="small"
                    :color="row.status === '승인' ? 'success' : 'warning'"
                >
                  {{ row.status }}
                </v-chip>
              </td>
              <td>{{ row.date }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive } from "vue";

const kpi = reactive({
  totalUsers: 13456,
  dailyInterviews: 182,
  completionRate: 72,
});

const spark = reactive({
  users: [5, 6, 7, 10, 12, 9, 13, 15, 11, 16],
  interviews: [2, 3, 2, 4, 5, 6, 7, 5, 8, 9],
});

const alerts = reactive([
  {
    icon: "mdi-alert",
    title: "비정상 종료율 상승",
    subtitle: "지난주 대비 +4.3%",
    level: "주의",
    levelColor: "warning",
  },
  {
    icon: "mdi-progress-question",
    title: "질문 #12 응답률 저조",
    subtitle: "완주율 하락에 영향",
    level: "관찰",
    levelColor: "info",
  },
]);

const recent = reactive([
  { id: 1, user: "kim***", type: "면접응시", status: "승인", date: "2025-09-03" },
  { id: 2, user: "lee***", type: "퀴즈참여", status: "대기", date: "2025-09-03" },
]);

onMounted(async () => {
  // TODO: 실제 API 연동 시 여기서 KPI/알림/최근 목록 로드
  // const data = await adminApi.fetchOverview();
});
</script>

<style scoped>
/* 선택: 스타일 보정 */
</style>
