import React, { Component } from "react"
import { Redirect, Route, Switch } from "react-router-dom"
import { connect } from "react-redux"
// import { deleteUserInfo } from "../../redux/action_creators/login_action"

import { Layout } from "antd"
import Header from "./header"
import "./css/admin.less"
// 引入组件
import Home from "../../components/Home"
import Nav from "./Nav"
import Category from "../category"
import Product from "../Product"
import Detail from "../Product/detail"
import AddUpdate from "../Product/add_update"
import User from "../User"
import Role from "../Role"
import Bar from "../Bar"
import Line from "../Line"
import Pie from "../Pie"

const { Footer, Sider, Content } = Layout

@connect((state) => ({ userInfo: state.userInfo }), {})
class Admin extends Component {
    componentDidMount() {
        // console.log("@admin", this.props)
    }

    render() {
        const { isLogin } = this.props.userInfo
        // console.log(this.props)
        if (!isLogin) {
            return <Redirect to="/login" />
        }

        return (
            <Layout className="admin">
                <Sider className="sider">
                    <Nav />
                </Sider>
                <Layout>
                    <Header></Header>
                    <Content className="content">
                        <Switch>
                            <Route path="/admin/home" component={Home}></Route>
                            <Route
                                path="/admin/prod_about/category"
                                component={Category}
                            ></Route>
                            <Route
                                path="/admin/prod_about/product"
                                component={Product}
                                exact
                            ></Route>
                            <Route
                                path="/admin/prod_about/product/detail/:id"
                                component={Detail}
                            ></Route>
                            <Route
                                path="/admin/prod_about/product/add_update/:id"
                                component={AddUpdate}
                            ></Route>
                            <Route
                                path="/admin/prod_about/product/add_update"
                                component={AddUpdate}
                            ></Route>
                            <Route path="/admin/user" component={User}></Route>
                            <Route path="/admin/role" component={Role}></Route>
                            <Route
                                path="/admin/charts/bar"
                                component={Bar}
                            ></Route>
                            <Route
                                path="/admin/charts/line"
                                component={Line}
                            ></Route>
                            <Route
                                path="/admin/charts/pie"
                                component={Pie}
                            ></Route>
                            <Redirect to="/admin/home" />
                        </Switch>
                    </Content>
                    <Footer className="footer">
                        推荐使用谷歌浏览器，获取最佳用户体验
                    </Footer>
                </Layout>
            </Layout>
        )
    }
}

export default Admin
