import { useState, useEffect } from 'react'
import { userService } from '../services/user'

export function LoginSignup({ onSignup, onLogin }) {
    const [users, setUsers] = useState([])
    const [credentials, setCredentials] = useState(userService.getEmptyUser())
    const [isSignup, setIsSignup] = useState(false)

    useEffect(() => {
        loadUsers()
    }, [])

    async function loadUsers() {
        try {
            const users = await userService.query()
            setUsers(users)
        } catch (err) {
            console.log('Had issues loading users', err);
        }
    }

    function clearState() {
        setCredentials(userService.getEmptyUser())
        setIsSignup(false)
    }

    function handleChange(ev) {
        const field = ev.target.name
        const value = ev.target.value
        setCredentials({ ...credentials, [field]: value })
    }

    async function onSubmitForm(ev = null) {
        if (ev) ev.preventDefault()
        if (isSignup) {
            if (!credentials.username || !credentials.password || !credentials.fullname) return
            await onSignup(credentials)
        } else {
            if (!credentials.username || !credentials.password) return
            await onLogin(credentials)
        }
        clearState()

    }

    function onToggleSignup() {
        setIsSignup(isSignup => !isSignup)
    }


    return (
        <div className="login-page">
            <p>
                <button className="btn-link" onClick={onToggleSignup}>{!isSignup ? 'Signup' : 'Login'}</button>
            </p>
            {!isSignup && <form className="login-form" onSubmit={onSubmitForm}>

                <input
                type="text"
                name="username"
                value={credentials.username}
                placeholder="Username"
                onChange={handleChange}
                required
                />

                <input
                type="password"
                name="password"
                value={credentials.password}
                placeholder="Password"
                onChange={handleChange}
                required
                />
                
                <button>Login!</button>
            </form>}
            <div className="signup-section">
                {isSignup && <form className="signup-form" onSubmit={onSubmitForm}>
                    <input
                        type="text"
                        name="fullname"
                        value={credentials.fullname}
                        placeholder="Fullname"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        value={credentials.username}
                        placeholder="Username"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        value={credentials.password}
                        placeholder="Password"
                        onChange={handleChange}
                        required
                    />
                    <button >Signup!</button>
                </form>}
            </div>
        </div>
    )
}