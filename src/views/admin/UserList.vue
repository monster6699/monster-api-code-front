<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted } from 'vue'
import type { Rule as FormRule } from 'ant-design-vue/es/form'
import {
  Table,
  Form,
  Input,
  Button,
  Modal,
  Space,
  Popconfirm,
  message,
  Card,
  Avatar,
} from 'ant-design-vue'
import {
  listUserVoByPage,
  addUser,
  deleteUser,
  updateUser,
  getUserById,
} from '@/api/userController'

type FormRules = Record<string, FormRule[]>

const loading = ref(false)
const dataSource = ref<API.UserVO[]>([])
const total = ref(0)
const tableScrollY = ref<number>(520)
const query = reactive<API.UserQueryRequest>({
  pageNum: 1,
  pageSize: 10,
  userName: '',
  userAccount: '',
})
const editVisible = ref(false)
const editLoading = ref(false)
const editForm = reactive<API.UserUpdateRequest & { userAccount?: string }>({
  id: undefined,
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
  userAccount: '',
})
const editFormRules: FormRules = {
  userName: [{ type: 'string', required: true, message: '请输入用户名', trigger: 'blur' }],
}

const addVisible = ref(false)
const addLoading = ref(false)
const addForm = reactive<API.UserAddRequest>({
  userAccount: '',
  userName: '',
  userAvatar: '',
  userProfile: '',
  userRole: '',
})
const addFormRules: FormRules = {
  userAccount: [{ type: 'string', required: true, message: '请输入账户名', trigger: 'blur' }],
  userName: [{ type: 'string', required: true, message: '请输入用户名', trigger: 'blur' }],
}

function formatCreateTime(val: string | undefined): string {
  if (!val) return '—'
  try {
    const d = new Date(val)
    if (isNaN(d.valueOf())) return val
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    const s = String(d.getSeconds()).padStart(2, '0')
    return `${y}-${m}-${day} ${h}:${min}:${s}`
  } catch {
    return val
  }
}

