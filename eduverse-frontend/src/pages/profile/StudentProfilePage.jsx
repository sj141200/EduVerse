import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchUserProfile, updateUserProfile, deleteUserAccount } from '../../api/users'
import { useMessage } from '../../context/MessageContext'

function StudentProfilePage(){
  const { user, token, logout } = useAuth() || {}
  const [profile, setProfile] = useState(user || { name: '', email: '' })
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const { showMessage } = useMessage()
  const navigate = useNavigate()

  useEffect(() => {
    let mounted = true
    async function load(){
      try {
        const p = await fetchUserProfile(token)
        if (!mounted) return
        setProfile(p || { name: '', email: '' })
      } catch (e) {}
    }
    load()
    return () => { mounted = false }
  }, [token])

  async function onSave(e){
    e.preventDefault()
    setSaving(true)
    try {
      const updates = { name: profile.name, email: profile.email }
      if (profile.password) updates.password = profile.password
      const res = await updateUserProfile(token, updates)
      showMessage('Profile updated', 'success')
      try { localStorage.setItem('eduverse_user', JSON.stringify(res)) } catch(e){}
    } catch (err) {
      showMessage(err.message || 'Failed to update profile', 'error')
    } finally { setSaving(false); setProfile(p => ({...p, password: ''})) }
  }

  async function onDelete(){
    if (!confirm('Delete your account? This will remove your data.')) return
    setDeleting(true)
    try {
      const res = await deleteUserAccount(token)
      if (res && res.success) {
        showMessage('Account deleted', 'success')
        logout()
        navigate('/')
      } else {
        showMessage('Failed to delete account', 'error')
      }
    } catch (e) {
      showMessage(e.message || 'Failed to delete account', 'error')
    } finally { setDeleting(false) }
  }

  return (
    <div className="max-w-3xl mx-auto bg-base-100 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Your profile</h2>
      <form onSubmit={onSave} className="space-y-4">
        <div>
          <label className="label"><span className="label-text">Full name</span></label>
          <input className="input input-bordered w-full" value={profile.name || ''} onChange={e => setProfile({...profile, name: e.target.value})} />
        </div>
        <div>
          <label className="label"><span className="label-text">Email</span></label>
          <input type="email" className="input input-bordered w-full" value={profile.email || ''} onChange={e => setProfile({...profile, email: e.target.value})} />
        </div>
        <div>
          <label className="label"><span className="label-text">Change password</span></label>
          <input type="password" className="input input-bordered w-full" value={profile.password || ''} onChange={e => setProfile({...profile, password: e.target.value})} placeholder="Leave blank to keep current password" />
        </div>

        <div className="flex items-center gap-3">
          <button className={`btn btn-primary ${saving ? 'loading' : ''}`} type="submit">Save changes</button>
          <button type="button" className="btn btn-ghost" onClick={() => setProfile(user || { name: '', email: '' })}>Reset</button>
          <div className="ml-auto">
            <button type="button" className={`btn btn-error ${deleting ? 'loading' : ''}`} onClick={onDelete}>Delete account</button>
          </div>
        </div>
      </form>
    </div>
  )
}

export default StudentProfilePage
