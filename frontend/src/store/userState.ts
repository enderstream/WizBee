import { atom } from "recoil"
import { IUser } from "@/types/User"
import persistAtom from "@/store/persistAtom"

export const userState = atom<IUser>({
    key: "userState",
    default: {
        isLogin: false,
        email: "email",
        token: "",
        nickname: "nickname",
    },
    effects_UNSTABLE: [persistAtom],
})