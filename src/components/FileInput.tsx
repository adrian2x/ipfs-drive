import React, { useEffect } from 'react'
import { useFilePicker } from 'use-file-picker'
import { concat, uploadFile } from '../lib/ipfs'

export function FileInput({ currentPath }: { currentPath: string }) {
  const [openFileSelector, { plainFiles, filesContent, loading, clear }] = useFilePicker({
    readAs: 'ArrayBuffer',
    multiple: true
  })

  useEffect(() => {
    async function uploadAll() {
      console.log('Uploading Files', filesContent)
      await Promise.all(
        filesContent.map(async (f) => await uploadFile(concat(currentPath, f.name), f.content))
      )
    }
    uploadAll()
  }, [plainFiles])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <button className='primary w-100 justify-center' onClick={() => openFileSelector()}>
        <span className='icon'>+</span>
        File upload
      </button>
    </div>
  )
}
