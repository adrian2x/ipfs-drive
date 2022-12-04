import React from 'react'

export function FolderPath({ path }: { path: string }) {
  const parts = path.split('/')
  return (
    <div>
      <a href='/'>/</a>
      {parts.map((p, i) => (
        <a key={i} className='ml2' href={parts.slice(0, i + 1).join('/')}>
          {p}
        </a>
      ))}
    </div>
  )
}
