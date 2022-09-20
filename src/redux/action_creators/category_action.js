import { SAVE_CATEGORY_LIST } from "../action_types"
export const saveCategory = (value) => {
    return { type: SAVE_CATEGORY_LIST, data: value }
}
