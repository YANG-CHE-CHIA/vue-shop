<script setup>
import { ref, reactive } from 'vue'
import { getConfig, setConfig } from '@/api/distribution.js'
import { toast } from '@/composables/util.js'

const form = reactive({
    "distribution_open": 1,
    "store_first_rebate": 10,
    "store_second_rebate": 20,
    "spread_banners": [
        "http://...png",
        // ...
    ],
    "is_self_brokerage": 1,
    "settlement_days": 7,
    "brokerage_method": "hand"
})

const loading = ref(false)

async function getData() {
    loading.value = true
    try {
        const res = await getConfig()
        for (const k in form) {
            form[k] = res[k]
        }
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        loading.value = false
    }
}

getData()

const submit = async () => {
    loading.value = true
    try {

        await setConfig({
            ...form,
        })

        toast('修改成功', 'success')
        getData()
    }
    catch (error) {
        console.error('失敗：', error)
    }
    finally {
        loading.value = false
    }
}
</script>

<template>
    <div class="info  bg-gray-100  p-4 rounded" v-loading="loading">
        <el-form :model="form" label-width="160px">

            <div class="item">
                <h5 class=" bg-gray-100 p-3 rounded">基礎設置</h5>
                <el-form-item label="分銷啟用">
                    <el-radio-group v-model="form.distribution_open">
                        <el-radio :value="0" border>
                            是
                        </el-radio>
                        <el-radio :value="1" border>
                            否
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>

            <div class="item">
                <h5 class=" bg-gray-100 p-3 rounded">返傭設置</h5>
                <el-form-item label="一級返傭比例">
                    <div>
                        <el-input v-model="form.store_first_rebate" placeholder="一級返傭比例" style="width: 50%;"
                            type="number">
                            <template #append>%</template>
                        </el-input>
                        <small class=" text-gray-500 flex pl-1">訂單交易成功後給予上級返傭的比例為 0 - 100，例如：5 = 返還訂單金額的 5%</small>
                    </div>
                </el-form-item>
                <el-form-item label="二級返傭比例">
                    <div>
                        <el-input v-model="form.store_second_rebate" placeholder="二級返傭比例" style="width: 50%;"
                            type="number">
                            <template #append>%</template>
                        </el-input>
                        <small class=" text-gray-500 flex pl-1">訂單交易成功後給予上級返傭的比例為 0 - 100，例如：5 = 返還訂單金額的 5%</small>
                    </div>
                </el-form-item>
                <el-form-item label="自購返用">
                    <div>
                        <el-radio-group v-model="form.is_self_brokerage">
                            <el-radio :value="0" border>
                                禁用
                            </el-radio>
                            <el-radio :value="1" border>
                                開啟
                            </el-radio>
                        </el-radio-group>
                        <small
                            class=" text-gray-500 flex pl-1">是否開啟自購返傭（開啟：分銷員自己購買商品，可享有一級返傭，上級可享有二級返傭；關閉：分銷員自己購買商品沒有返傭）</small>
                    </div>
                </el-form-item>
            </div>

            <div class="item">
                <h5 class=" bg-gray-100 p-3 rounded">結算設置</h5>
                <el-form-item label="結算時間">
                    <div>
                        <el-input v-model="form.settlement_days" placeholder="結算時間" style="width: 80%;" type="number">
                            <template #prepend>訂單完成後</template>
                            <template #append>天</template>
                        </el-input>
                        <small class=" text-gray-500 flex pl-1">預估傭金結算後便無法進行回收，請謹慎設定結算天數</small>
                    </div>
                </el-form-item>

                <el-form-item label="佣金到帳時間">
                    <div>
                        <el-radio-group v-model="form.brokerage_method">
                            <el-radio value="hand" border>
                                手動轉帳
                            </el-radio>
                            <el-radio value="wx" border>
                                自動到微信
                            </el-radio>
                        </el-radio-group>
                        <small class=" text-gray-500 flex pl-1">傭金入帳方式支援線下轉帳和微信零錢自動轉帳，手動轉帳更安全，自動轉帳更方便</small>
                    </div>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="default" @click="submit">保存</el-button>
                </el-form-item>
            </div>

        </el-form>
    </div>
</template>

<style scoped>
.info {
    padding-top: 20px;
    margin-top: 40px;
}
</style>