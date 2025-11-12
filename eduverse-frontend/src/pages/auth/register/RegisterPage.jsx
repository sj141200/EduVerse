import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../../context/AuthContext"
import { useMessage } from '../../../context/MessageContext'

function RegisterPage() {
	const navigate = useNavigate()
	const { register } = useAuth()
	const { showMessage } = useMessage()

	const [role, setRole] = useState('student')
	const [username, setUsername] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [loading, setLoading] = useState(false)

	const validate = () => {
		if (!username.trim()) return 'Username is required'
		if (!name.trim()) return 'Full name is required'
		if (!email.includes('@')) return 'Valid email is required'
		if (password.length < 6) return 'Password must be at least 6 characters'
		return null
	}

	const onSubmit = async (e) => {
		e.preventDefault()
		const v = validate()
		if (v) {
			showMessage(v, 'error')
			return
		}
		setLoading(true)
		try {
			const res = await register(username.trim(), name.trim(), email.trim(), password, role)
			if (res && res.success) {
				// augment stored user with role and org (dev-friendly)
				try {
					const raw = localStorage.getItem('eduverse_user')
					const user = raw ? JSON.parse(raw) : { username }
					const merged = { ...user, role }
					localStorage.setItem('eduverse_user', JSON.stringify(merged))
				} catch (err) {
					// ignore
				}
				if (role == "student"){
					navigate('/st/dashboard')
				}else{
					navigate('/ins/dashboard')
				}
			} else {
				const msg = res && res.error ? res.error : 'Registration failed'
				showMessage(msg, 'error')
			}
		} catch (err) {
			const msg = err.message || 'Registration failed'
			showMessage(msg, 'error')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
			<div className="w-full max-w-4xl bg-base-100 rounded-lg shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
				{/* Left marketing column */}
				<div className="hidden md:flex flex-col items-center justify-center p-8 bg-linear-to-br from-secondary to-accent text-white">
					<h3 className="text-2xl font-bold">Create your account</h3>
					<p className="mt-2 text-sm opacity-90 text-center max-w-xs">Join classes, submit assignments, and stay connected with your students or instructors.</p>
					<div className="mt-4">
						<span className="badge badge-lg">{role === 'student' ? 'Student' : 'Instructor'}</span>
					</div>
				</div>

				{/* Right form column */}
				<div className="p-8">
					<p className="text-sm text-base-content/70 mb-4">Sign up to get started with EduVerse.</p>

					{/* Role selector */}
					<div className="flex gap-2 mb-4">
						<button type="button" onClick={() => setRole('student')} className={`btn btn-sm ${role === 'student' ? 'btn-primary' : 'btn-ghost'}`}>Student</button>
						<button type="button" onClick={() => setRole('instructor')} className={`btn btn-sm ${role === 'instructor' ? 'btn-primary' : 'btn-ghost'}`}>Instructor</button>
					</div>

					<form onSubmit={onSubmit} className="space-y-4">
						<div className="form-control">
							<label className="input-group">
								<span className="bg-base-200">👤</span>
								<input className="input input-bordered w-full" value={name} onChange={e => setName(e.target.value)} placeholder="Full name" />
							</label>
						</div>

						<div className="form-control">
							<label className="input-group">
								<span className="bg-base-200">@</span>
								<input className="input input-bordered w-full" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
							</label>
						</div>

						<div className="form-control">
							<label className="input-group">
								<span className="bg-base-200">✉️</span>
								<input type="email" className="input input-bordered w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" />
							</label>
						</div>

						<div className="form-control">
							<label className="input-group">
								<span className="bg-base-200">🔒</span>
								<input type="password" className="input input-bordered w-full" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a strong password" />
							</label>
						</div>

						<div className="flex flex-col md:flex-row gap-3 mt-2">
							<button className={`btn btn-primary flex-1`} type="submit" disabled={loading}>
								{loading ?  <span className="loading loading-spinner"></span> : 'Create account'}
							</button>
							<button type="button" className="btn btn-ghost" onClick={() => navigate('/login')}>Already have an account?</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	)
}

export default RegisterPage
