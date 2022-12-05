import React from 'react'
import { concat, mkdir } from '../lib/ipfs'

export function NewFolder({ path }: { path: string }) {
  const onAddFolder = async () => {
    console.log('creating folder in', path)
    const dir = prompt('Folder name')
    if (dir) {
      await mkdir(concat(path, dir))
    }
  }
  return (
    <button className='primary' onClick={onAddFolder}>
      New folder
    </button>
  )
}
