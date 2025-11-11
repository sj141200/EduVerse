import { Link } from 'react-router-dom'

function CourseCard({ course }) {
  const { id, title, teacher, color } = course
  return (
    <div className="card rounded-lg overflow-hidden shadow-md bg-base-100">
      <div className="p-4" style={{ background: `linear-gradient(90deg, ${color} 0%, rgba(0,0,0,0.18) 100%)`, color: 'white' }}>
        <Link to={`/st/dashboard/class/${id}`} className="text-lg font-semibold block truncate" title={title}>{title}</Link>
        <div className="text-xs opacity-80">{teacher}</div>
      </div>
      <div className="p-6 min-h-[120px]">
      </div>
      <div className="px-4 py-3 border-t border-base-300 bg-base-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost btn-square btn-xs" title="Classwork">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18"/></svg>
          </button>
          <button className="btn btn-ghost btn-square btn-xs" title="People">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M12 12a4 4 0 100-8 4 4 0 000 8z"/></svg>
          </button>
        </div>
        <div>
          <button className="btn btn-ghost btn-xs">⋯</button>
        </div>
      </div>
    </div>
  )
}

export default CourseCard
