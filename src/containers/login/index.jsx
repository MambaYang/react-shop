import React, { Component } from "react"
import { connect } from "react-redux"
import { Redirect } from "react-router-dom"
import { saveUserInfo } from "../../redux/action_creators/login_action"
import { reqLogin } from "../../api/index"

// antd 组件及样式
import { Form, Input, Button, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import "./css/login.less"
import logo from "../../static/images/logo.png"

const { Item } = Form
class Login extends Component {
    componentDidMount() {}
    // 点击发送的回调函数
    onFinish = async (value) => {
        // 调用请求函数

        const res = await reqLogin(value)
        // 如果status等于1 返回错误
        if (res.status) return message.warn(res.msg)
        // 用户信息保存到redux
        this.props.saveUserInfo(res.data)
        // 跳转
        this.props.history.replace("/admin/home")
    }
    // 验证表单处理函数
    pwdValidator = () => ({
        validator(_, val) {
            // console.log(val)
            if (!val) return Promise.reject(new Error("密码必须输入!"))
            else if (val.length > 12)
                return Promise.reject(new Error("密码必须小于等于12位!"))
            else if (val.length < 4)
                return Promise.reject(new Error("密码必须大于等于4!"))
            else if (!/^\w+$/.test(val))
                return Promise.reject(
                    new Error("密码必须是字母，数字,下划线组成!")
                )
            else return Promise.resolve()
        },
    })

    render() {
        const { isLogin } = this.props
        if (isLogin) {
            return <Redirect to="/admin/home" />
        }
        return (
            <div className="login">
                <header>
                    <img src={logo} alt="" />
                    <h1>商品管理系统</h1>
                </header>
                <section>
                    <h1>用户登录</h1>
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                    >
                        <Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "Please input your Username!",
                                },
                                { min: 5, message: "用户名必须大于5位" },
                                { max: 12, message: "用户名必须小于12位" },
                                {
                                    pattern: /^\w+$/,
                                    message:
                                        "用户名必须是字母，数字,下划线组成",
                                },
                            ]}
                        >
                            <Input
                                prefix={
                                    <UserOutlined className="site-form-item-icon" />
                                }
                                placeholder="Username"
                            />
                        </Item>
                        <Item name="password" rules={[this.pwdValidator]}>
                            <Input
                                prefix={
                                    <LockOutlined className="site-form-item-icon" />
                                }
                                type="password"
                                placeholder="Password"
                            />
                        </Item>

                        <Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                className="login-form-button"
                                block
                            >
                                Log in
                            </Button>
                        </Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default connect((state) => ({ isLogin: state.userInfo.isLogin }), {
    saveUserInfo: saveUserInfo,
})(Login)
