import { SAVE_TITLE } from "../action_types"
export const saveTitle = (value) => {
    return { type: SAVE_TITLE, data: value }
}
