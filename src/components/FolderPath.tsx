import React from 'react'
import { Link } from 'react-router-dom'
import { FolderRemove } from './FolderRemove'
import { NewFolder } from './NewFolder'

export function FolderPath({
  currentPath,
  selectedFiles
}: {
  currentPath: string
  selectedFiles: string[]
}) {
  const parts = currentPath.split('/')
  console.log('parts', parts)
  return (
    <div>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <Link to='/'>Drive</Link>
          {parts.map((p, i) => {
            if (!p) return null
            return (
              <Link key={i} className='ml4' to={parts.slice(0, i + 1).join('/')}>
                /&nbsp;&nbsp; {p}
              </Link>
            )
          })}
        </div>

        <FolderRemove currentPath={currentPath} folderPaths={selectedFiles} />
      </div>
    </div>
  )
}
