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
      <button className='outline primary' onClick={() => openFileSelector()}>
        File upload
      </button>
    </div>
  )
}
