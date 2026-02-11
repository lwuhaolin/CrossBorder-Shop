<template>
  <div class="dashboard-container">
    <a-spin :spinning="loading">
      <!-- Top Stats Cards -->
      <a-card
        :title="isAdmin ? '系统数据概览' : '我的经营数据'"
        :bordered="false"
        style="margin-bottom: 20px"
      >
        <template #extra><span style="color: #999">实时数据</span></template>
        <a-row :gutter="[16, 16]">
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="商品总数"
                :value="stats?.totalProducts || 0"
                :value-style="{ color: '#1890ff' }"
              >
                <template #prefix><ShoppingOutlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="在售商品"
                :value="stats?.activeProducts || 0"
                :value-style="{ color: '#52c41a' }"
              />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="订单总数"
                :value="stats?.totalOrders || 0"
                :value-style="{ color: '#1890ff' }"
              >
                <template #prefix><ShoppingCartOutlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="销售额"
                :value="totalRevenue"
                :precision="2"
                prefix="¥"
                :value-style="{ color: '#fa8c16' }"
              />
            </a-card>
          </a-col>
        </a-row>

        <!-- Admin specific row -->
        <a-row v-if="isAdmin" :gutter="[16, 16]" style="margin-top: 16px">
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="用户总数"
                :value="adminStats?.totalUsers || 0"
                :value-style="{ color: '#722ed1' }"
              >
                <template #prefix><UserOutlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="活跃用户"
                :value="adminStats?.activeUsers || 0"
                :value-style="{ color: '#13c2c2' }"
              />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic title="今日新增" :value="adminStats?.newUsersToday || 0" />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic title="今日销售" :value="revenueToday" :precision="2" prefix="¥" />
            </a-card>
          </a-col>
        </a-row>

        <!-- Seller specific row -->
        <a-row v-else :gutter="[16, 16]" style="margin-top: 16px">
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="销售总数"
                :value="sellerStats?.totalSales || 0"
                :value-style="{ color: '#faad14' }"
              >
                <template #prefix><RiseOutlined /></template>
              </a-statistic>
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic title="今日销售" :value="revenueToday" :precision="2" prefix="¥" />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="本月销售"
                :value="revenueThisMonth"
                :precision="2"
                prefix="¥"
                :value-style="{ color: '#52c41a' }"
              />
            </a-card>
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-card hoverable>
              <a-statistic
                title="待发货"
                :value="stats?.pendingOrders || 0"
                :value-style="{ color: '#1890ff' }"
              />
            </a-card>
          </a-col>
        </a-row>
      </a-card>

      <!-- Analysis Area -->
      <a-row :gutter="[16, 16]" style="margin-bottom: 20px">
        <a-col :xs="24" :sm="12" :md="8">
          <a-card title="商品分布" :bordered="true" class="chart-card">
            <div style="text-align: center; padding: 20px 0">
              <a-progress
                type="circle"
                :percent="productPercent"
                :size="150"
                stroke-color="#52c41a"
                :format="() => `${productPercent}%`"
              />
              <div class="progress-label">商品在售率</div>
              <a-row :gutter="16" style="margin-top: 16px">
                <a-col :span="12">
                  <a-statistic
                    title="在售"
                    :value="stats?.activeProducts || 0"
                    :value-style="{ color: '#52c41a', fontSize: '16px' }"
                  />
                </a-col>
                <a-col :span="12">
                  <a-statistic
                    title="已下架"
                    :value="inactiveProducts"
                    :value-style="{ color: '#ff4d4f', fontSize: '16px' }"
                  />
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="8">
          <a-card title="订单分布" :bordered="true" class="chart-card">
            <div style="text-align: center; padding: 20px 0">
              <a-progress
                type="circle"
                :percent="orderPercent"
                :size="150"
                stroke-color="#1890ff"
                :format="() => `${orderPercent}%`"
              />
              <div class="progress-label">订单完成率</div>
              <a-row :gutter="16" style="margin-top: 16px">
                <a-col :span="12">
                  <a-statistic
                    title="已完成"
                    :value="completedOrders"
                    :value-style="{ color: '#1890ff', fontSize: '16px' }"
                  />
                </a-col>
                <a-col :span="12">
                  <a-statistic
                    title="待处理"
                    :value="stats?.pendingOrders || 0"
                    :value-style="{ color: '#faad14', fontSize: '16px' }"
                  />
                </a-col>
              </a-row>
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :sm="12" :md="8">
          <a-card title="收入概览" :bordered="true" class="chart-card">
            <div style="padding: 20px 0">
              <a-statistic
                title="总销售额"
                :value="totalRevenue"
                :precision="2"
                prefix="¥"
                :value-style="{ color: '#1890ff', fontSize: '28px' }"
              />
              <a-divider />
              <a-statistic
                title="今日销售"
                :value="revenueToday"
                :precision="2"
                prefix="¥"
                :value-style="{ color: '#52c41a', fontSize: '28px' }"
              />
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- Bar chart replacement - progress bars -->
      <a-row :gutter="[16, 16]" style="margin-bottom: 20px">
        <a-col :xs="24" :lg="12">
          <a-card title="商品统计" :bordered="true">
            <div class="bar-stat-item">
              <div class="bar-stat-label">商品总数</div>
              <a-progress :percent="100" :format="() => `${stats?.totalProducts || 0}`" stroke-color="#1890ff" />
            </div>
            <div class="bar-stat-item">
              <div class="bar-stat-label">在售商品</div>
              <a-progress :percent="productPercent" :format="() => `${stats?.activeProducts || 0}`" stroke-color="#52c41a" />
            </div>
            <div class="bar-stat-item">
              <div class="bar-stat-label">已下架</div>
              <a-progress :percent="inactivePercent" :format="() => `${inactiveProducts}`" stroke-color="#ff4d4f" />
            </div>
          </a-card>
        </a-col>

        <a-col :xs="24" :lg="12">
          <a-card title="订单统计" :bordered="true">
            <div class="bar-stat-item">
              <div class="bar-stat-label">订单总数</div>
              <a-progress :percent="100" :format="() => `${stats?.totalOrders || 0}`" stroke-color="#1890ff" />
            </div>
            <div class="bar-stat-item">
              <div class="bar-stat-label">已完成</div>
              <a-progress :percent="orderPercent" :format="() => `${completedOrders}`" stroke-color="#52c41a" />
            </div>
            <div class="bar-stat-item">
              <div class="bar-stat-label">待处理</div>
              <a-progress :percent="pendingPercent" :format="() => `${stats?.pendingOrders || 0}`" stroke-color="#faad14" />
            </div>
          </a-card>
        </a-col>
      </a-row>

      <!-- Detailed Statistics -->
      <a-card title="详细统计" :bordered="true">
        <a-row :gutter="[32, 32]">
          <a-col :xs="24" :sm="12" :md="6">
            <a-statistic
              title="商品在售比例"
              :value="productPercent"
              suffix="%"
              :value-style="{ color: '#1890ff', fontSize: '20px' }"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-statistic
              title="订单完成比例"
              :value="orderPercent"
              suffix="%"
              :value-style="{ color: '#52c41a', fontSize: '20px' }"
            />
          </a-col>
          <a-col :xs="24" :sm="12" :md="6">
            <a-statistic
              title="今日销售占比"
              :value="revenueTrendPercent"
              suffix="%"
              :value-style="{ color: '#fa8c16', fontSize: '20px' }"
            />
          </a-col>
          <a-col v-if="isAdmin" :xs="24" :sm="12" :md="6">
            <a-statistic
              title="用户总数"
              :value="adminStats?.totalUsers || 0"
              :value-style="{ color: '#722ed1', fontSize: '20px' }"
            />
          </a-col>
          <a-col v-else :xs="24" :sm="12" :md="6">
            <a-statistic
              title="销售总数"
              :value="sellerStats?.totalSales || 0"
              :value-style="{ color: '#722ed1', fontSize: '20px' }"
            />
          </a-col>
        </a-row>
      </a-card>
    </a-spin>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import {
  ShoppingOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  RiseOutlined,
} from '@ant-design/icons-vue'
import { getSystemStats, getSellerStats } from '@/services/settings'
import { useUserStore } from '@/stores/user'
import type { SystemStats, SellerStats } from '@/models/settings'

