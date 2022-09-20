import React, { Component } from "react"
import {
    reqProductList,
    reqUpdateProdStatus,
    reqSearchProductList,
} from "../../api"
import { PAGE_SIZE } from "../../config"
import { Card, Button, Select, Input, Table, message } from "antd"
import { PlusCircleOutlined, SearchOutlined } from "@ant-design/icons"
import { connect } from "react-redux"
import { saveProduct } from "../../redux/action_creators/product_action"
const { Option } = Select

@connect((state) => ({}), { saveProduct: saveProduct })
class Product extends Component {
    state = {
        productList: [], //商品列表数据
        total: 0, // 总页数
        current: 1, // 当前页数
        keyWord: "", // 搜索关键词
        searchType: "productName",
    }
    componentDidMount() {
        this.getProductList()
    }
    // 获取商品列表
    getProductList = async (number = 1) => {
        let res
        if (this.isSearch) {
            // 如果是请求搜索
            const { searchType, keyWord } = this.state
            res = await reqSearchProductList(
                number,
                PAGE_SIZE,
                searchType,
                keyWord
            )
        } else {
            // 初始数据
            res = await reqProductList(number, PAGE_SIZE)
        }
        const { status, data, msg } = res
        if (status === 0) {
            this.setState({
                productList: data.list,
                total: data.total,
                current: data.pageNum,
            })
            // 把获取的商品列表存入到reudx中
            this.props.saveProduct(data.list)
        } else {
            message.error(msg, 1)
        }
    }
    // 更新数据状态
    updateProdStatus = async ({ _id, status }) => {
        let productList = [...this.state.productList]
        if (status === 1) status = 2
        else status = 1
        const res = await reqUpdateProdStatus(_id, status)

        if (res.status === 0) {
            message.success("更新商品状态成功")
            productList = productList.map((item) => {
                if (item._id === _id) {
                    item.status = status
                }
                return item
            })
            this.setState({ productList })
        } else message.error("更新商品状态失败")
    }
    search = () => {
        this.isSearch = true
        this.getProductList()
    }

    render() {
        const dataSource = this.state.productList

        const columns = [
            {
                title: "商品名称",
                dataIndex: "name",
                key: "name",
                width: "15%",
            },
            {
                title: "商品描述",
                dataIndex: "desc",
                key: "desc",
            },
            {
                title: "价格",
                dataIndex: "price",
                key: "price",
                align: "center",
                width: "9%",
                render: (price) => "￥" + price,
            },
            {
                title: "状态",
                // dataIndex: "status",
                key: "status",
                align: "center",
                width: "10%",
                render: (item) => {
                    return (
                        <div>
                            <Button
                                type={item.status === 1 ? "danger" : "primary"}
                                onClick={() => {
                                    this.updateProdStatus(item)
                                }}
                            >
                                {item.status === 1 ? "下架" : "上架"}
                            </Button>
                            <br />
                            <span>{item.status === 1 ? "在售" : "停售"}</span>
                        </div>
                    )
                },
            },
            {
                title: "操作",
                // dataIndex: "operate",
                key: "operate",
                align: "center",
                width: "10%",
                render: (item) => {
                    return (
                        <div>
                            <Button
                                type="link"
                                onClick={() => {
                                    this.props.history.push(
                                        `/admin/prod_about/product/detail/${item._id}`
                                    )
                                }}
                            >
                                详情
                            </Button>
                            <br />
                            <Button
                                type="link"
                                onClick={() => {
                                    this.props.history.push(
                                        `/admin/prod_about/product/add_update/${item._id}`
                                    )
                                }}
                            >
                                修改
                            </Button>
                        </div>
                    )
                },
            },
        ]
        return (
            <div>
                <Card
                    title={
                        <div>
                            <Select
                                defaultValue="productName"
                                onChange={(val) => {
                                    this.setState({ searchType: val })
                                }}
                            >
                                <Option value="productName">按名称搜索</Option>
                                <Option value="productDesc">按描述搜索</Option>
                            </Select>
                            <Input
                                style={{ margin: "0 10px", width: "20%" }}
                                placeholder="请输入搜索关键字"
                                allowClear
                                onChange={(e) => {
                                    this.setState({ keyWord: e.target.value })
                                }}
                            ></Input>
                            <Button type="primary" onClick={this.search}>
                                <SearchOutlined />
                                搜索
                            </Button>
                        </div>
                    }
                    extra={
                        <Button
                            type="primary"
                            onClick={() => {
                                this.props.history.push(
                                    "/admin/prod_about/product/add_update"
                                )
                            }}
                        >
                            <PlusCircleOutlined />
                            添加商品
                        </Button>
                    }
                >
                    <Table
                        dataSource={dataSource}
                        columns={columns}
                        bordered
                        rowKey="_id"
                        pagination={{
                            total: this.state.total,
                            pageSize: PAGE_SIZE,
                            current: this.state.current,
                            onChange: this.getProductList,
                        }}
                    />
                </Card>
            </div>
        )
    }
}

export default Product
