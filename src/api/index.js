// 统合api请求

// 导入配置拦截器
import myAxios from "./myAxios"
import { BASE_URL } from "../config"
// 发起登录请求
export const reqLogin = (value) => myAxios.post(`${BASE_URL}/login`, value)
// 获取分类列表
export const reqCategoryList = () =>
    myAxios.get(`${BASE_URL}/manage/category/list`)
// 添加分类
export const reqAddCategory = (value) =>
    myAxios.post(`${BASE_URL}/manage/category/add`, value)
// 修改分类
export const reqUpdateCategory = (value) =>
    myAxios.post(`${BASE_URL}/manage/category/update`, value)
// 请求商品分页列表
export const reqProductList = (pageNum, pageSize) =>
    myAxios.get(`${BASE_URL}/manage/product/list`, {
        params: { pageNum, pageSize },
    })
// 请求更新商品在售状态
export const reqUpdateProdStatus = (productId, status) =>
    myAxios.post(`${BASE_URL}/manage/product/updateStatus`, {
        productId,
        status,
    })
// 搜索商品
export const reqSearchProductList = (
    pageNum,
    pageSize,
    searchType,
    keyWord
) => {
    return myAxios.get(`${BASE_URL}/manage/product/search`, {
        params: { pageNum, pageSize, [searchType]: keyWord },
    })
}
// 根据id获取商品信息
export const reqProdById = (productId) =>
    myAxios.get(`${BASE_URL}/manage/product/info`, {
        params: { productId },
    })
// 删除图片
export const reqDeletePicture = (name) =>
    myAxios.post(`${BASE_URL}/manage/img/delete`, { name })
// 添加商品
export const reqAddProduct = (prodObj) =>
    myAxios.post(`${BASE_URL}/manage/product/add`, prodObj)
// 更新商品
export const reqUpdateProduct = (prodObj) =>
    myAxios.post(`${BASE_URL}/manage/product/update`, prodObj)
// 请求所有角色列表
export const reqRoleList = () => myAxios.get(`${BASE_URL}/manage/role/list`)
// 请求添加角色
export const reqAddRole = (roleName) =>
    myAxios.post(`${BASE_URL}/manage/role/add`, roleName)
// 给角色授权
export const reqAuthRole = (roleObj) =>
    myAxios.post(`${BASE_URL}/manage/role/update`, roleObj)
// 获取所有用户列表
export const reqUserList = () => myAxios.get(`${BASE_URL}/manage/user/list`)
// 添加用户
export const reqAddUser = (userObj) =>
    myAxios.post(`${BASE_URL}/manage/user/add`, userObj)
