import Axios from 'axios'

export const userService = {
    query,
    getById,
    save,
    remove,
    login,
    signup,
    logout,
    saveLocalUser,
    getLoggedinUser,
    getEmptyUser,

}
const STORAGE_KEY_LOGGEDIN_USER = 'loggedinUser'

var axios = Axios.create({withCredentials: true, })

const BASE_URL = (process.env.NODE_ENV !== 'development') ?
    '/api/' :
    '//localhost:3000/api/'

const BASE_USER_URL = BASE_URL + 'user/'
const BASE_AUTH_URL = BASE_URL + 'auth/'

async function query() {
    try {
        const { data: users } = await axios.get(BASE_USER_URL)
        return users
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getById(userId) {
    try {
        const { data: user } = await axios.get(BASE_USER_URL + userId)
        return user
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function remove(userId) {
    try {
        const { data } = await axios.delete(BASE_USER_URL + userId)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function save(userToSave) {
    try {
        if (userToSave._id) {
            const { data: savedUser } = await axios.put(BASE_USER_URL + userToSave._id, userToSave)
            return savedUser
        } else {
            const { data: savedUser } = await axios.post(BASE_USER_URL, userToSave)
            return savedUser
        }
       
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function login(credentials) {
    try {
        console.log('credentials', credentials)
        const { data: user } = await axios.post(BASE_AUTH_URL + 'login', credentials)
        if (user) {
            return saveLocalUser(user)
        }
    } catch (err) {
        console.error('Failed to login', err)
        throw err
    }
}

async function signup(credentials) {
    try {
        const { data: user } = await axios.post(BASE_AUTH_URL + 'signup', credentials)
        return saveLocalUser(user)
    } catch (err) {
        console.error('Failed to signup', err)
        throw err
    }
}

async function logout() {
    try {
        await axios.post(BASE_AUTH_URL + 'logout')
        sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
    } catch (err) {
        console.error('Failed to logout', err)
        throw err
    }
}

function saveLocalUser(user) {
    user = { _id: user._id, fullname: user.fullname, isAdmin: user.isAdmin }
    sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(user))
    return user
}

function getLoggedinUser() {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function getEmptyUser() {
    return {
        username: '',
        fullname: '',
        password: '',
        imgUrl: '',
    }
}
