import React, { useEffect } from 'react'
import { useFilePicker } from 'use-file-picker'
import { concat, uploadFile } from '../lib/ipfs'

export function FileInput({ path }: { path: string }) {
  const [openFileSelector, { plainFiles, filesContent, loading, clear }] = useFilePicker({
    readAs: 'ArrayBuffer',
    multiple: true
  })

  useEffect(() => {
    async function uploadAll() {
      console.log('Uploading Files', filesContent)
      await Promise.all(
        filesContent.map(async (f) => await uploadFile(concat(path, f.name), f.content))
      )
    }
    uploadAll()
  }, [plainFiles])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      <button onClick={() => openFileSelector()}>Upload</button>
    </div>
  )
}
