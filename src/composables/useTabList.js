import { ref } from 'vue'
import { useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useCookies } from '@vueuse/integrations/useCookies'
import { router } from '@/router'

export function useTabList() {
    const route = useRoute()
    const cookie = useCookies()

    const activeTab = ref(route.path)
    const tabList = ref([
        {
            title: '後台首頁',
            path: '/'
        },
    ])

    //新增標籤
    const addTab = (tab) => {
        let noTab = tabList.value.findIndex(t => t.path == tab.path) == -1

        if (noTab) {
            tabList.value.push(tab)
        }

        cookie.set('tabList', tabList.value)
    }

    //初始化標籤列表
    const initTabList = () => {
        let cookieTabList = cookie.get('tabList')

        if (cookieTabList) {
            tabList.value = cookieTabList
        }
    }

    initTabList()

    onBeforeRouteUpdate((to, from) => {
        activeTab.value = to.path
        addTab({
            title: to.meta.title,
            path: to.path
        })
    })

    const changeTabHandler = (t) => {
        activeTab.value = t
        router.push(t)
    }

    //關閉標籤
    const removeTab = (t) => {
        let tabs = tabList.value
        let Tab = activeTab.value
        if (Tab == t) {
            tabs.forEach((tab, index) => {
                if (tab.path == t) {
                    let nextTab = tabs[index + 1] || tabs[index - 1]

                    if (nextTab) {
                        Tab = nextTab.path
                    }
                }
            })
        }

        activeTab.value = Tab
        tabList.value = tabList.value.filter(tab => tab.path != t)

        cookie.set('tabList', tabList.value)
    }

    const CloseHandler = (e) => {
        if (e == "clearAll") {
            //切換回首頁
            activeTab.value = '/'
            //只剩下首頁
            tabList.value =
                [
                    {
                        title: '後台首頁',
                        path: '/'
                    }
                ]
        }
        else if (e == "clearOther") {
            tabList.value = tabList.value.filter(tab => tab.path == activeTab.value || tab.path == '/')
        }

        cookie.set('tabList', tabList.value)
    }

    return { activeTab, tabList, changeTabHandler, removeTab, CloseHandler}
}