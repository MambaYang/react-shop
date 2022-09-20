import React, { Component, Fragment } from "react"
import { Button, Card, Form, Input, Select, message } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import { connect } from "react-redux"
import {
    reqCategoryList,
    reqAddProduct,
    reqProdById,
    reqUpdateProduct,
} from "../../api"
import PicturesWall from "./picture_wall"
import RichTextEditor from "./rich_text_editor"

@connect(
    (state) => ({
        categoryList: state.categoryList,
        productList: state.productList,
    }),
    {}
)
class Addupdate extends Component {
    state = {
        categoryList: [],
        operaType: "add",
        productList: [],
        categoryId: "",
        name: "",
        desc: "",
        price: "",
        detail: "",
        imgs: [],
        _id: "",
    }
    picturesWall = React.createRef()
    richTextEditor = React.createRef()
    formRef = React.createRef()
    componentDidMount() {
        const { categoryList, productList } = this.props
        const { id } = this.props.match.params
        if (categoryList.length) {
            this.setState({ categoryList })
        } else this.getCategoryList()
        if (id) {
            this.setState({ operaType: "update" })
            if (productList.length) {
                let result = productList.find((item) => {
                    return item._id === id
                })
                if (result) {
                    this.setState({ ...result })
                    const { name, desc, price, categoryId, imgs, detail } =
                        result
                    this.formRef.current.setFieldsValue({
                        name,
                        desc,
                        price,
                        categoryId,
                    })
                    this.picturesWall.current.setFileList(imgs)
                    this.richTextEditor.current.setRichText(detail)
                }
            } else this.getProductList(id)
        }
    }
    getCategoryList = async () => {
        let result = await reqCategoryList()
        const { status, data, msg } = result
        if (status === 0) {
            this.setState({ categoryList: data })
        } else message.error(msg)
    }
    getProductList = async (id) => {
        let res = await reqProdById(id)
        const { status, data } = res
        if (status === 0) {
            this.setState({ ...data })
            const { name, desc, price, categoryId, imgs, detail } = data
            this.formRef.current.setFieldsValue({
                name,
                desc,
                price,
                categoryId,
            })
            this.picturesWall.current.setFileList(imgs)
            this.richTextEditor.current.setRichText(detail)
        }
    }
    handleFinish = async (val) => {
        // 获取图片数组
        let imgs = this.picturesWall.current.getImgArr()
        // 获取富文本字符串
        let detail = this.richTextEditor.current.getRichText()
        const { operaType, _id } = this.state
        let res
        if (operaType === "add")
            res = await reqAddProduct({ ...val, imgs, detail })
        else res = await reqUpdateProduct({ ...val, imgs, detail, _id })

        const { status, msg } = res
        if (status === 0) {
            message.success("操作成功", 1)
            this.props.history.replace("/admin/prod_about/product")
        } else message.error(msg)
    }
    render() {
        const { operaType } = this.state
        return (
            <Fragment>
                <Card
                    title={
                        <Fragment>
                            <Button
                                type="link"
                                onClick={() => {
                                    this.props.history.goBack()
                                }}
                            >
                                <ArrowLeftOutlined
                                    style={{
                                        marginRight: "20px",
                                        color: "#1DA57A",
                                    }}
                                />
                            </Button>
                            <span>
                                {operaType === "update"
                                    ? "商品修改"
                                    : "商品添加"}
                            </span>
                        </Fragment>
                    }
                >
                    <Form
                        labelCol={{ md: 2 }}
                        wrapperCol={{ md: 7 }}
                        onFinish={this.handleFinish}
                        ref={this.formRef}
                    >
                        <Form.Item
                            name="name"
                            label="商品名称"
                            initialValue={""}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入商品名称",
                                },
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                placeholder="请输入商品名称"
                            />
                        </Form.Item>
                        <Form.Item
                            name="desc"
                            label="商品描述"
                            initialValue={""}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "请输入商品描述",
                                },
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                placeholder="请输入商品描述"
                            />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="商品价格"
                            initialValue={""}
                            rules={[
                                { required: true, message: "请输入商品价格" },
                            ]}
                        >
                            <Input
                                type="number"
                                autoComplete="off"
                                addonBefore="￥"
                                addonAfter="元"
                                placeholder="请输入商品价格，必须是数值"
                            />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="商品分类"
                            initialValue={""}
                            rules={[
                                { required: true, message: "请选择商品分类" },
                            ]}
                        >
                            <Select allowClear placeholder={"请选择商品分类"}>
                                {this.state.categoryList.map((item) => (
                                    <Select.Option
                                        key={item._id}
                                        value={item._id}
                                    >
                                        {item.name}
                                    </Select.Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item label="商品图片" wrapperCol={{ md: 12 }}>
                            <PicturesWall ref={this.picturesWall} />
                        </Form.Item>
                        <Form.Item label="商品详情" wrapperCol={{ md: 16 }}>
                            <RichTextEditor ref={this.richTextEditor} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                提交
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Fragment>
        )
    }
}

export default Addupdate
