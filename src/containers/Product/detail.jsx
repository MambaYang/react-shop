import React, { Component } from "react"
import { Button, Card, List, message } from "antd"
import { ArrowLeftOutlined } from "@ant-design/icons"
import "./css/detail.less"
import { connect } from "react-redux"
import { reqProdById, reqCategoryList } from "../../api"
const { Item } = List

@connect((state) => ({
    productList: state.productList,
    categoryList: state.categoryList,
}))
class Detail extends Component {
    state = {
        categoryId: "",
        desc: "",
        detail: "",
        imgs: [],
        name: "",
        price: "",
        categoryName: "",
        isLoading: true,
    }

    componentDidMount() {
        const { id } = this.props.match.params
        const reduxProdList = this.props.productList
        const reduxCateList = this.props.categoryList
        if (reduxProdList.length) {
            let result = reduxProdList.find((item) => item._id === id)
            if (result) {
                this.categoryId = result.categoryId
                this.setState({ ...result })
            }
        } else {
            this.getProdById(id)
        }
        if (reduxCateList.length) {
            let result = reduxCateList.find((item) => {
                return (item._id = this.categoryId)
            })
            this.setState({ categoryName: result.name, isLoading: false })
        } else this.getCategorylist()
    }
    getProdById = async (id) => {
        let res = await reqProdById(id)
        if (res.status === 0) {
            this.categoryId = res.data.categoryId
            this.setState({ ...res.data })
        }
        // const { categoryId, desc, detail, imgs, name, price } = res.data
        // this.setState({ categoryId, desc, detail, imgs, name, price })
        else message.error("获取详情失败！")
    }
    getCategorylist = async () => {
        let res = await reqCategoryList()
        const { status, data } = res
        if (status === 0) {
            let result = data.find((item) => {
                return (item._id = this.categoryId)
            })
            if (result)
                this.setState({ categoryName: result.name, isLoading: false })
            else message.error("获取分类名失败")
        }
    }
    render() {
        const { desc, detail, imgs, name, price, categoryName } = this.state
        return (
            <div>
                <Card
                    title={
                        <div>
                            <Button
                                type="link"
                                size="small"
                                onClick={() => {
                                    this.props.history.goBack()
                                }}
                            >
                                <ArrowLeftOutlined
                                    style={{ fontSize: "20px" }}
                                />
                            </Button>
                            <span style={{ fontSize: "18px" }}>商品详情</span>
                        </div>
                    }
                    loading={this.state.isLoading}
                >
                    <List>
                        <Item>
                            <span className="prod-title">商品名称:</span>
                            <span>{name}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">商品描述:</span>
                            <span>{desc}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">商品价格:</span>
                            <span>{price}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">所属分类:</span>
                            <span>{categoryName}</span>
                        </Item>
                        <Item>
                            <span className="prod-title">商品图片:</span>
                            {imgs.map((item, index) => {
                                return (
                                    <img
                                        src={`/upload/` + item}
                                        alt="商品图片"
                                        key={index}
                                    />
                                )
                            })}
                        </Item>
                        <Item>
                            <span className="prod-title">商品详情:</span>
                            <span
                                dangerouslySetInnerHTML={{ __html: detail }}
                            ></span>
                        </Item>
                    </List>
                </Card>
            </div>
        )
    }
}
export default Detail
