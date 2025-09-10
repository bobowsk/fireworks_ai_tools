<template>
    <div class="layout">
        <el-card style="max-width: 480px">
            <div class="chat-history">
                <div v-for="(msg, index) in msgHistory" :key="index" class="message">
                    <div v-if="msg.role === 'assistant'" class="ai-message">
                        <span class="ai-avatar">
                            <img src="https://mintcdn.com/fireworksai-docs/e-Z98cW52qf-SR4q/logo/logo.svg?fit=max&auto=format&n=e-Z98cW52qf-SR4q&q=85&s=b43091616e4831402298f170f209381e" width="20" />
                        </span>
                        <div class="app-loading__loader" v-if="isLoading && msg.role === 'assistant' && msg.content === 'Thinking...'"></div>
                        <span class="ai-content">{{ msg.content }}</span>

                        <!-- <span class="ai-content">{{ msg.content }}</span> -->
                    </div>
                    <div v-else-if="msg.role === 'user'" class="user-message-box">
                        <span>{{ msg.content }}</span>
                        <span class="user-avatar">
                            <img src="data:image/webp;base64,UklGRjgEAABXRUJQVlA4WAoAAAAIAAAATwAATwAAVlA4IFgDAADwGQCdASpQAFAAPo04mkelIyKhLhLuQKARiWwcAA1u+B/APxu7NC+fWvyU/mfvA2r+qffXn84A82Lgn/Bfzz8c/oB/M/4B0gH98/i/+d/om8A/Q39gPeA/jH+N/gHYAf2b+V///2bP7T1gH8A/wH//9Xf9kPgq/bL0nM6L/UCZAeBXv/8YZ3n+iVqxZ6OxkH/tR/YAUkTLqIdb/o0/oh3zOqTmhTo8EkFl0+TUA9DCvuYj14Yexq3KmAu6FR/exjytitlTPgrLpwUFfNvsRpA0Rnk/om7nhAAA/sHSrNpBwIlUzwHNTnwR/h1xjBH+RdCn3XXbJUzOG7YTzvcIbbEsZ8XKcZyqTF/V6TcLJNBTX/bMiSOvaR/5B5Vw6zB5JRoDIOvzM1syceKwA0XTgeNo5PNvv/ISU6FP0kec6s0l3as284qPzKT5ocGoha2yKCICl2nA13GVH/72w3NoGgxw87uVcbm6uhPHyZn9moaLy0f/DHIl5BrIzGHg0vxlYI34F5gCilrH6a50VN88ixcQoAxF7PxOfuID1IWPvDxaPINhfFfyyoUX5qGitqdy8rnQ+oqt8Mcvt9Q7kEVBtf4PJ/gzCmgBNn/s5v+qbjBbvXr7wVoi76Ghd8CYHRtbIywNoBKEAjz2PIz6vPZVJCe/MRE4oNP40X7efl5TXuLs5lTtZZEmXBD8pUTAzKHZYQCaT3XEqVMSDC/nlGoZol2nHeFLSc6MdqCWUCbbIO0ckeyOmQUhzzBVLZzMu4ylv/cLz6FxF5h3Rn8DZD4hBVHEbw/z2vaIs8oOFvzZqV1jDScB/Z0072rwuDspxtMDyvVshNBw3NcPS/EEhzE4q9wRrXvtTqjQGD5F8m6X5ipqYUcm+zCZ5OkVpj5TLSmyso5cwNnUOATDsinNh3+4nb1KJo9dTjcmq+OO+JdCYBhyH9aL59BxyHzQw2rwzkcXOTni48vGqjOUTv6Nh7XKtl+MH7J5HG++OBDfWrAC09EJH0fc5a+GacbKLwjPpeg4pgRVs3lcuT7H305L6WuNVFSWDHCjjgAMTzNvs1llmhcrqpwcHiT3vPTjvInY+QtSHkx7n77j1JA1Hxuot6eoAMYP04MduzMfLlW0eN1FvS9GKTvbI7TDQAAARVhJRroAAABFeGlmAABJSSoACAAAAAYAEgEDAAEAAAABAAAAGgEFAAEAAABWAAAAGwEFAAEAAABeAAAAKAEDAAEAAAACAAAAEwIDAAEAAAABAAAAaYcEAAEAAABmAAAAAAAAAEgAAAABAAAASAAAAAEAAAAGAACQBwAEAAAAMDIxMAGRBwAEAAAAAQIDAACgBwAEAAAAMDEwMAGgAwABAAAA//8AAAKgBAABAAAAUAAAAAOgBAABAAAAUAAAAAAAAAA=" width="20" />
                        </span>
                    </div>
                </div>
            </div>
            <div class="user-input">
                <el-input type="textarea" :rows="4" v-model="userInput" placeholder="Please enter .." class="input" @keydown.alt.enter="sendMessage" />
                <el-button type="primary" @click="sendMessage">Send</el-button>
            </div>
            <div class="tip">alt+enter can quickly submit</div>
            <Footer />
        </el-card>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import Footer from '@/components/footer.vue';
    import http from '@/utils/request';
    const isLoading = ref(false);

    const userInput = ref('');
    const sendMsgData = ref([{ role: 'system', content: 'You are a calm, rational, and intellectual adult woman with rich life and work experience.' }]);
    const msgHistory = ref([{ role: 'assistant', content: "Hello! I'm Fireworks AI, and I'm delighted to serve you." }]);

    const sendMessage = () => {
        if (!userInput.value.trim()) return;
        sendMsgData.value.push({ role: 'user', content: userInput.value });
        msgHistory.value.push({ role: 'user', content: userInput.value });
        isLoading.value = true;
        msgHistory.value.push({ role: 'assistant', content: 'Thinking...' });
        http.post('v1/chat/completions', {
            model: 'accounts/fireworks/models/llama-v3p3-70b-instruct',
            messages: sendMsgData.value,
            max_tokens: 300,
        })
            .then((res) => {
                msgHistory.value.pop();
                isLoading.value = false;
                const newMessage = {
                    role: res.choices[0].message.role,
                    content: '',
                    isNew: true,
                };
                msgHistory.value.push(newMessage);

                let i = 0;
                const typingInterval = setInterval(() => {
                    if (i < res.choices[0].message.content.length) {
                        newMessage.content += res.choices[0].message.content.charAt(i);
                        i++;
                        msgHistory.value = [...msgHistory.value];
                    } else {
                        clearInterval(typingInterval);
                        newMessage.isNew = false;
                    }
                }, 50);
            })
            .catch((e) => {
                msgHistory.value.pop();
                isLoading.value = false;
            });
        userInput.value = '';
    };

    watch(
        () => msgHistory.value,
        () => {
            nextTick(scrollToBottom);
        },
        { deep: true }
    );

    const scrollToBottom = () => {
        const container = document.querySelector('.chat-history');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    };
