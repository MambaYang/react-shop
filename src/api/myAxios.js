import axios from "axios"
import qs from "query-string"
import { message } from "antd"
import Nprogress from "nprogress"
import "nprogress/nprogress.css"
import store from "../redux/store"
import { deleteUserInfo } from "../redux/action_creators/login_action"

const instance = axios.create({
    // timeout: 2000,
})

// 添加请求拦截器
instance.interceptors.request.use(
    (config) => {
        Nprogress.start()
        // 从redux中获取保存的token
        const { token } = store.getState().userInfo
        // 向请求头添加token 用于校验身份
        if (token) config.headers.Authorization = token
        // 获取请求类型和数据
        const { method, data } = config
        // 若是post请求
        if (method.toLocaleLowerCase() === "post") {
            // 若是对象类型转换成字符串
            if (data instanceof Object) {
                config.data = qs.stringify(data)
            }
        }
        return config
    }
    // function (error) {
    //     // Do something with request error
    //     return Promise.reject(error)
    // }
)

// 添加响应拦截器
instance.interceptors.response.use(
    // 请求成功
    (response) => {
        Nprogress.done()
        return response.data
    },
    // 请求失败
    (error) => {
        Nprogress.done()
        if (error.response.status === 401) {
            message.error("身份校验失败，请重新登录", 1)
            // 分发一个删除用户信息
            store.dispatch(deleteUserInfo())
        } else {
            message.error(error.message, 1)
        }

        return new Promise(() => {})
    }
)

export default instance
