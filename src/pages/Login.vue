<script setup>
    import { ref, onMounted, onBeforeUnmount } from 'vue'
    import { toast } from '@/composables/util'    
    import { useRouter } from 'vue-router'
    import { useUserStore } from '@/stores/useUserStore'
    
    const router = useRouter()
    const userStore = useUserStore()

    const formData = ref({
        username: '',
        password: ''
    })

    const formRef = ref(null)
    const loading = ref(false)

    const rules = {
        username: [
            { required: true, message: '請輸入帳號', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '請輸入密碼', trigger: 'blur' }
        ]
    }

    const SubmitHandler = () => {
        formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    loading.value = true

                    await userStore.loginInfo(formData.value.username, formData.value.password) 
                    //請求成功
                    toast('登入成功', 'success');

                    //跳轉到後台首頁
                    router.push('/')
                } 
                catch (error) {
                    //console.error(error)
                }
                finally {
                    loading.value = false 
                }
            } 
            else {
                return false
            }
        })
    }

    //監聽鍵盤事件
    const onKeyUp = (e) =>{
       if(e.key == "Enter") SubmitHandler()
    }

    onMounted(()=>{
        document.addEventListener('keyup',onKeyUp)
    })

    onBeforeUnmount(() =>{
        document.removeEventListener('keyup',onKeyUp)
    })

</script>

<template>
    <el-row class="min-h-screen">
        <el-col :lg="16" :md="12" class="d-flex bg-indigo-500">
            <div class="login_text">歡迎光臨</div>
            <div class="small_text">此網站是用於《Vue3 + Vite 實戰商城後台開發》作品展示</div>
        </el-col>

        <el-col :lg="8" :md="12" class="d-flex">
            <h2 class="title">歡迎回來</h2>
            <div class="small_title">
                <span>帳號密碼登入</span>
            </div>
            <el-form ref="formRef" :rules="rules" :model="formData" class="login_from">
                <el-form-item prop="username">
                    <el-input v-model="formData.username" placeholder="請輸入帳號">
                        <template #prefix>
                            <el-icon>
                                <User />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input v-model="formData.password" placeholder="請輸入密碼" type="password" show-password>
                        <template #prefix>
                            <el-icon>
                                <Lock />
                            </el-icon>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="from_btn" type="primary" @click="SubmitHandler" :loading="loading">登入</el-button>
                </el-form-item>
            </el-form>
        </el-col>

    </el-row>
</template>

<style>
    .d-flex {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }

    .login_text {
        font-size: 3rem;
        font-weight: bold;
        color: #ffffff;
        margin-bottom: 5px;
    }

    .small_text {
        font-size: 1.2rem;
        text-align: center;
        color: #dddddd;
    }

    .title {
        font-size: 3rem;
        font-weight: bold;
        color: #000000;
        letter-spacing: 0.2rem;
        margin-bottom: 10px;
    }

    .small_title {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 20px;
    }

    .small_title span {
        position: relative;
        font-size: 1rem;
        color: #3c3c3c;
    }

    .small_title span::before,
    .small_title span::after {
        content: '';
        position: absolute;
        top: 50%;
        width: 100%;
        height: 1px;
        background-color: #3c3c3c;
    }

    .small_title span::before {
        left: -110%;
    }

    .small_title span::after {
        right: -110%;
    }

    .login_from {
        width: 50%;
    }

    .from_btn {
        width: 100%;
        border-radius: 50px;
        padding: 10px;
        font-size: 1.2rem;
        letter-spacing: 2px;
        height: 40px;
    }

    @media (max-width: 767px) {
        .small_text {
            font-size: 13px;
        }

        .login_from {
            width: 90%;
        }
    }
</style>