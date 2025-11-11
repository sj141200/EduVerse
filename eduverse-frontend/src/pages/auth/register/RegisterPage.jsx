import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from "../../../context/AuthContext"

function RegisterPage() {
	const navigate = useNavigate()
	const { register } = useAuth()

	const [role, setRole] = useState('student')
	const [username, setUsername] = useState('')
	const [name, setName] = useState('')
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState(null)
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
			setError(v)
			return
		}
		setError(null)
		setLoading(true)
		try {
			const res = await register(username.trim(), name.trim(), email.trim(), password)
			if (res && res.success) {
				// augment stored user with role and org (dev-friendly)
				try {
					const raw = localStorage.getItem('eduverse_user')
					const user = raw ? JSON.parse(raw) : { username }
					const merged = { ...user, role, organization: org || undefined }
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
				setError(res.error || 'Registration failed')
			}
		} catch (err) {
			setError(err.message || 'Registration failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div className="min-h-screen flex items-center justify-center bg-base-200 p-4">
			<div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
				<div className="hidden md:block rounded-lg overflow-hidden shadow-lg">
					<img src="https://picsum.photos/800/900?random=32" alt="students" className="w-full h-full object-cover" />
				</div>

				<div className="bg-base-100 p-8 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold mb-2">Create your account</h2>
					<p className="text-sm text-base-content/70 mb-4">Sign up as a student or instructor to get started.</p>

					<div className="tabs tabs-boxed mb-4">
						<button className={`tab ${role === 'student' ? 'tab-active' : ''}`} onClick={() => setRole('student')}>Student</button>
						<button className={`tab ${role === 'instructor' ? 'tab-active' : ''}`} onClick={() => setRole('instructor')}>Instructor</button>
					</div>

					<form onSubmit={onSubmit} className="space-y-4">
						<div>
							<label className="label"><span className="label-text">Full name</span></label>
							<input className="input input-bordered w-full" value={name} onChange={e => setName(e.target.value)} placeholder="Jane Doe" />
						</div>

						<div>
							<label className="label"><span className="label-text">Username</span></label>
							<input className="input input-bordered w-full" value={username} onChange={e => setUsername(e.target.value)} placeholder="janedoe" />
						</div>

						<div>
							<label className="label"><span className="label-text">Email</span></label>
							<input type="email" className="input input-bordered w-full" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@example.com" />
						</div>

						<div>
							<label className="label"><span className="label-text">Password</span></label>
							<input type="password" className="input input-bordered w-full" value={password} onChange={e => setPassword(e.target.value)} placeholder="Choose a strong password" />
						</div>

						{error && <div className="text-error text-sm">{error}</div>}

						<div className="flex items-center gap-3">
							<button className={`btn btn-primary ${loading ? 'loading' : ''}`} type="submit" disabled={loading}>
								Create account
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
