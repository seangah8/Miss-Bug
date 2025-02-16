
export function UserPreview({ user, onRemoveUser, onUpdateUser }){


    return(
        <tr key={user._id} className={`user-preview${user.isAdmin? '-admin' : ''}`}>

            <td>{user.fullname}</td>
            <td>{user.username}</td>
            <td>{user.score}</td>

            <td>  
                {!user.isAdmin && <button onClick={()=>onRemoveUser(user._id)}>Remove User</button>}
                <button onClick={()=>onUpdateUser(user)}>Edit User</button>
            </td>

        </tr>
    )
}