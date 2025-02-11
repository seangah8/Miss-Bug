import { userService as RmoteService } from "./user.service.js"
import { userService as localService } from "./user.service.local.js"

const isRemote = true

export const userService = isRemote ? RmoteService : localService