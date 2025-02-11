import Axios from 'axios'

export const userService = {
    query,
    getById,
    save,
    remove,
}

var axios = Axios.create({withCredentials: true, })
const BASE_URL = '//localhost:3000/api/user/'

async function query() {
    try {
        const { data: users } = await axios.get(BASE_URL)
        return users
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_URL + userId)
        return user
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const { data } = await axios.delete(BASE_URL + userId)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}


async function save(userToSave) {
    try {
        if (userToSave._id) {
            const { data: savedUser } = await axios.put(BASE_URL + userToSave._id, userToSave)
            return savedUser
        } else {
            const { data: savedUser } = await axios.post(BASE_URL, userToSave)
            return savedUser
        }
       
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}