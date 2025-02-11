import { UserPreview } from "./UserPreview.jsx"

export function UserList({ users, onAddUser, onRemoveUser, onUpdateUser }){


    
    return(
        <section className="user-list"> 
            <button onClick={onAddUser}>Add User +</button>
            <table>
                <thead>
                    <tr>
                        <th>Full Name</th>
                        <th>User Name</th>
                        <th>Score</th>
                        <th>Actions</th>

                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user=> <UserPreview 
                            key={user._id} 
                            user={user}
                            onRemoveUser={onRemoveUser}
                            onUpdateUser={onUpdateUser}/>)
                    }
                </tbody>
            </table>

        </section>


    )
}