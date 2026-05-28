import { ElNotification } from 'element-plus'


// 消息提示
export function toast(message, type, dangerouslyUseHTMLString = false) {
    ElNotification({
        message,
        type,
        dangerouslyUseHTMLString,
        duration: 2000
    })
}