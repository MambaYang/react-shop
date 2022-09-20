import React, { Component } from "react"
import { Link, withRouter } from "react-router-dom"
import menuList from "../../../config/menu_config"
import { connect } from "react-redux"
import { saveTitle } from "../../../redux/action_creators/menu_action"

import logo from "../../../static/images/logo.png"
// 引入 antd组件
import { Menu } from "antd"
import * as Icon from "@ant-design/icons"
import "./nav.less"
const { SubMenu, Item } = Menu
@connect(
    (state) => ({
        menus:
            state.userInfo.user.role === null
                ? []
                : state.userInfo.user.role.menus,
        username: state.userInfo.user.username,
    }),
    {
        saveTitle: saveTitle,
    }
)
@withRouter
class Nav extends Component {
    hasAuth = (item) => {
        const { menus, username } = this.props
        if (username === "admin") return true
        else if (!item.children) {
            return menus.find((item2) => {
                return item2 === item.key
            })
        } else if (item.children) {
            return item.children.some((item3) => {
                return menus.indexOf(item3.key) !== -1
            })
        }
    }
    // 创建菜单
    createMenu = (target) => {
        return target.map((item) => {
            const icon = React.createElement(Icon[item.icon])
            if (this.hasAuth(item)) {
                if (!item.children) {
                    return (
                        <Item
                            key={item.key}
                            icon={icon}
                            onClick={() => {
                                this.props.saveTitle(item.title)
                            }}
                        >
                            <Link to={item.path}>{item.title}</Link>
                        </Item>
                    )
                } else {
                    return (
                        <SubMenu key={item.key} icon={icon} title={item.title}>
                            {this.createMenu(item.children)}
                        </SubMenu>
                    )
                }
            }
            return null
        })
    }

    render() {
        let { pathname } = this.props.location
        return (
            <div>
                <div>
                    <header className="nav-header">
                        <img src={logo} alt="" />
                        <h1>商品管理系统</h1>
                    </header>
                    <Menu
                        defaultSelectedKeys={
                            pathname.indexOf("product") !== -1
                                ? "product"
                                : pathname.split("/").reverse()[0]
                        }
                        defaultOpenKeys={this.props.location.pathname
                            .split("/")
                            .splice(2)}
                        mode="inline"
                        theme="dark"
                    >
                        {this.createMenu(menuList)}
                    </Menu>
                </div>
            </div>
        )
    }
}

export default Nav
