import { makeId, readJsonFile, writeJsonFile } from "../../services/util.service.js"
import { loggerService } from "../../services/logger.service.js"

export const userService = {
    query,
    getUser,
    remove,
    save,
}

const users = readJsonFile('./data/users.json')


async function query(){
    try{
        return users
    } catch(err){
        loggerService.error(`Couldn't get users`)
        throw err
    }
}

async function getUser(userId){
    try{
        const user = users.find(user=>user._id === userId)
        if(!user) throw `Bad user id ${userId}`
        return user
    } catch(err){
        loggerService.error(`Couldn't get user ${userId}`)
        throw err
    }
}

async function remove(userId){
    try{
        const idx = users.findIndex(user=>user._id===userId)
        if(idx === -1) throw `Bad user id ${userId}`
        users.splice(idx,1)

        await writeJsonFile('./data/users.json', users)
        return
    } catch(err){
        loggerService.error(`Couldn't remove user ${userId}`)
        throw err
    }
}

async function save(userToSave) { 
    try {
        if (userToSave._id) {
            const idx = users.findIndex(user => user._id === userToSave._id)
            if (idx === -1) throw `Bad user id ${userToSave._id}`
            users.splice(idx, 1, userToSave)
        } else {
            userToSave._id = makeId()
            userToSave.score = 0
            userToSave.createdAt = Date.now()
            users.push(userToSave)
        }
        await writeJsonFile('./data/users.json', users)
        return userToSave
    } catch (err) {
        loggerService.error(`Couldn't save user ${userToSave._id || userToSave.title}`)
        throw err
    }
}
