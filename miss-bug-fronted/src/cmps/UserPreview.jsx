
export function UserPreview({ user, onRemoveUser, onUpdateUser }){


    return(
        <tr key={user._id} className="user-preview">

            <td>{user.fullname}</td>
            <td>{user.username}</td>
            <td>{user.score}</td>

            <td>  
                <button onClick={()=>onRemoveUser(user._id)}>Remove User</button>
                <button onClick={()=>onUpdateUser(user)}>Edit User</button>
            </td>

        </tr>
    )
}