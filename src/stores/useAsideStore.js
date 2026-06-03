import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useAsideStore = defineStore('aside', () => {
    const asideWidth = ref('250px')

    const AsideWidthHandler = () => {
        asideWidth.value = asideWidth.value === '250px' ? '64px' : '250px'
    }

    return { asideWidth, AsideWidthHandler }
})