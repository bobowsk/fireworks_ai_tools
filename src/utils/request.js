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
                    title: 'Request error',
                    message: 'Status: 404, requesting a server record that does not exist！',
                });
            } else if (error.response.status == 500) {
                ElNotification.error({
                    title: 'Request error',
                    message: error.response.data.message || 'Status: 500, server error occurred！',
                });
            } else {
                ElNotification.error({
                    title: 'Request error',
                    message: error.response.data.message || `Status:${error.response.status}，Unknown error！`,
                });
            }
        } else {
            ElNotification.error({
                title: 'Request error',
                message: 'The server is not responding to the request!',
            });
        }
        return Promise.reject(error.response);
    }
);

var http = {
    /** get
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

    /** post
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
