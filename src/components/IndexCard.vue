<script setup>

defineProps({
    title:String,
    tip:String,
    btns:Array
})
</script>

<template>
    <el-card shadow="never">
        <template #header>
            <div class="d-flex">
                <span>{{ title }}</span>
                <el-tag type="danger" effect="plain">
                    {{ tip }}
                </el-tag>
            </div>
        </template>
        <el-row :gutter="20">
            <el-col :span="6" :offset="0" v-for="(item,index) of btns" :key="index">
                <el-card shadow="hover">
                    <div class="card-flex">
                        <span class="number_text">{{ item.value }}</span>
                        <span class="label_text">{{ item.label }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
        
    </el-card>


</template>

<style scoped>
.d-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.card-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
}

.number_text{
    font-size: 25px;
    font-weight: bold;
    color:#ff0000;
}

.label_text{
    font-size: 16px;
    color: #000000;
}

</style>