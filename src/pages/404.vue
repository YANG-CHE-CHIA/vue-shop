<template> 
    <el-col :lg="24" >
        <el-result icon="warning" title="Not Found" sub-title="您找尋的頁面不存在">
            <template #extra>
                <el-button type="primary" @click="$router.push('/')">回到首頁</el-button>
            </template>
        </el-result>
    </el-col>
</template>