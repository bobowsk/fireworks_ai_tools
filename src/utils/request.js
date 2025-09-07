import axios from 'axios';
import { ElNotification } from 'element-plus';
axios.defaults.baseURL = import.meta.env.VITE_API_URL;
axios.defaults.timeout = 60000;

axios.interceptors.request.use(
    (config) => {
        config.headers['Authorization'] = `Bearer ${import.meta.env.VITE_API_KEY}`;
        config.headers['Content-Type'] = 'application/json';
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// HTTP response 拦截器
axios.interceptors.response.use(
    (response) => {
        if (response.status == 200) {
            return response;
        }
    },
    (error) => {
        if (error.response) {
            if (error.response.status == 404) {
                ElNotification.error({
                    title: '请求错误',
                    message: 'Status:404，正在请求不存在的服务器记录！',
                });
            } else if (error.response.status == 500) {
                ElNotification.error({
                    title: '请求错误',
                    message: error.response.data.message || 'Status:500，服务器发生错误！',
                });
            } else if (error.response.status == 401) {
                ElMessageBox.confirm('当前用户已被登出或无权限访问当前资源，请尝试重新登录后再操作。', '无权限访问', {
                    type: 'error',
                    closeOnClickModal: false,
                    center: true,
                    confirmButtonText: '重新登录',
                })
                    .then(() => {
                        router.replace({ path: '/login' });
                    })
                    .catch(() => {});
            } else {
                ElNotification.error({
                    title: '请求错误',
                    message: error.response.data.message || `Status:${error.response.status}，未知错误！`,
                });
            }
        } else {
            ElNotification.error({
                title: '请求错误',
                message: '请求服务器无响应！',
            });
        }
        return Promise.reject(error.response);
    }
);

var http = {
    /** get 请求
     * @param  {接口地址} url
     * @param  {请求参数} params
     * @param  {参数} config
     */
    get: function (url, params = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'get',
                url: url,
                params: params,
                ...config,
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    },

    /** post 请求
     * @param  {接口地址} url
     * @param  {请求参数} data
     * @param  {参数} config
     */
    post: function (url, data = {}, config = {}) {
        return new Promise((resolve, reject) => {
            axios({
                method: 'post',
                url: url,
                data: data,
                ...config,
            })
                .then((response) => {
                    resolve(response.data);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                });
        });
    },
};

export default http;
