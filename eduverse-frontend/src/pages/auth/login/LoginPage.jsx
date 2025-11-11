import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'

function LoginPage() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const [role, setRole] = useState('student')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
	const [loading, setLoading] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
		setError(null)
		setLoading(true)
		try {
			const res = await login(username.trim(), password)
			if (res && res.success) {
				// persist a small local user record (dev-friendly) including chosen role
				try {
					const raw = localStorage.getItem('eduverse_user')
					const user = raw ? JSON.parse(raw) : { username }
					const merged = { ...user, username: username.trim(), role }
					localStorage.setItem('eduverse_user', JSON.stringify(merged))
				} catch (err) {
					// ignore localStorage write errors
				}
				// navigate to role-specific dashboard
				if (role === 'instructor') navigate('/ins/dashboard')
				else navigate('/st/dashboard')
			} else {
				setError(res.error || 'Login failed')
			}
		} catch (err) {
			setError(err.message || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
			<div className="w-full max-w-md bg-base-100 p-8 rounded-lg shadow-md">
				<h2 className="text-2xl font-bold mb-2">Sign in</h2>
				<p className="text-sm text-base-content/70 mb-4">Sign in as a student or instructor to continue.</p>

				<div className="tabs tabs-boxed mb-4">
					<button className={`tab ${role === 'student' ? 'tab-active' : ''}`} onClick={() => setRole('student')}>Student</button>
					<button className={`tab ${role === 'instructor' ? 'tab-active' : ''}`} onClick={() => setRole('instructor')}>Instructor</button>
				</div>

				<form onSubmit={onSubmit} className="space-y-4">
					<div>
						<label className="label"><span className="label-text">Username</span></label>
						<input className="input input-bordered w-full" value={username} onChange={e => setUsername(e.target.value)} placeholder="username" />
					</div>

					<div>
						<label className="label"><span className="label-text">Password</span></label>
						<input type="password" className="input input-bordered w-full" value={password} onChange={e => setPassword(e.target.value)} placeholder="password" />
					</div>

					{error && <div className="text-error text-sm">{error}</div>}

					<div className="flex items-center gap-3">
						<button className={`btn btn-primary ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>Sign in</button>
						<button type="button" className="btn btn-ghost" onClick={() => navigate('/register')}>Create account</button>
					</div>
				</form>
			</div>
		</div>
	)
}

export default LoginPage
