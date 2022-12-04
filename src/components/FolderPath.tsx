import React from 'react'
import { Link } from 'react-router-dom'
import { NewFolder } from './NewFolder'

export function FolderPath({ currentPath }: { currentPath: string }) {
  const parts = currentPath.split('/')
  console.log('parts', parts)
  return (
    <div>
      <div className='flex items-center'>
        <Link to='/'>Drive &nbsp;&nbsp; /</Link>
        {parts.map((p, i) => {
          if (!p) return null
          return (
            <Link key={i} className='ml4' to={parts.slice(0, i + 1).join('/')}>
              {p} &nbsp;&nbsp; /
            </Link>
          )
        })}
        <div className='ml4'>
          <NewFolder path={currentPath} />
        </div>
      </div>
    </div>
  )
}
