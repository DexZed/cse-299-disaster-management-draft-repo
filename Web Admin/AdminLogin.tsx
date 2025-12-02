import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/AdminLogin.css'

interface AdminLoginProps {
    onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (username === 'admin' && password === 'admin123') {
            onLogin()
            navigate('/admin/dashboard')
        } else {
            setError('Invalid credentials! Use admin/admin123')
        }
    }

    return (
        <div className="login-page">
            <div className="login-box">
                <div className="login-icon">👨‍💼</div>
                <h1>Admin Login</h1>
                <p>Access the Emergency Response Dashboard</p>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                            required
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" className="btn-login">
                        Login to Dashboard
                    </button>
                </form>

                <div className="login-footer">
                    <p>Demo credentials: admin / admin123</p>
                </div>
            </div>
        </div>
    )
}
