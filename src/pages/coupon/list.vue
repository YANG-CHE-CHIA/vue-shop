<script setup>
import { ref, computed } from 'vue'
import FormDrawer from '@/components/FormDrawer.vue'
import ListHeader from '@/components/ListHeader.vue'
import { getCouponList, createCoupon, updateCoupon, deleteCoupon, updateCouponStatus } from '@/api/coupon.js'
import { useInitTable, useInitForm } from '@/composables/useCommon.js'
const { tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
    = useInitTable({
        getList: getCouponList,
        onGetListSuccess: (res) => {
            tableData.value = res.list.map(item => {
                //轉換優惠券狀態
                item.statusText = formatStatus(item)
                return item
            })
            total.value = res.totalCount
        },
        delete: deleteCoupon,
        updateStatus: updateCouponStatus
    })

const { formDrawerRef, formRef, form, rules, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }
    = useInitForm({
        form: {
            name: "",
            type: 0,
            value: 0,
            total: 100,
            min_price: 0,
            start_time: null,
            end_time: null,
            order: 50,
            desc: ""
        },
        getData,
        update: updateCoupon,
        create: createCoupon,
        beforeSubmit: (f) => {
            if (typeof f.start_time != "number") {
                f.start_time = new Date(f.start_time).getTime()
            }
            if (typeof f.end_time != "number") {
                f.end_time = new Date(f.end_time).getTime()
            }

            return f
        }
    })

function formatStatus(row) {
    let s = '領取中'
    let start_time = new Date(row.start_time).getTime()
    let now = new Date().getTime()
    let end_time = new Date(row.end_time).getTime()

    if (start_time > now) {
        s = '未開始'
    }
    else if (end_time < now) {
        s = '已結束'
    }
    else if (row.status == 0) {
        s = '已失效'
    }
    return s
}

const timerange = computed({
    get() {
        return form.start_time && form.end_time ? [form.start_time, form.end_time] : []
    },
    set(value) {
        form.start_time = value[0];
        form.end_time = value[1];
    }
})

</script>

<template>
    <el-card shadow="never" class="info">
        <!-- 新增和刷新 -->
        <ListHeader @create="CreateHandler" @refresh="getData" />

        <!-- 資料 -->
        <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
            <el-table-column label="優惠券名稱" width="350">
                <template #default="{ row }">
                    <div class="coupon_title" :class="row.statusText == '領取中' ? 'active' : 'inactive'">
                        <h5>{{ row.name }}</h5>
                        <small>{{ row.start_time }} ~ {{ row.end_time }}</small>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="statusText" label="狀態" />
            <el-table-column label="優惠">
                <template #default="{ row }">
                    {{ row.type == 0 ? "滿減" : "折扣" }} {{ row.type == 0 ? ("$" + row.value) : (row.value) }}
                </template>
            </el-table-column>
            <el-table-column prop="total" label="發放數量" />
            <el-table-column prop="used" label="已使用" />
            <el-table-column label="操作" width="180" align="center">
                <template #default="scope">
                    <el-button v-if="scope.row.statusText == '未開始'" text type="primary" size="small" @click="UpdateHanlder(scope.row)">修改</el-button>

                    <el-popconfirm v-if="scope.row.statusText != '領取中'" title="是否要刪除" confirmButtonText="確認" cancelButtonText="取消"
                        @confirm="DeleteHanlder(scope.row.id)">
                        <template #reference>
                            <el-button text type="primary" size="small">刪除</el-button>
                        </template>
                    </el-popconfirm>

                    <el-popconfirm v-if="scope.row.statusText == '領取中'" title="是否要讓該優惠券失效" confirmButtonText="確認" cancelButtonText="取消"
                        @confirm="StatusChangeHandler(0,scope.row)">
                        <template #reference>
                            <el-button type="danger" size="small">失效</el-button>
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
            <el-form :model="form" ref="formRef" :rules="rules" label-width="100px" :inline="false">
                <el-form-item label="優惠券名稱" prop="name">
                    <el-input v-model="form.name" placeholder="優惠券名稱"></el-input>
                </el-form-item>
                <el-form-item label="類型" prop="type">
                    <el-radio-group v-model="form.type">
                        <el-radio :label="0">滿減</el-radio>
                        <el-radio :label="1">折扣</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="面值" prop="value">
                    <el-input v-model="form.value" placeholder="面值">
                        <template #append>{{ form.type ? '折' : '元' }}</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="發行量" prop="total">
                    <el-input-number v-model="form.total" :min="0" :max="10000"></el-input-number>
                </el-form-item>
                <el-form-item label="最低使用金額" prop="min_price">
                    <el-input type="number" v-model="form.min_price" placeholder="最低使用金額"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="form.order" :min="0" :max="1000"></el-input-number>
                </el-form-item>
                <el-form-item label="活動時間">
                    <el-date-picker :editable="false" v-model="timerange" value-format="YYYY-MM-DD HH:mm:ss"
                        type="datetimerange" range-separator="~" start-placeholder="開始時間" end-placeholder="結束時間" />
                </el-form-item>
                <el-form-item label="描述" prop="desc">
                    <el-input v-model="form.desc" placeholder="描述" type="textarea" :rows="5"></el-input>
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
    margin-bottom: 20px;
}

.info .bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
}

.coupon_title {
    border-radius: 5px;
    padding: 5px 10px;
}

.coupon_title h5 {
    font-size: 16px;
    color: #000000;
    font-weight: bold;
}

.active {
    border: 1px dashed #ff0000;
    background: #fff0f0;
    color: #ff0000;
}

.inactive {
    border: 1px dashed #e6e0e0;
    background: #e6e0e0;
    color: #000000;
}
</style>