</script>

<style scoped lang="scss">
    .layout {
        width: 480px;
        margin: 0 auto;
        .chat-history {
            height: calc(100vh - 240px);
            overflow-y: auto;
            .message {
                margin: 10px 0px;
            }
            .ai-message {
                width: 80%;
                display: flex;
                justify-self: flex-start;
                padding: 10px;
                border-radius: 8px;
                text-align: left;
                line-height: 22px;
                word-break: break-word;
                .ai-avatar {
                    padding-right: 10px;
                }
                .app-loading__loader {
                    box-sizing: border-box;
                    width: 16px;
                    height: 16px;
                    border: 5px solid transparent;
                    border-top-color: #000;
                    border-radius: 50%;
                    animation: 0.5s loader linear infinite;
                    top: 2px;
                    position: relative;
                }

                .app-loading__loader:before {
                    box-sizing: border-box;
                    content: '';
                    display: block;
                    width: inherit;
                    height: inherit;
                    position: absolute;
                    top: -5px;
                    left: -5px;
                    border: 5px solid #ccc;
                    border-radius: 50%;
                    opacity: 0.5;
                }
                .app-loading {
                    background: #222225;
                }
                @keyframes loader {
                    0% {
                        transform: rotate(0deg);
                    }

                    100% {
                        transform: rotate(360deg);
                    }
                }
                .ai-content {
                    padding-left: 5px;
                }
                .ai-content.typing-effect {
                    border-right: 2px solid #333; // 光标效果
                    animation: blink-caret 0.75s step-end infinite;
                }

                @keyframes blink-caret {
                    from,
                    to {
                        border-color: transparent;
                    }
                    50% {
                        border-color: #333;
                    }
                }
            }
            .user-message-box {
                max-width: 80%;
                display: flex;
                justify-self: flex-end;
                background: var(--el-color-primary-light-9);
                padding: 10px;
                border-radius: 8px;
                text-align: left;
                line-height: 22px;
                word-break: break-word;
                .user-avatar {
                    padding-left: 10px;
                }
            }
        }
        .user-input {
            height: 100px;
            margin-top: 20px;
            display: flex;
            gap: 10px;
            width: 100%;
        }
        .tip {
            color: #a8abb2;
        }
    }
</style>
