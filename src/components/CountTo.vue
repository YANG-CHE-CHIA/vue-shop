<script setup>
import { reactive, watch } from 'vue'
import gsap from 'gsap'

const schedule = reactive({
    num:0
})

const props = defineProps({
    value:{
        type:Number,
        default:0
    }
})

const AnimateToValue = () =>{
    gsap.to(schedule,{
        duration:0.5,
        num:props.value
    });
}

AnimateToValue()

watch(()=>props.value,()=>AnimateToValue())

</script>

<template>
    {{ schedule.num.toFixed(0) }}
    
</template>