import { useUserStore } from '@/stores/useUserStore'

const hasPermission = (value,el = false) => {
    if(!Array.isArray(value)){
        throw new Error('需要配置權限')
    }

    const userStore = useUserStore()

    const hasAuth = value.findIndex(v=>userStore.ruleNames.includes(v)) != -1
    if(el && !hasAuth){
        el.parentNode && el.parentNode.removeChild(el)
    }

    return hasAuth
}


export default{
    install(app){
        app.directive("permission",{
            mounted(el,binding) {
                hasPermission(binding.value,el)
            },
        })
    }
}