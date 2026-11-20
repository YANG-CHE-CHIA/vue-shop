<script setup>
import { ref, reactive } from 'vue'
import { getSysconfig, setSysconfig, uploadAction } from '@/api/sysconfig.js'
import { toast } from '@/composables/util.js'
import { getToken } from '@/composables/auth.js'
import FormDrawer from '@/components/FormDrawer.vue'
const activeName = ref('first')


const token = getToken()


const tableData = [
    {
        name: '支付寶支付',
        desc: '該系統支持即時到帳街口',
        src: '/alipay.jpg',
        key: 'alipay'
    },
    {
        name: '微信支付',
        desc: '該系統支持微信網頁支付和掃碼支付',
        src: '/wepay.png',
        key: 'wxpay'
    }
]

const form = reactive({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "...",
        "ali_public_key": "...",
        "private_key": "..."
    },
    "wxpay": {
        "app_id": "...",
        "miniapp_id": "...",
        "secret": "...",
        "appid": "...",
        "mch_id": "...",
        "key": "...",
        "cert_client": "....pem",
        "cert_key": "....pem"
    },
})

const loading = ref(false)

async function getData() {
    loading.value = true
    try {
        const res = await getSysconfig()
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

        await setSysconfig({
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

const formDrawerRef = ref(null)
const drawerType = ref('alipay')

const open = (key) => {
    drawerType.value = key
    formDrawerRef.value.open()
}

function uploadClientSuccess(response, uploadFile, uploadFiles) {
    form.wxpay.cert_client = response.data
}

function uploadKeySuccess(response, uploadFile, uploadFiles) {
    form.wxpay.cert_key = response.data
}

</script>

<template>
    <div class="info  bg-gray-100  p-4 rounded" v-loading="loading">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="支付設置" name="first">
                    <el-table :data="tableData" border stripe>
                        <el-table-column label="支付方式" align="left">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image :src="row.src" fit="fill" :lazy="true" style="width: 40px; height: 40px;"
                                        class="roinded pr-2"></el-image>

                                    <h6>{{ row.name }}</h6>
                                    <small class=" text-gray-500 pt-1 pl-2">{{ row.desc }}</small>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="150">
                            <template #default="{ row }">
                                <div>
                                    <el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>

                </el-tab-pane>

                <el-tab-pane label="購物設置" name="second">

                    <el-form-item label="未支付訂單">
                        <div>
                            <el-input v-model="form.close_order_minute" placeholder="未支付訂單" type="number">
                                <template #append>
                                    分鐘後自動關閉
                                </template>
                            </el-input>
                            <small class=" text-gray-500 flex pl-1">訂單下單未付款，n 分鐘後自動關閉，設為 0 則不自動關閉</small>
                        </div>
                    </el-form-item>

                    <el-form-item label="已發貨訂單">
                        <div>
                            <el-input v-model="form.auto_received_day" placeholder="已發貨訂單" type="number">
                                <template #append>
                                    天後自動確認收貨
                                </template>
                            </el-input>
                            <small class=" text-gray-500 flex pl-1">如果在期間內未確認收貨，系統將自動完成收貨，設為 0 則不自動收貨</small>
                        </div>
                    </el-form-item>

                    <el-form-item label="已完成訂單">
                        <div>
                            <el-input v-model="form.after_sale_day" placeholder="已完成訂單" type="number">
                                <template #append>
                                    天內允許申請售後
                                </template>
                            </el-input>
                            <small class=" text-gray-500 flex pl-1">訂單完成後，用戶可在 n 天內發起售後申請，設為 0 則不允許申請售後</small>
                        </div>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" size="default" @click="submit">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <FormDrawer ref="formDrawerRef" title="配置" @submitHandler='submit'>
            <el-form v-if="drawerType == 'alipay'" :model="form" label-width="120px">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="ali_public_key">
                    <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key" style="width: 90%;"
                        type="textarea" rows="4"></el-input>
                </el-form-item>

                <el-form-item label="private_key">
                    <el-input v-model="form.alipay.private_key" placeholder="private_key" style="width: 90%;"
                        type="textarea" rows="4"></el-input>
                </el-form-item>
            </el-form>

            <el-form v-else :model="form" label-width="120px">
                <el-form-item label="公眾號 APPID">
                    <el-input v-model="form.wxpay.app_id" placeholder="公眾號 APPID" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="小程序 APPID">
                    <el-input v-model="form.wxpay.miniapp_id" placeholder="小程序 APPID" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="小程序 secret">
                    <el-input v-model="form.wxpay.secret" placeholder="小程序 secret" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" placeholder="appid" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="商戶號">
                    <el-input v-model="form.wxpay.mch_id" placeholder="商戶號" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="API 金鑰">
                    <el-input v-model="form.wxpay.key" placeholder="API 金鑰" style="width: 90%;"></el-input>
                </el-form-item>

                <el-form-item label="cert_client">
                    <el-upload :action="uploadAction" :limit="1" :headers="{ token }" accept=".pem"
                        :on-success="uploadClientSuccess">
                        <el-button type="primary">點擊上傳</el-button>
                        <template #tip>
                            <p class=" text-red-500">{{ form.wxpay.cert_client ? form.wxpay.cert_client : '尚未配置' }}</p>
                            <div class="el-upload__tip">
                                例如:apiclient_cert.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload :action="uploadAction" :limit="1" :headers="{ token }" accept=".pem"
                        :on-success="uploadKeySuccess">
                        <el-button type="primary">點擊上傳</el-button>
                        <template #tip>
                            <p class=" text-red-500">{{ form.wxpay.cert_key ? form.wxpay.cert_key : '尚未配置' }}</p>
                            <div class="el-upload__tip">
                                例如:apiclient_key.pem
                            </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </FormDrawer>
    </div>
</template>

<style scoped>
.info {
    padding-top: 20px;
    margin-top: 40px;
}
</style>