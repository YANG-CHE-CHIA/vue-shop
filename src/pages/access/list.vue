<script setup>
import { ref } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import IconSelect from '@/components/IconSelect.vue'
import ListHeader from '@/components/ListHeader.vue'
import { getRuleList, createRule, updateRule, updateRuleStatus, deleteRule } from '@/api/rule.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'

const defaultExpandedKeys = ref([])
const options = ref([])

const { loading, tableData, getData, DeleteHanlder, StatusChangeHandler } = useInitTable({
    getList: getRuleList,
    onGetListSuccess: (res) => {
        options.value = res.rules
        tableData.value = res.list
        defaultExpandedKeys.value = res.list.map(o => o.id)
    },
    delete: deleteRule,
    updateStatus: updateRuleStatus
})

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            rule_id: 0,
            menu: 0,
            name: "",
            condition: "",
            method: "GET",
            status: 1,
            order: 50,
            icon: "",
            frontpath: ""
        },
        rules: {

        },
        getData,
        update: updateRule,
        create: createRule
    })

//添加子分類
const AddChildHandler = (id) => {
    CreateHandler()
    form.rule_id = id
    form.status = 1
}

</script>
<template>
    <el-card shadow="never" class="info">
        <!-- 新增和刷新 -->
        <ListHeader @create="CreateHandler" @refresh="getData" />
        <el-tree :data="tableData" :props="{ label: 'name', children: 'child' }" node-key="id"
            :default-expanded-keys="defaultExpandedKeys" v-loading="loading">
            <template #default="{ data }">
                <div class="info_item">
                    <div class="left">
                        <el-tag size="small" :type="data.menu ? 'primary' : 'info'">
                            {{ data.menu ? '菜單' : '權限' }}
                        </el-tag>
                        <el-icon v-if="data.icon" :size="16" class="icon">
                            <component :is="data.icon" />
                        </el-icon>
                        <span class="text">{{ data.name }}</span>
                    </div>

                    <div class="right">
                        <el-switch :modelValue="data.status" :active-value="1" :inactive-value="0"
                            @change="StatusChangeHandler($event, data)"></el-switch>
                        <el-button text type="primary" size="small" @click.stop="UpdateHanlder(data)">修改</el-button>
                        <el-button text type="primary" size="small"
                            @click.stop="AddChildHandler(data.id)">增加</el-button>
                        <el-popconfirm title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                            @confirm="DeleteHanlder(data.id)">
                            <template #reference>
                                <el-button text type="primary" size="small">刪除</el-button>
                            </template>
                        </el-popconfirm>
                    </div>
                </div>
            </template>
        </el-tree>

        <!-- 彈跳視窗 -->
        <FormDrawer ref="formDrawerRef" :title="drawerTitle" @submitHandler="SubmitHandler">
            <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
                <el-form-item label="上級菜單" prop="rule_id">
                    <el-cascader v-model="form.rule_id" :options="options"
                        :props="{ value: 'id', label: 'name', children: 'child', checkStrictly: true, emitPath: false }"
                        placeholder="請選擇上級菜單" />
                </el-form-item>
                <el-form-item label="規則" prop="menu">
                    <el-radio-group v-model="form.menu">
                        <el-radio :label="1" border>菜單</el-radio>
                        <el-radio :label="0" border>規則</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="權限名稱" prop="name">
                    <el-input v-model="form.name" placeholder="權限名稱"></el-input>
                </el-form-item>
                <el-form-item label="圖標" prop="icon" v-if="form.menu == 1">
                    <IconSelect v-model="form.icon" />
                </el-form-item>
                <el-form-item label="前端路由" prop="frontpath" v-if="form.menu == 1 && form.rule_id > 0">
                    <el-input v-model="form.frontpath" placeholder="前端路由"></el-input>
                </el-form-item>
                <el-form-item label="後端規則" prop="condition" v-if="form.menu == 0">
                    <el-input v-model="form.condition" placeholder="後端規則"></el-input>
                </el-form-item>
                <el-form-item label="請求方式" prop="method" v-if="form.menu == 0">
                    <el-select v-model="form.method" placeholder="請選擇請求方式" style="width: 240px">
                        <el-option v-for="item in ['GET', 'POST', 'PUT', 'DELETE']" :key="item" :label="item"
                            :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000" />
                </el-form-item>
            </el-form>
        </FormDrawer>
    </el-card>
</template>

<style scoped>
.info {
    padding-top: 40px;
    border: none;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.info_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
}

.info_item .left .icon {
    margin-left: 10px;
}

.info_item .left .text {
    margin-left: 5px;
}

:deep(.el-tree-node__content) {
    padding: 20px 0;
}
</style>