import React, { Component, Fragment } from "react"
import { Button, Card, Form, Input, Modal, Table, message, Tree } from "antd"
import { PlusCircleOutlined } from "@ant-design/icons"
import { reqRoleList, reqAddRole, reqAuthRole } from "../../api"
import dayjs from "dayjs"
import menuList from "../../config/menu_config"
import { connect } from "react-redux"

/**
 * 角色管理路由组件
 */
@connect((state) => ({ username: state.userInfo.user.username }), {})
class Role extends Component {
    addFormRef = React.createRef()

    authFormRef = React.createRef()

    state = {
        isShowAdd: false, //是否显示新增权限模态框
        isShowAuth: false, //是否显示分配权限模态框

        roleList: [],
        checkedKeys: [],
        menuList: [],
        _id: "", // 当前操作的角色id
    }

    componentDidMount = async () => {
        this.getRoleList()
        /* 
            重做菜单数组
        */
        let newMenuList = [
            { title: "所有功能", key: "top", children: menuList },
        ]
        this.setState({ menuList: newMenuList })
    }

    // 获取所有角色列表
    getRoleList = async () => {
        let res = await reqRoleList()
        const { status, data, msg } = res
        if (status === 0) this.setState({ roleList: data })
        else message.error(msg)
    }
    // 点击授权的回调
    showAuth = (id) => {
        const { roleList } = this.state
        let result = roleList.find((item) => {
            return item._id === id
        })
        if (result) this.setState({ checkedKeys: result.menus })
        this.setState({ isShowAuth: true, _id: id })
    }
    //新增角色确认模态框
    handleOk = async () => {
        this.addFormRef.current
            .validateFields()
            .then(async (values) => {
                let res = await reqAddRole(values)
                const { status, msg } = res
                if (status === 0) {
                    message.success("添加角色成功")
                    this.getRoleList()
                    this.setState({ isShowAdd: false })
                    this.addFormRef.current.resetFields()
                } else message.error(msg)
            })
            .catch((errorInfo) => {
                message.warning(errorInfo, 1)
            })
    }

    //取消新增角色模态框
    handleAddCancel = () => {
        //重置表单
        this.addFormRef.current.resetFields()
        //取消模态框
        this.setState({ isShowAdd: false })
    }

    //分配权限确认模态框
    handleAuthOk = async () => {
        const { _id, checkedKeys } = this.state
        const { username } = this.props
        let res = await reqAuthRole({
            _id,
            menus: checkedKeys,
            auth_name: username,
            auth_time: Date.now(),
        })
        const { status, msg } = res
        if (status === 0) {
            message.success("授权成功", 1)
            this.setState({ isShowAuth: false })
            this.getRoleList()
        } else message.error(msg, 1)
    }

    //分配权限取消模态框
    handleAuthCancel = () => {
        //重置表单
        this.authFormRef.current.resetFields()
        //取消模态框
        this.setState({ isShowAuth: false })
    }
    // ----------------------tree---------start-----------------------------------

    onCheck = (checkedKeys) => {
        this.setState({ checkedKeys })
    }

    // -----------------------tree----------end----------------------------------------
    render() {
        const { isShowAdd, roleList, isShowAuth, checkedKeys, menuList } =
            this.state
        const dataSource = roleList
        const columns = [
            {
                title: "角色名称",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "创建时间",
                dataIndex: "create_time",
                key: "create_time",
                render: (time) => dayjs(time).format("YYYY-MM-DD HH:mm:ss"),
            },
            {
                title: "授权时间",
                dataIndex: "auth_time",
                key: "auth_time",
                render: (time) =>
                    time ? dayjs(time).format("YYYY-MM-DD HH:mm:ss") : "",
            },
            {
                title: "授权人",
                dataIndex: "auth_name",
                key: "auth_name",
            },
            {
                title: "操作",
                key: "operator",
                render: (item) => (
                    <Button
                        type="link"
                        onClick={() => {
                            this.showAuth(item._id)
                        }}
                    >
                        分配权限
                    </Button>
                ),
                width: "25%",
                align: "center",
            },
        ]
        const treeData = menuList

        return (
            <Fragment>
                <Card
                    title={
                        <Button
                            type="primary"
                            icon={<PlusCircleOutlined />}
                            onClick={() => {
                                this.setState({ isShowAdd: true })
                            }}
                        >
                            添加角色
                        </Button>
                    }
                >
                    <Table
                        bordered={true}
                        rowKey={"_id"}
                        dataSource={dataSource}
                        columns={columns}
                        pagination={{
                            showQuickJumper: true,
                        }}
                        onChange={this.handleTableChange}
                    />
                </Card>
                {/* 添加角色模态框 */}
                <Modal
                    title={`添加角色`}
                    visible={isShowAdd}
                    onOk={this.handleOk}
                    onCancel={this.handleAddCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form ref={this.addFormRef}>
                        <Form.Item
                            name="roleName"
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入角色名称",
                                },
                            ]}
                        >
                            <Input
                                placeholder="请输入角色名称"
                                autoComplete="off"
                            />
                        </Form.Item>
                    </Form>
                </Modal>
                {/* 分配角色模态框 */}
                <Modal
                    title={`分配权限`}
                    visible={isShowAuth}
                    onOk={this.handleAuthOk}
                    onCancel={this.handleAuthCancel}
                    okText="确认"
                    cancelText="取消"
                >
                    <Form ref={this.authFormRef}>
                        <Tree
                            checkable
                            onCheck={this.onCheck}
                            checkedKeys={checkedKeys}
                            treeData={treeData}
                            defaultExpandAll //展开所有菜单
                        />
                    </Form>
                </Modal>
            </Fragment>
        )
    }
}
export default Role
