import React, {useEffect, useState} from 'react'
import { getClasses } from '../services/api'

export default function Classes(){
  const [classes, setClasses] = useState([])

  useEffect(()=>{
    (async ()=>{
      try{
        const data = await getClasses()
        setClasses(data)
      }catch(e){
        // fallback demo content
        setClasses([{id:'c101', title:'Demo Class', teacher:'Prof. A.'}])
      }
    })()
  },[])

  return (
    <div>
      <h2>Classes</h2>
      {classes.map(c => (
        <div key={c.id} style={{padding:10, border:'1px solid #eee', marginBottom:8}}>
          <strong>{c.title}</strong><div>Teacher: {c.teacher}</div>
        </div>
      ))}
    </div>
  )
}