const userStore = useUserStore()
const isAdmin = computed(() => userStore.isAdmin)

const loading = ref(true)
const adminStats = ref<SystemStats | null>(null)
const sellerStats = ref<SellerStats | null>(null)

const stats = computed(() => (isAdmin.value ? adminStats.value : sellerStats.value) as (SystemStats & SellerStats) | null)

const totalRevenue = computed(() =>
  stats.value?.totalRevenue ? parseFloat(stats.value.totalRevenue.toString()) : 0,
)

const revenueToday = computed(() =>
  stats.value?.revenueToday ? parseFloat(stats.value.revenueToday.toString()) : 0,
)

const revenueThisMonth = computed(() =>
  sellerStats.value?.revenueThisMonth ? parseFloat(sellerStats.value.revenueThisMonth.toString()) : 0,
)

const productPercent = computed(() => {
  if (!stats.value || !stats.value.totalProducts) return 0
  return Math.round(((stats.value.activeProducts || 0) / stats.value.totalProducts) * 100)
})

const inactiveProducts = computed(() =>
  (stats.value?.totalProducts || 0) - (stats.value?.activeProducts || 0),
)

const inactivePercent = computed(() => {
  if (!stats.value || !stats.value.totalProducts) return 0
  return Math.round((inactiveProducts.value / stats.value.totalProducts) * 100)
})

const completedOrders = computed(() =>
  (stats.value?.totalOrders || 0) - (stats.value?.pendingOrders || 0),
)

const orderPercent = computed(() => {
  if (!stats.value || !stats.value.totalOrders) return 0
  return Math.round((completedOrders.value / stats.value.totalOrders) * 100)
})

const pendingPercent = computed(() => {
  if (!stats.value || !stats.value.totalOrders) return 0
  return Math.round(((stats.value.pendingOrders || 0) / stats.value.totalOrders) * 100)
})

const revenueTrendPercent = computed(() => {
  if (!stats.value || !stats.value.totalRevenue || stats.value.totalRevenue === 0) return 0
  return Math.round((revenueToday.value / parseFloat(stats.value.totalRevenue.toString())) * 100)
})

const loadStats = async () => {
  try {
    loading.value = true
    if (isAdmin.value) {
      const response = await getSystemStats()
      adminStats.value = response.data ?? null
    } else {
      const response = await getSellerStats()
      sellerStats.value = response.data ?? null
    }
  } catch (error) {
    console.error('Failed to load statistics:', error)
    message.error('加载统计数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
  background: #f5f5f5;
  min-height: 100%;
}

.chart-card {
  height: 100%;
}

.progress-label {
  margin-top: 8px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}

.bar-stat-item {
  margin-bottom: 16px;
}

.bar-stat-label {
  margin-bottom: 4px;
  color: rgba(0, 0, 0, 0.45);
  font-size: 14px;
}
</style>
