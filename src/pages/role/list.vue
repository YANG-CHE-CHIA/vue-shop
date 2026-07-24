<script setup>
import { ref } from 'vue'
import { toast } from '@/composables/util'  
import FormDrawer from '@/components/FormDrawer.vue'
import ListHeader from '@/components/ListHeader.vue'
import { getRuleList } from '@/api/rule.js'
import { getRoleList, createRole, updateRole, deleteRole, updateRoleStatus, setRoleRules } from '@/api/role.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
    = useInitTable({
        getList: getRoleList,
        delete: deleteRole,
        updateStatus: updateRoleStatus
    })

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            name: "",
            desc: "",
            status: 1
        },
        rules: {
            name: [{ required: true, message: '請輸入角色名稱', trigger: 'blur' }]
        },
        getData,
        update: updateRole,
        create: createRole
    })

const setRuleFormDrawerRef = ref(null)
const ruleList = ref([])
const treeHeight = ref(0)
const roleId = ref(0)
const defaultExpandedKeys = ref([])
const elTreeRef = ref(null)
const ruleIds = ref([])
const checkStrictly = ref(false)

const openSetRule = async (row) => {
    roleId.value = row.id
    treeHeight.value = window.innerHeight - 180
    checkStrictly.value = true

    try {
        const res = await getRuleList(1);
        ruleList.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
        setRuleFormDrawerRef.value.open()

        //取得當前角色權限的ID
        ruleIds.value = row.rules.map(o => o.id)
        setTimeout(() => {
            elTreeRef.value.setCheckedKeys(ruleIds.value)
            // checkStrictly.value = false
        }, 150)

    } catch (error) {
        console.error('發生錯誤：', error);
    }
}

const SetRuleSubmitHandler = async () => {
    setRuleFormDrawerRef.value.showLoading()
    try {
        await setRoleRules(roleId.value, ruleIds.value)
        toast('配置成功', 'success');
        getData()
        setRuleFormDrawerRef.value.close()
    } 
    catch (error) {
        console.error('發生錯誤：', error);
    }
    finally{
        setRuleFormDrawerRef.value.hideLoading()
    }
}

const TreeCheckHandler = (...e) => {
    const { checkedKeys, halfCheckedKeys } = e[1]
    ruleIds.value = [...checkedKeys, ...halfCheckedKeys]
}

</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 新增和刷新 -->
        <ListHeader @create="CreateHandler" @refresh="getData" />

        <!-- 資料 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column prop="name" label="角色名稱" />
            <el-table-column prop="desc" label="角色描述" width="380" />
            <el-table-column prop="create_time" label="狀態" width="120">
                <template #default="{ row }">
                    <el-switch :modelValue="row.status" :active-value="1" :inactive-value="0"
                        @change="StatusChangeHandler($event, row)" :loading="row.statusLoading"
                        :disabled="row.super == 1">
                    </el-switch>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="250" align="center">
                <template #default="scope">
                    <el-button text type="primary" size="small" @click="openSetRule(scope.row)">配置權限</el-button>
                    <el-button text type="primary" size="small" @click="UpdateHanlder(scope.row)">修改</el-button>
                    <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                        @confirm="DeleteHanlder(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">刪除</el-button>
                        </template>
                    </el-popconfirm>
                </template>
            </el-table-column>
        </el-table>

        <!-- 頁碼 -->
        <div class="bottom">
            <el-pagination background layout="prev, pager, next" :total="total" :current-page="currentPage"
                :page-size="limit" @current-change="getData" />
        </div>

        <!-- 彈跳視窗 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submitHandler="SubmitHandler">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="角色名稱" prop="name">
                    <el-input v-model="form.name" placeholder="角色名稱"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="角色描述" type="textarea" :rows="5"></el-input>
                </el-form-item>
                <el-form-item label="狀態" prop="status">
                    <el-switch v-model="form.status" :active-value="1" :inactive-value="0">
                    </el-switch>
                </el-form-item>
            </el-form>
        </FormDrawer>

        <!-- 權限配置 -->
        <FormDrawer ref="setRuleFormDrawerRef" title="權限配置" @submitHandler="SetRuleSubmitHandler">
            <el-tree-v2 ref="elTreeRef" node-key="id" :check-strictly="checkStrictly" :default-expanded-keys="defaultExpandedKeys" :data="ruleList"
                :props="{ label: 'name', children: 'child' }" show-checkbox :height="treeHeight"
                @check="TreeCheckHandler">
                <template #default="{ data }">
                    <div class="dflex">
                        <el-tag :type="data.menu ? 'primary' : 'info'" size="small">
                            {{ data.menu ? '菜單' : '權限' }}
                        </el-tag>
                        <span style="margin-left: 5px;">{{ data.name }}</span>
                    </div>
                </template>
            </el-tree-v2>
        </FormDrawer>
    </el-card>
</template>

<style scoped>
.info {
    padding-top: 40px;
    border: none;
}

.dflex {
    display: flex;
    align-items: center;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 20px;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}
</style>