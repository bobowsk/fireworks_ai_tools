<template>
    <el-container>
        <el-container>
            <el-aside width="400px">
                <el-menu router default-active="/chat" class="el-menu-vertical">
                    <el-menu-item index="/chat">
                        <el-icon color="#409efc"><ChatLineRound /></el-icon>
                        <span>chat</span>
                    </el-menu-item>
                    <el-menu-item index="/image">
                        <el-icon color="#409efc"><Picture /></el-icon>
                        <span>text to image</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-main>
                    <router-view />
                </el-main>
                <el-footer>
                    Made by
                    <a href="https://x.com/bobowsk_bobo" target="_blank">bobowsk</a>
                </el-footer>
            </el-container>
        </el-container>
    </el-container>
</template>
<style scoped>
    .el-menu-vertical {
        height: calc(100vh - 20px);
        margin: 10px;
    }
</style>
