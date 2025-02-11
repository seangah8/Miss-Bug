import { bugService as RmoteService } from "./bug.service.js"
import { bugService as localService } from "./bug.service.local.js"

const isRemote = true

export const bugService = isRemote ? RmoteService : localService