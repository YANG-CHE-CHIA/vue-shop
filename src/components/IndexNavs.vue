<script setup>
const iconNavs =
    [
        {
            icon: "user",
            color: "!text-blue-500",
            title: "用戶",
            path: "/user/list"
        },
        {
            icon: "shopping-cart",
            color: "!text-violet-500",
            title: "商品",
            path: "/goods/list"
        },
        {
            icon: "tickets",
            color: "!text-fuchsia-500",
            title: "訂單",
            path: "/order/list"
        },
        {
            icon: "chat-dot-square",
            color: "!text-teal-500",
            title: "評價",
            path: "/comment/list"
        },
        {
            icon: "picture",
            color: "!text-rose-500",
            title: "圖庫",
            path: "/image/list"
        },
        {
            icon: "bell",
            color: "!text-green-500",
            title: "公告",
            path: "/notice/list"
        },
        {
            icon: "set-up",
            color: "!text-gray-500",
            title: "配置",
            path: "/setting/base"
        },
        {
            icon: "files",
            color: "!text-yellow-500",
            title: "優惠券",
            path: "/coupon/list"
        }
    ]
</script>

<template>
    <div class="index_navs">
        <el-row :gutter="20">
            <el-col :span="3" :offset="0" v-for="(item,index) of iconNavs" :key="index">
                <el-card shadow="hover" @click="$router.push(item.path)">
                    <div class="d-flex">
                        <el-icon size="20" :class="item.color">
                            <component :is="item.icon" />
                        </el-icon>
                        <span class="text">{{ item.title }}</span>
                    </div>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>

<style scoped>
.index_navs {
    margin: 20px 0;
}

.d-flex {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
}

.text {
    margin-top: 10px;
}
</style>