import { storageService } from '../async-storage.service'

const STORAGE_KEY = 'userDB'

export const userService = {
    query,
    getById,
    save,
    remove,
}

async function query() {
    return storageService.query(STORAGE_KEY)
}

async function getById(userId) {
    return storageService.get(STORAGE_KEY, userId)
}

async function remove(userId) {
    return storageService.remove(STORAGE_KEY, userId)
}


async function save(user) {
    if (user._id) {
        return storageService.put(STORAGE_KEY, user)
    } else {
        return storageService.post(STORAGE_KEY, user)
    }
}