import React, { Component } from "react"
import { Route, Switch, Redirect } from "react-router-dom"
import Admin from "./containers/admin"
import Login from "./containers/login"

// 引入样式
import "./App.less"

export default class App extends Component {
    render() {
        return (
            <div className="app">
                <Switch>
                    <Route path="/login" component={Login}></Route>
                    <Route path="/admin" component={Admin}></Route>
                    <Redirect to="/admin"></Redirect>
                </Switch>
            </div>
        )
    }
}
