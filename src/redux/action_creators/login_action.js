import { SAVE_USER_INFO, DELETE_USER_INFO } from "../action_types"
export const saveUserInfo = (value) => {
    localStorage.setItem("user", JSON.stringify(value.user))
    localStorage.setItem("token", value.token)

    return { type: SAVE_USER_INFO, data: value }
}
export const deleteUserInfo = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")

    return { type: DELETE_USER_INFO }
}
