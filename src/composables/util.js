import { ElNotification, ElMessageBox } from 'element-plus'
import nprogress from 'nprogress'


// 消息提示
export function toast(message, type, dangerouslyUseHTMLString = true) {
  ElNotification({
    message,
    type,
    dangerouslyUseHTMLString,
    duration: 2000
  })
}


export function showModal(content, type, title) {
  return ElMessageBox.confirm(
    content,
    title,
    {
      confirmButtonText: '確定',
      cancelButtonText: '取消',
      type: type,
    }
  )
}

//顯示Loading
export function showFullLoading() {
  nprogress.start()
}

//關閉Loading
export function hideFullLoading() {
  nprogress.done()
}

//彈出輸入框
export function showPrompt(tip,value = '') {
  return ElMessageBox.prompt(tip, '', {
    confirmButtonText: '確認',
    cancelButtonText: '取消',
    inputValue:value
  })
}