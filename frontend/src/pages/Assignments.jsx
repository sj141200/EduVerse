import React, {useEffect, useState} from 'react'
import { getAssignments } from '../services/api'

export default function Assignments(){
  const [assigns, setAssigns] = useState([])

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await getAssignments('c101')
        setAssigns(data)
      }catch(e){
        setAssigns([{id:'a1', title:'Demo Assignment', dueDate:'2025-11-01'}])
      }
    })()
  },[])

  return (
    <div>
      <h2>Assignments</h2>
      {assigns.map(a => (
        <div key={a.id} style={{padding:10, border:'1px solid #eee', marginBottom:8}}>
          <strong>{a.title}</strong>
          <div>Due: {a.dueDate}</div>
        </div>
      ))}
    </div>
  )
}
