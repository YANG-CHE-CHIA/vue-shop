import { reactive, ref, computed } from 'vue'
import { toast } from '@/composables/util.js'

// 封裝列表,分頁,搜尋,刪除,修改狀態
export function useInitTable(opt = {}) {
    const tableData = ref([])
    const loading = ref(false)

    //分頁
    const currentPage = ref(1)
    const total = ref(0)
    const limit = ref(10)

    //搜尋
    let searchForm = null
    let resetSearchFrom = null

    if (opt.searchForm) {
        searchForm = reactive({ ...opt.searchForm })
        resetSearchFrom = () => {
            for (const key in opt.searchForm) {
                searchForm[key] = opt.searchForm[key]
            }
            getData()
        }
    }

    //讀取資料
    const getData = async (p = null) => {
        try {
            if (typeof p == "number") {
                currentPage.value = p
            }

            loading.value = true
            const res = await opt.getList(currentPage.value, searchForm);

            if (res) {
                if (opt.onGetListSuccess && typeof opt.onGetListSuccess == 'function') {
                    opt.onGetListSuccess(res)
                }
                else {
                    tableData.value = res.list
                    total.value = res.totalCount
                }
            }

        } catch (error) {
            console.error('讀取資料時發生錯誤:', error);
        } finally {
            loading.value = false
        }
    }

    getData()

    //刪除
    const DeleteHanlder = async (id) => {
        try {
            loading.value = true
            await opt.delete(id)
            toast('刪除成功', 'success')
            getData()
        }
        catch (error) {
            console.error(error)
        }
        finally {
            loading.value = false
        }
    }

    //修改狀態
    const StatusChangeHandler = async (status, item) => {
        item.statusLoading = true
        try {
            await opt.updateStatus(item.id, status)
            toast('修改狀態成功', 'success')
            item.status = status
        }
        catch (error) {
            console.error(error)
        }
        finally {
            item.statusLoading = false
        }
    }


    return { searchForm, resetSearchFrom, tableData, loading, currentPage, total, limit, getData, DeleteHanlder, StatusChangeHandler }
}

// 封裝新增,修改
export function useInitForm(opt = {}) {
    //表單
    const formDrawerRef = ref(null)
    const formRef = ref(null)
    const defaultForm = opt.form
    const rules = opt.rules || {}
    const editId = ref(0)
    const drawerTitle = computed(() => editId.value ? "修改" : "新增")
    const form = reactive({})

    //表單送出
    const SubmitHandler = () => {
        formRef.value.validate(async (valid) => {
            if (valid) {
                try {
                    formDrawerRef.value.showLoading()
                    const res = editId.value ? await opt.update(editId.value, form) : await opt.create(form)
                    if (res) {
                        toast(drawerTitle.value + '成功', 'success')
                        opt.getData(editId.value ? false : 1)
                        formDrawerRef.value.close()
                    }
                }
                catch (error) {
                    console.error('資料發生錯誤:', error);
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

    //表單重置
    const resetForm = (item = false) => {
        if (formRef.value) formRef.value.clearValidate()
        if (item) {
            for (const key in defaultForm) {
                form[key] = item[key]
            }
        }
    }

    //新增
    const CreateHandler = () => {
        editId.value = 0
        resetForm(defaultForm)
        formDrawerRef.value.open()
    }

    //修改
    const UpdateHanlder = (item) => {
        editId.value = item.id
        resetForm(item)
        formDrawerRef.value.open()
    }

    return { formDrawerRef, formRef, form, rules, editId, drawerTitle, SubmitHandler, CreateHandler, UpdateHanlder }

}
