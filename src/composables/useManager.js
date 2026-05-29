import { ref, reactive } from 'vue'
import { updatepassword } from '@/api/manager'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/useUserStore'
import { toast, showModal } from '@/composables/util'


//修改密碼
export function useRepassword() {
    const formDrawerRef = ref(null)
    const formRef = ref(null)

    const router = useRouter()
    const userStore = useUserStore()

    const formData = reactive({
        oldpassword: '',
        password: '',
        repassword: ''
    })

    //規則
    const rules = {
        oldpassword: [
            { required: true, message: '請輸入舊密碼', trigger: 'blur' }
        ],
        password: [
            { required: true, message: '請輸入新密碼', trigger: 'blur' }
        ],
        repassword: [
            { required: true, message: '請確認新密碼', trigger: 'blur' }
        ]
    }

    const openRepasswordFrom = () => formDrawerRef.value.open()

    const SubmitHandler = () => {
        formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    formDrawerRef.value.showLoading()
                    await updatepassword(formData)

                    toast('修改成功,請重新登入', 'success');

                    await userStore.logoutInfo()

                    //跳轉到登入頁
                    router.push('/login')
                }
                catch (error) {
                    //console.error(error)
                }
                finally {
                    formDrawerRef.value.hideLoading()
                }
            }
            else {
                return false
            }
        })
    }

    return { formDrawerRef, formData, formRef, rules, SubmitHandler, openRepasswordFrom }
}


//登出
export function useLogout() {
    const router = useRouter()
    const userStore = useUserStore()
    
    const logoutHandler = async () => {
        try {
            await showModal('是否要登出', 'warning', '')

            await userStore.logoutInfo()

        } catch (error) {
            return
        }

        router.push('/login')
        toast('帳號已登出', 'success')
    }

    return { logoutHandler }
}