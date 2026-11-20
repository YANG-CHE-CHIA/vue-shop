<script setup>
import { ref, reactive } from 'vue'
import { getSysconfig, setSysconfig } from '@/api/sysconfig.js'
import { toast } from '@/composables/util.js'
const activeName = ref('first')

const form = reactive({
    "open_reg": 1,
    "reg_method": "username",
    "password_min": 7,
    "password_encrypt": [],
    "upload_method": "oss",
    "upload_config": {
        "Bucket": "",
        "ACCESS_KEY": "",
        "SECRET_KEY": "",
        "http": ""
    },
    "api_safe": 1,
    "api_secret": "",
})

const loading = ref(false)

async function getData() {
    loading.value = true
    try {
        const res = await getSysconfig()
        for (const k in form) {
            form[k] = res[k]
        }
        form.password_encrypt = form.password_encrypt.split(',')
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
            password_encrypt:form.password_encrypt.join(',')
        })

        toast('修改成功','success')
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
            <el-tabs v-model="activeName">
                <el-tab-pane label="註冊與訪問" name="first">
                    <el-form-item label="是否允許註冊會員">
                        <el-radio-group v-model="form.open_reg">
                            <el-radio :value="0" border>
                                關閉
                            </el-radio>
                            <el-radio :value="1" border>
                                開啟
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="註冊類型">
                        <el-radio-group v-model="form.reg_method">
                            <el-radio :value="'username'" border>
                                普通註冊
                            </el-radio>
                            <el-radio :value="'phone'" border>
                                手機註冊
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="密碼最小長度">
                        <el-input v-model="form.password_min" placeholder="密碼最小長度" style="width: 30%;" type="number">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="強制密碼複雜度">
                        <el-checkbox-group v-model="form.password_encrypt">
                            <el-checkbox value="0" border>數字</el-checkbox>
                            <el-checkbox value="1" border>小寫字母</el-checkbox>
                            <el-checkbox value="2" border>大寫字母</el-checkbox>
                            <el-checkbox value="3" border>符號</el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="上傳設置" name="second">
                    <el-form-item label="默認上傳方式">
                        <el-radio-group v-model="form.upload_method">
                            <el-radio value="oss" border>
                                對面儲存
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="Bucket">
                        <el-input v-model="form.upload_config.Bucket" placeholder="Bucket" style="width: 30%;">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="ACCESS_KEY">
                        <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" style="width: 30%;">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="SECRET_KEY">
                        <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY" style="width: 30%;">
                        </el-input>
                    </el-form-item>

                    <el-form-item label="空間域名">
                        <el-input v-model="form.upload_config.http" placeholder="空間域名" style="width: 30%;">
                        </el-input>
                        <small class=" text-gray-500 flex pl-1">請補全 http:// 或 https://</small>
                    </el-form-item>
                </el-tab-pane>

                <el-tab-pane label="Api安全" name="third">
                    <el-form-item label="是否開啟API安全">
                        <el-radio-group v-model="form.api_safe">
                            <el-radio :value="0" border>
                                關閉
                            </el-radio>
                            <el-radio :value="1" border>
                                開啟
                            </el-radio>
                        </el-radio-group>
                        <small class=" text-gray-500 flex pl-1">api安全功能開啟之後調用前端api需要傳輸簽名串</small>
                    </el-form-item>
                    <el-form-item label="金鑰">
                        <el-input v-model="form.api_secret" placeholder="空間域名" style="width: 30%;">
                        </el-input>
                        <small class=" text-gray-500 flex pl-1">密鑰設置關係到系統中 API 調用傳輸簽名串的編碼規則，以及會員 token
                            解析，請慎重設置。注意設置之後，會要求對應會員重新登入以取得 token。</small>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
            <el-form-item>
                <el-button type="primary" size="default" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style scoped>
.info {
    padding-top: 20px;
    margin-top: 40px;
}
</style>