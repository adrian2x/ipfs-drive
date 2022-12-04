import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Document, Page } from 'react-pdf/dist/esm/entry.webpack5'

import 'react-pdf/dist/esm/Page/AnnotationLayer.css'

import { getType, read } from '../lib/ipfs'

export function parseUrl(path: string) {
  return path.replace('++', '.')
}

export function fileUrl(path: string) {
  return path.replace('.', '++')
}

export default function FilePage({ path }: { path: string }) {
  const location = useLocation()
  const currentName = decodeURIComponent(parseUrl(location.pathname.split('/').pop() as string))
  const mimeType = getType(path)
  const [file, setFileUrl] = useState<any>()
  const [text, setText] = useState('')
  const [numPages, setNumPages] = useState<any>(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  useEffect(() => {
    async function readFile() {
      const blob = await read(path)
      console.log('file', blob)
      setFileUrl(URL.createObjectURL(blob))
    }
    readFile()
    return () => {
      if (file) URL.revokeObjectURL(file)
    }
  }, [])

  return (
    <>
      <h2>{currentName}</h2>

      {mimeType === 'application/pdf' && (
        <div className='Example__container__document'>
          <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
            <Page pageNumber={pageNumber} />
          </Document>
        </div>
      )}

      {mimeType?.startsWith('image') && <img alt={path} src={file} height={300} />}

      {mimeType?.startsWith('audio/') && <audio src={file} controls></audio>}

      {mimeType?.startsWith('video') && <video src={file} controls></video>}
    </>
  )
}
