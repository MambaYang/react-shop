import React, { Component } from "react"
import { PAGE_SIZE } from "../../config"
// 请求api
import {
    reqCategoryList,
    reqAddCategory,
    reqUpdateCategory,
} from "../../api/index"

import { Button, Card, message, Table, Modal, Form, Input } from "antd"
import { PlusSquareOutlined } from "@ant-design/icons"
import { connect } from "react-redux"
import { saveCategory } from "../../redux/action_creators/category_action"
const { Item } = Form

@connect((state) => ({}), { saveCategory: saveCategory })
class Category extends Component {
    state = {
        categoryList: [], //商品分类列表
        isModalVisible: false, //添加窗口开关
        operType: "", //窗口标题名
        isLoading: true,
        modalCurrentId: "",
    }
    formRef = React.createRef()
    componentDidMount() {
        // 请求商品分类列表
        this.getCategoryList()
    }

    // 获取商品分类列表
    getCategoryList = async () => {
        let res = await reqCategoryList()
        this.setState({ isLoading: false })
        const { status, data, msg } = res
        if (status === 0) {
            this.setState({ categoryList: data.reverse() })
            // 把商品的分类信息放入redux
            this.props.saveCategory(data)
        } else {
            message.error(msg, 1)
        }
    }

    showModal = (type, record) => {
        this.setState({
            isModalVisible: true,
            operType: type,
        })
        if (type === "修改") {
            this.setState({ modalCurrentId: record._id })
            setTimeout(() => {
                this.formRef.current.setFieldsValue({
                    categoryName: record.name,
                })
            }, 1)
        }
    }

    toAdd = async (values) => {
        let res = await reqAddCategory(values)
        const { status, data, msg } = res
        if (!status) {
            message.success("新增商品分类成功")
            let categoryList = [...this.state.categoryList]
            categoryList.unshift(data)
            this.setState({ categoryList })
            this.setState({ isModalVisible: false })
            this.formRef.current.resetFields()
        }
        if (status) message.error(msg, 1)
    }
    toUpdate = async (categoryObj) => {
        let res = await reqUpdateCategory(categoryObj)
        if (res.status === 0) {
            message.success("更新分类名称成功！", 1)
            this.getCategoryList()
            this.setState({ isModalVisible: false })
            this.formRef.current.resetFields()
        } else {
        }
    }
    handleOk = () => {
        this.formRef.current
            .validateFields()
            .then(async (values) => {
                if (this.state.operType === "添加") {
                    this.toAdd(values)
                }
                if (this.state.operType === "修改") {
                    const categoryId = this.state.modalCurrentId
                    const categoryName = values.categoryName
                    const categoryObj = { categoryId, categoryName }
                    this.toUpdate(categoryObj)
                }
            })
            .catch((errorInfo) => {
                message.warning("表单输入有误，请检查", 1)
            })
    }

    handleCancel = () => {
        this.setState({ isModalVisible: false })
        this.formRef.current.resetFields()
    }

    render() {
        const dataSource = this.state.categoryList
        let { operType, isLoading } = this.state
        const columns = [
            {
                title: "分类名",
                dataIndex: "name",
                key: "name",
            },
            {
                title: "操作",
                dataIndex: "name",
                render: (_, record) => {
                    return (
                        <Button
                            type="link"
                            onClick={() => {
                                this.showModal("修改", record)
                            }}
                        >
                            修改分类
                        </Button>
                    )
                },
                key: "name",
                width: "25%",
                align: "center",
            },
        ]
        return (
            <div>
                <Card
                    title=""
                    extra={
                        <Button
                            type="primary"
                            onClick={() => {
                                this.showModal("添加")
                            }}
                        >
                            <PlusSquareOutlined />
                            添加分类
                        </Button>
                    }
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        rowKey="_id"
                        bordered
                        pagination={{
                            pageSize: PAGE_SIZE,
                            showQuickJumper: true,
                        }}
                        loading={isLoading}
                    />
                </Card>
                <Modal
                    title={operType + "分类"}
                    visible={this.state.isModalVisible}
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    okText="确定"
                    cancelText="取消"
                >
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={this.onFinish}
                        ref={this.formRef}
                    >
                        <Item
                            name="categoryName"
                            rules={[
                                {
                                    required: true,
                                    message: `请输入要${operType}的分类名`,
                                },
                            ]}
                        >
                            <Input
                                // prefix={
                                //     // <UserOutlined className="site-form-item-icon" />
                                // }
                                placeholder={
                                    operType === "添加"
                                        ? "请输入要添加的分类名..."
                                        : "123"
                                }
                            />
                        </Item>
                    </Form>
                </Modal>
            </div>
        )
    }
}

export default Category
