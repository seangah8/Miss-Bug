import Axios from 'axios'

export const bugService = {
    query,
    getById,
    save,
    remove,
}

var axios = Axios.create({withCredentials: true, })
const BASE_URL = '//localhost:3000/api/bug/'

async function query(filter = {}) {
    
    try {
        const { data: bugs } = await axios.get(BASE_URL, { params: filter })
        return bugs
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function getById(bugId) {

    try {
        const { data: bug } = await axios.get(BASE_URL + bugId)
        return bug
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}

async function remove(bugId) {

    try {
        const { data } = await axios.delete(BASE_URL + bugId)
        return data
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}


async function save(bugToSave) {

    try {
        if (bugToSave._id) {
            const { data: savedBug } = await axios.put(BASE_URL + bugToSave._id, bugToSave)
            return savedBug
        } else {
            const { data: savedBug } = await axios.post(BASE_URL, bugToSave)
            return savedBug
        }
       
    } catch (err) {
        console.log('err:', err)
        throw err
    }
}