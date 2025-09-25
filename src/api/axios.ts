import axios from 'axios'
import { MD5 } from 'crypto-js'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'

axios.defaults.timeout = 60000 // 设置超时时间
axios.defaults.baseURL = import.meta.env.VITE_APP_BASE_API // 设置请求地址
axios.defaults.headers.common['Content-Type'] = 'application/json;charset=UTF-8' // 设置传参方式（JSON）

// 请求拦截器
axios.interceptors.request.use(
    (config) => {
        if (config && config.url) {
            const timestamp = Math.floor(Date.now() / 1000) // 获取当前unix时间戳，精确到秒
            const nonceStr = MD5(uuidv4()).toString() // 生成32位随机码
            // 设置加密请求头
            config.headers['X-T1Y-Application-ID'] =
                import.meta.env.VITE_APP_APP_ID
            config.headers['X-T1Y-Api-Key'] = import.meta.env.VITE_APP_API_KEY
            config.headers['X-T1Y-Safe-NonceStr'] = nonceStr
            config.headers['X-T1Y-Safe-Timestamp'] = timestamp
            config.headers['X-T1Y-Safe-Sign'] = MD5(
                new URL(
                    import.meta.env.VITE_APP_T1_CLOUD_SERVICE_DOMAIN +
                        config.url,
                ).pathname +
                    import.meta.env.VITE_APP_APP_ID +
                    import.meta.env.VITE_APP_API_KEY +
                    nonceStr +
                    timestamp +
                    import.meta.env.VITE_APP_SECRET_KEY,
            ).toString()
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    },
)

// 响应拦截器
axios.interceptors.response.use(
    // TODO: 客户端防篡改验证（可选），与发送一样获取请求头加密格式进行校验
    (response) => {
        // 成功
        return response.data
    },
    (error) => {
        const { response } = error
        if (response) {
            // 请求已发出，但是不在2xx的范围内（失败）
            ElMessage.warning(response.data.message)
        } else {
            ElMessage.error('网络连接异常，请稍后再试！')
        }
        return Promise.reject(error)
    },
)

// 封装请求并导出
export function request(url = '', params = {}, method = 'post') {
    // 设置 url params type 的默认值
    return new Promise((resolve, reject) => {
        const config = {
            url,
            method: method,
            data: method === 'get' ? undefined : params,
            params: method === 'get' ? params : undefined,
        }
        axios(config)
            .then((res) => {
                resolve(res)
            })
            .catch((err) => {
                reject(err)
            })
    })
}
