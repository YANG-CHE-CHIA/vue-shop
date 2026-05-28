import { ElNotification, ElMessageBox } from 'element-plus'


// 消息提示
export function toast(message, type, dangerouslyUseHTMLString = false) {
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