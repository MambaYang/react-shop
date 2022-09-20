import React, { Component } from "react"
import screenfull from "screenfull"
import dayjs from "dayjs"
import { withRouter } from "react-router-dom"
import { connect } from "react-redux"
import { deleteUserInfo } from "../../../redux/action_creators/login_action"
import menuList from "../../../config/menu_config"
import "./header.less"
import { Button, Modal } from "antd"
import {
    FullscreenOutlined,
    FullscreenExitOutlined,
    ExclamationCircleOutlined,
} from "@ant-design/icons"
// import { reqList } from "../../../api"
import weather_logo from "../../../static/images/logo.png"

@connect((state) => ({ userInfo: state.userInfo, title: state.title }), {
    deleteUserInfo: deleteUserInfo,
})
@withRouter
class Header extends Component {
    state = {
        isFull: false,
        realTime: dayjs().format("YYYY年MM月DD日HH:mm:ss"),
    }

    // 切换全屏的回调
    fullscreen = () => {
        screenfull.toggle()
    }
    componentDidMount() {
        // 给screenfull绑定监听
        screenfull.on("change", () => {
            let isFull = !this.state.isFull
            this.setState({ isFull })
        })
        setInterval(() => {
            this.setState({
                realTime: dayjs().format("YYYY年MM月DD日HH:mm:ss"),
            })
        })
        this.getTitle()
    }
    componentWillUnmount() {
        this.setState = () => false
    }
    // 点击退出登录
    logOut = () => {
        Modal.confirm({
            title: "确定退出吗？",
            icon: <ExclamationCircleOutlined />,
            content: "若退出需要重新登录哦 ...",
            okText: "确认",
            cancelText: "取消",
            onOk: () => {
                this.props.deleteUserInfo()
            },
        })
    }
    // 获取标题
    getTitle = () => {
        let { pathname } = this.props.location
        let pathKey = pathname.split("/").reverse()[0]
        if (pathname.indexOf("product") !== -1) pathKey = "product"
        let title = ""
        menuList.forEach((item) => {
            if (item.children instanceof Array) {
                let tmp = item.children.find((citem) => {
                    return citem.key === pathKey
                })
                if (tmp) title = tmp.title
            } else {
                if (pathKey === item.key) title = item.title
            }
        })
        this.setState({ title })
    }
    render() {
        let { isFull } = this.state
        let { username } = this.props.userInfo.user
        return (
            <header className="header">
                <div className="header-top">
                    <Button size="small" onClick={this.fullscreen}>
                        {isFull ? (
                            <FullscreenExitOutlined />
                        ) : (
                            <FullscreenOutlined />
                        )}
                    </Button>

                    <span className="username">欢迎，{username}</span>
                    <Button type="link" size="small" onClick={this.logOut}>
                        退出登录
                    </Button>
                </div>
                <div className="header-bottom">
                    {/* 头部下部左侧 */}
                    <div className="header-bottom-left">
                        {this.props.title || this.state.title}
                    </div>
                    {/* 头部下部右侧 */}
                    <div className="header-bottom-right">
                        {this.state.realTime}
                        <img src={weather_logo} alt="天气信息" />晴 温度：2-5
                    </div>
                </div>
            </header>
        )
    }
}

export default Header
