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
        // ??????????????????
        let imgs = this.picturesWall.current.getImgArr()
        // ????????????????????????
        let detail = this.richTextEditor.current.getRichText()
        const { operaType, _id } = this.state
        let res
        if (operaType === "add")
            res = await reqAddProduct({ ...val, imgs, detail })
        else res = await reqUpdateProduct({ ...val, imgs, detail, _id })

        const { status, msg } = res
        if (status === 0) {
            message.success("????????????", 1)
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
                                    ? "????????????"
                                    : "????????????"}
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
                            label="????????????"
                            initialValue={""}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "?????????????????????",
                                },
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                placeholder="?????????????????????"
                            />
                        </Form.Item>
                        <Form.Item
                            name="desc"
                            label="????????????"
                            initialValue={""}
                            rules={[
                                {
                                    required: true,
                                    whitespace: true,
                                    message: "?????????????????????",
                                },
                            ]}
                        >
                            <Input
                                autoComplete="off"
                                placeholder="?????????????????????"
                            />
                        </Form.Item>
                        <Form.Item
                            name="price"
                            label="????????????"
                            initialValue={""}
                            rules={[
                                { required: true, message: "?????????????????????" },
                            ]}
                        >
                            <Input
                                type="number"
                                autoComplete="off"
                                addonBefore="???"
                                addonAfter="???"
                                placeholder="???????????????????????????????????????"
                            />
                        </Form.Item>
                        <Form.Item
                            name="categoryId"
                            label="????????????"
                            initialValue={""}
                            rules={[
                                { required: true, message: "?????????????????????" },
                            ]}
                        >
                            <Select allowClear placeholder={"?????????????????????"}>
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
                        <Form.Item label="????????????" wrapperCol={{ md: 12 }}>
                            <PicturesWall ref={this.picturesWall} />
                        </Form.Item>
                        <Form.Item label="????????????" wrapperCol={{ md: 16 }}>
                            <RichTextEditor ref={this.richTextEditor} />
                        </Form.Item>
                        <Form.Item wrapperCol={{ offset: 8 }}>
                            <Button type="primary" htmlType="submit">
                                ??????
                            </Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Fragment>
        )
    }
}

export default Addupdate
