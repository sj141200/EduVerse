import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../../context/AuthContext'
import { useMessage } from '../../../context/MessageContext'

function LoginPage() {
	const navigate = useNavigate()
	const { login } = useAuth()
	const { showMessage } = useMessage()
	const [role, setRole] = useState('student')
	const [username, setUsername] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const onSubmit = async (e) => {
		e.preventDefault()
		// clear previous toasts
		setLoading(true)
		try {
			const res = await login(username.trim(), password, role)
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
				showMessage('Signed in successfully', 'success')
			} else {
				const msg = res && res.error ? res.error : 'Login failed'
				showMessage(msg, 'error')
			}
		} catch (err) {
			const msg = err.message || 'Login failed'
			showMessage(msg, 'error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
			<div className="w-full max-w-4xl bg-base-100 rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
				{/* Left visual column */}
				<div className="hidden md:flex items-center justify-center bg-linear-to-br from-primary to-secondary p-8 text-white">
					<div className="space-y-4 text-center max-w-sm">
						<h3 className="text-2xl font-bold">Welcome back</h3>
						<p className="text-sm opacity-90">Access your classes, announcements and assignments.</p>
						<div className="mt-4">
							<span className="badge badge-lg badge-primary">{role === 'student' ? 'Student' : 'Instructor'}</span>
						</div>
					</div>
				</div>

				{/* Right form column */}
				<div className="p-8">
					<h2 className="text-2xl font-bold mb-2">Sign in</h2>
					<p className="text-sm text-base-content/70 mb-4">Sign in to continue to your dashboard.</p>

					{/* Role selector as pills */}
					<div className="flex gap-2 mb-6">
						<button type="button" onClick={() => setRole('student')} className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-ghost'}`}>Student</button>
						<button type="button" onClick={() => setRole('instructor')} className={`btn btn-sm ${role === 'instructor' ? 'btn-primary' : 'btn-ghost'}`}>Instructor</button>
					</div>

					<form onSubmit={onSubmit} className="space-y-4">
						<div className="form-control">
							<label className="input-group">
								<span className="bg-base-200">@</span>
								<input className="input input-bordered w-full" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username or email" />
							</label>
						</div>

						<div className="form-control">
							<label className="input-group">
								<span className="bg-base-200">🔒</span>
								<input type="password" className="input input-bordered w-full" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
							</label>
						</div>

						<div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
							<button className={`btn btn-primary flex-1`} type="submit" disabled={loading}>
								{loading ?  <span className="loading loading-spinner"></span> : 'Sign in'}
							</button>
							<button type="button" className="btn btn-outline" onClick={() => navigate('/register')}>Create account</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default LoginPage
