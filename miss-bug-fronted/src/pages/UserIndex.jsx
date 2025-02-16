import { useEffect, useState } from "react"
import { userService } from "../services/user"
import { UserList } from "../cmps/UserList.jsx"

export function UserIndex(){

    const [users,setUsers] = useState(null)

    useEffect(()=>{
        loadUsers()
    },[])

    async function loadUsers(){
        const users = await userService.query()
        setUsers(users)
    }

    async function onAddUser(){
        const user = {
            fullname: prompt('Full Name?') || 'New User',
            username: prompt('User Name?') || 'UserName',
            password: prompt('Password?') || '1234'
        }
        await userService.save(user)
        loadUsers()
    }

    async function onRemoveUser(userId) {
        await userService.remove(userId)
        loadUsers()
    }

    async function onUpdateUser(user){
        const updatedUser = {
            _id: user._id,
            fullname: prompt('New Full Name?', user.fullname) || user.fullname,
            username: prompt('New User Name?', user.username) || user.username,
            score: prompt('New Score?', user.score) || user.score
        }
        await userService.save(updatedUser)
        loadUsers()
    }
    


    if(!users) return <h3>Loading...</h3>

    return(
        <section className="user-index">
            <h1>User Page</h1>
            <UserList 
            users={users}
            onAddUser={onAddUser} 
            onRemoveUser={onRemoveUser}
            onUpdateUser={onUpdateUser}/>
        </section>
    )
}