const fetchList = async () => {
  loading.value = true
  try {
    const res = await listUserVoByPage({
      pageNum: query.pageNum,
      pageSize: query.pageSize,
      userName: query.userName?.trim() || undefined,
      userAccount: query.userAccount?.trim() || undefined,
    })
    dataSource.value = res.data?.data?.records ?? []
    total.value = res.data?.data?.totalRow ?? 0
  } catch {
    message.error('加载用户列表失败')
    dataSource.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

function onSearch() {
  query.pageNum = 1
  fetchList()
}

function onReset() {
  query.userName = ''
  query.userAccount = ''
  query.pageNum = 1
  fetchList()
}

function onTableChange(pagination: { current?: number; pageSize?: number }) {
  if (pagination.current != null) query.pageNum = pagination.current
  if (pagination.pageSize != null) query.pageSize = pagination.pageSize
  fetchList()
}

async function openEdit(record: API.UserVO) {
  editVisible.value = true
  editForm.id = record.id
  editForm.userName = record.userName ?? ''
  editForm.userAccount = record.userAccount ?? ''
  editForm.userAvatar = record.userAvatar ?? ''
  editForm.userProfile = record.userProfile ?? ''
  editForm.userRole = record.userRole ?? ''
  try {
    const res = await getUserById({ id: record.id! })
    const user = res.data?.data
    if (user) {
      editForm.userName = user.userName ?? ''
      editForm.userAvatar = user.userAvatar ?? ''
      editForm.userProfile = user.userProfile ?? ''
      editForm.userRole = user.userRole ?? ''
    }
  } catch {
    // 若 get 失败，仍用列表行数据
  }
}

function closeEdit() {
  editVisible.value = false
  editForm.id = undefined
  editForm.userName = ''
  editForm.userAccount = ''
  editForm.userAvatar = ''
  editForm.userProfile = ''
  editForm.userRole = ''
}

function openAdd() {
  addVisible.value = true
  addForm.userAccount = ''
  addForm.userName = ''
  addForm.userAvatar = ''
  addForm.userProfile = ''
  addForm.userRole = ''
}

function closeAdd() {
  addVisible.value = false
  addForm.userAccount = ''
  addForm.userName = ''
  addForm.userAvatar = ''
  addForm.userProfile = ''
  addForm.userRole = ''
}

async function handleAddOk() {
  if (!addForm.userAccount?.trim()) {
    message.warning('请输入账户名')
    return
  }
  if (!addForm.userName?.trim()) {
    message.warning('请输入用户名')
    return
  }
  addLoading.value = true
  try {
    await addUser({
      userAccount: addForm.userAccount.trim(),
      userName: addForm.userName.trim(),
      userAvatar: addForm.userAvatar?.trim() || undefined,
      userProfile: addForm.userProfile?.trim() || undefined,
      userRole: addForm.userRole?.trim() || undefined,
    })
    message.success('新增成功')
    closeAdd()
    await fetchList()
  } catch {
    message.error('新增失败')
  } finally {
    addLoading.value = false
  }
}

async function handleEditOk() {
  if (editForm.id == null) return
  editLoading.value = true
  try {
    await updateUser({
      id: editForm.id,
      userName: editForm.userName,
      userAvatar: editForm.userAvatar || undefined,
      userProfile: editForm.userProfile || undefined,
      userRole: editForm.userRole || undefined,
    })
    message.success('修改成功')
    closeEdit()
    await fetchList()
  } catch {
    message.error('修改失败')
  } finally {
    editLoading.value = false
  }
}

async function handleDelete(id: number) {
  try {
    await deleteUser({ id })
    message.success('删除成功')
    await fetchList()
  } catch {
    message.error('删除失败')
  }
}

function updateTableScrollY() {
  // 让表格主体在内容区内滚动，避免数据过多把页脚顶出视口
  const y = window.innerHeight - 380
  tableScrollY.value = Math.max(260, y)
}

onMounted(() => {
  updateTableScrollY()
  window.addEventListener('resize', updateTableScrollY)
  fetchList()
})

onUnmounted(() => {
  window.removeEventListener('resize', updateTableScrollY)
})
</script>

<template>
  <div class="user-list-page">
    <Card title="用户列表">
      <div class="toolbar">
        <Space wrap>
          <Input
            v-model:value="query.userName"
            placeholder="用户名"
            allow-clear
            style="width: 160px"
            @press-enter="onSearch"
          />
          <Input
            v-model:value="query.userAccount"
            placeholder="账户名"
            allow-clear
            style="width: 160px"
            @press-enter="onSearch"
          />
          <Button type="primary" :loading="loading" @click="onSearch"> 查询 </Button>
          <Button @click="onReset">重置</Button>
          <Button type="primary" @click="openAdd">新增用户</Button>
        </Space>
      </div>

      <Table
        :columns="[
          { title: '头像', dataIndex: 'userAvatar', key: 'userAvatar', width: 80, align: 'center' },
          { title: '账户名', dataIndex: 'userAccount' },
          { title: '用户名', dataIndex: 'userName' },
          { title: '角色', dataIndex: 'userRole' },
          { title: '个人简介', dataIndex: 'userProfile', ellipsis: true },
          { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
          {
            title: '操作',
            key: 'action',
            width: 160,
            fixed: 'right',
          },
        ]"
        :data-source="dataSource"
        :loading="loading"
        :pagination="{
          current: query.pageNum,
          pageSize: query.pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t: number) => `共 ${t} 条`,
          pageSizeOptions: ['10', '20', '50'],
        }"
        row-key="id"
        :scroll="{ x: 980, y: tableScrollY }"
        @change="onTableChange"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'userAvatar'">
            <Avatar :src="record.userAvatar" :size="40">
              {{ (record.userName ?? record.userAccount ?? '?').charAt(0) }}
            </Avatar>
          </template>
          <template v-else-if="column.key === 'createTime'">
            {{ formatCreateTime(record.createTime) }}
          </template>
          <template v-else-if="column.key === 'action'">
            <Space>
              <Button type="link" size="small" @click="openEdit(record)"> 编辑 </Button>
              <Popconfirm
                title="确定要删除该用户吗？"
                ok-text="确定"
                cancel-text="取消"
                @confirm="handleDelete(record.id!)"
              >
                <Button type="link" size="small" danger>删除</Button>
              </Popconfirm>
            </Space>
          </template>
        </template>
      </Table>
    </Card>

    <Modal
      v-model:open="addVisible"
      title="新增用户"
      :confirm-loading="addLoading"
      ok-text="确定"
      cancel-text="取消"
      destroy-on-close
      @ok="handleAddOk"
      @cancel="closeAdd"
    >
      <Form :model="addForm" :rules="addFormRules" layout="vertical" style="margin-top: 16px">
        <Form.Item label="账户名" name="userAccount" required>
          <Input v-model:value="addForm.userAccount" placeholder="请输入账户名（登录用）" />
        </Form.Item>
        <Form.Item label="用户名" name="userName" required>
          <Input v-model:value="addForm.userName" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="头像 URL" name="userAvatar">
          <Input v-model:value="addForm.userAvatar" placeholder="选填" />
        </Form.Item>
        <Form.Item label="个人简介" name="userProfile">
          <Input.TextArea v-model:value="addForm.userProfile" :rows="3" placeholder="选填" />
        </Form.Item>
        <Form.Item label="角色" name="userRole">
          <Input v-model:value="addForm.userRole" placeholder="如 user / admin" />
        </Form.Item>
      </Form>
    </Modal>

    <Modal
      v-model:open="editVisible"
      title="编辑用户"
      :confirm-loading="editLoading"
      ok-text="保存"
      cancel-text="取消"
      destroy-on-close
      @ok="handleEditOk"
      @cancel="closeEdit"
    >
      <Form :model="editForm" :rules="editFormRules" layout="vertical" style="margin-top: 16px">
        <Form.Item label="账户名" name="userAccount">
          <Input v-model:value="editForm.userAccount" disabled />
        </Form.Item>
        <Form.Item label="用户名" name="userName">
          <Input v-model:value="editForm.userName" placeholder="请输入用户名" />
        </Form.Item>
        <Form.Item label="头像 URL" name="userAvatar">
          <Input v-model:value="editForm.userAvatar" placeholder="选填" />
        </Form.Item>
        <Form.Item label="个人简介" name="userProfile">
          <Input.TextArea v-model:value="editForm.userProfile" :rows="3" placeholder="选填" />
        </Form.Item>
        <Form.Item label="角色" name="userRole">
          <Input v-model:value="editForm.userRole" placeholder="如 user / admin" />
        </Form.Item>
      </Form>
    </Modal>
  </div>
</template>

<style scoped>
.user-list-page {
  height: 100%;
  padding: 0;
  overflow: hidden;
}

.toolbar {
  margin-bottom: 16px;
}
</style>
