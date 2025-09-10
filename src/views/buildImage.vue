<template>
    <div class="layout">
        <el-card style="max-width: 480px">
            <div class="image-container">
                <div class="image-preview">
                    <img v-if="imageUrl" :src="imageUrl" width="480px" alt="Generated Image" />
                    <div v-else class="placeholder">The image will be displayed here.</div>
                </div>
                <div class="params-config">
                    <el-form label-width="120px" :model="sendData">
                        <el-form-item label="Prompt">
                            <el-input v-model="sendData.prompt" type="textarea" :rows="4" placeholder="Prompt to use for the image generation process." />
                        </el-form-item>
                        <el-form-item label="aspect_ratio">
                            <el-radio-group v-model="sendData.aspect_ratio">
                                <el-radio :value="item" size="large" v-for="item in aspectRatio" :key="item">{{ item }}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="generateImage" :loading="isLoading">generate image</el-button>
                            <el-button v-if="imageBlob" type="primary" @click="downloadImg">download image</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <Footer />
        </el-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import http from '@/utils/request';
    import Footer from '@/components/footer.vue';
    const imageUrl = ref('');

    const imageBlob = ref(null);
    const isLoading = ref(false);
    const sendData = reactive({
        prompt: '',
        aspect_ratio: '1:1',
        guidance_scale: 3.5,
        num_inference_steps: 4,
        seed: 0,
    });

    const aspectRatio = reactive(['1:1', '21:9', '16:9', '3:2', '5:4', '4:5', '2:3', '9:16', '9:21', '4:3', '3:4']);
    const downloadImg = () => {
        if (!imageBlob.value) return;

        const url = URL.createObjectURL(imageBlob.value);
        const link = document.createElement('a');
        link.href = url;
        link.download = generateRandomFileName() + '.jpg';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 100);
    };
    function generateRandomFileName() {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        return array[0].toString(36);
    }

    const generateImage = () => {
        if (sendData.prompt.trim() === '') {
            ElNotification({
                title: 'Error',
                message: 'Prompt cannot be empty.',
                type: 'error',
            });
            return;
        }
        isLoading.value = true;
        http.post('/v1/workflows/accounts/fireworks/models/flux-1-schnell-fp8/text_to_image', sendData, {
            headers: {
                Accept: 'image/jpeg',
            },
            responseType: 'blob',
        })
            .then(async (res) => {
                isLoading.value = false;
                const blob = new Blob([res], { type: 'image/jpeg' });
                imageUrl.value = URL.createObjectURL(blob);
                imageBlob.value = blob;
            })
            .catch((e) => {
                isLoading.value = false;
                console.log(e);
            });
    };
</script>

<style scoped lang="scss">
    .layout {
        width: 480px;
        margin: 0 auto;
        .image-container {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 120px);
        }
        .image-preview {
            flex: 1;
            display: flex;
            justify-content: center;
            align-items: center;
            background: #f5f5f5;
            margin-bottom: 20px;
            height: 400px;
        }
        .image-preview img {
            max-width: 100%;
            max-height: 100%;
        }
        .placeholder {
            color: #999;
        }
        .params-config {
            padding: 20px;
        }
    }
</style>
