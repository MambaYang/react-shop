import React, { Component } from "react"
import { Upload, Modal, message } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { BASE_URL } from "../../config"
import { reqDeletePicture } from "../../api"

// 将图片加工成base64编码形式
function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => resolve(reader.result)
        reader.onerror = (error) => reject(error)
    })
}

class PicturesWall extends Component {
    state = {
        previewVisible: false,
        previewImage: "",
        previewTitle: "",
        fileList: [], // 收集所有上传完毕的图片名
    }
    // 从fileList提取出对应商品对应图片 提供新增商品使用
    getImgArr = () => {
        let result = []
        this.state.fileList.forEach((item) => {
            result.push(item.name)
        })
        return result
    }
    setFileList = (imgArr) => {
        let fileList = []
        imgArr.forEach((item, index) => {
            fileList.push({
                uid: -index,
                name: item,
                url: `${BASE_URL}/upload/${item}`,
            })
        })
        this.setState({ fileList })
    }
    // 关闭预览窗
    handleCancel = () => this.setState({ previewVisible: false })
    // 展示预览窗
    handlePreview = async (file) => {
        // 如果图片没有url也没有 base64 调用转换base64函数
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj)
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle:
                file.name || file.url.substring(file.url.lastIndexOf("/") + 1),
        })
    }

    handleChange = async ({ file, fileList }) => {
        if (file.status === "done") {
            fileList[fileList.length - 1].url = file.response.data.url
            fileList[fileList.length - 1].name = file.response.data.name
        }
        // 删除图片
        if (file.status === "removed") {
            let res = await reqDeletePicture(file.name)
            if (res.status === 0) message.success("删除图片成功")
        }
        this.setState({ fileList })
    }

    render() {
        const { previewVisible, previewImage, fileList, previewTitle } =
            this.state
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
            </div>
        )
        return (
            <>
                <Upload
                    action={`${BASE_URL}/manage/img/upload`}
                    name="image"
                    listType="picture-card"
                    fileList={fileList}
                    onPreview={this.handlePreview}
                    onChange={this.handleChange}
                >
                    {fileList.length >= 4 ? null : uploadButton}
                </Upload>
                <Modal
                    visible={previewVisible}
                    title={previewTitle}
                    footer={null}
                    onCancel={this.handleCancel}
                >
                    <img
                        alt="example"
                        style={{ width: "100%" }}
                        src={previewImage}
                    />
                </Modal>
            </>
        )
    }
}

export default PicturesWall
