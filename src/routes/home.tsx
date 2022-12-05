import prettyBytes from 'pretty-bytes'
import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FileInput } from '../components/FileInput'
import { FolderPath } from '../components/FolderPath'
import { useDropZone } from '../components/FolderSelector'
import { Sidebar } from '../components/Sidebar'
import { concat, getFiles, getSize, stats } from '../lib/ipfs'
import { store } from '../lib/store'
import { MFSEntry } from '../lib/types'
import FilePage, { fileUrl, parseUrl } from './file'

function getParentUrl(pathname: string) {
  const urlpath = pathname.split('/')
  urlpath.pop()
  return urlpath.join('/') || '/'
  // let ends = pathname.lastIndexOf('/')
  // if (ends < 0) return '/'
  // return pathname.slice(0, ends)
}

export function useCurrentPath() {
  const params = useParams()
  let currentPath = concat(params.path || '', params['*'] || '')
  return parseUrl(currentPath)
}

function Home() {
  let currentPath = useCurrentPath()
  const location = useLocation()
  const [parent, setParent] = useState(getParentUrl(location.pathname))
  const [fileList, setFileList] = useState<MFSEntry[]>([])
  const [filePreview, setFilePreview] = useState<any>()
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const uploadState = store.useState((s) => s.progress)
  const [folderSize, setFolderSize] = useState<any>({})

  const { onDragOver, onDrop, onDragLeave } = useDropZone({ currentPath })

  useEffect(() => {
    // Read files on this path
    const nextParent = getParentUrl(location.pathname)
    setParent(nextParent)
    const showFiles = async () => {
      const [info, files] = await Promise.all([stats(currentPath), getFiles(currentPath)])
      console.log('files:', info, files)
      console.log('CID', files[0]?.cid.toString())
      console.log('mtime', files[0]?.mtime)
      let sizes = {}
      if (info.type === 'directory') {
        setFilePreview(undefined)
        setFileList(files)
        for (const f of files) {
          if (f.type === 'directory') {
            console.log('sizing')
            let size = await getSize(concat(currentPath, f.name))
            Object.assign(sizes, { [f.name]: size })
          } else {
            Object.assign(sizes, { [f.name]: f.size })
          }
        }
        setFolderSize(sizes)
      } else {
        setFilePreview(currentPath)
        setFileList([])
      }
    }
    showFiles()
  }, [location, currentPath])

  return (
    <div className='flex w-100'>
      <Sidebar currentPath={currentPath} />
      <div className='contents' onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
        <FolderPath currentPath={currentPath} selectedFiles={selectedFiles} />

        <div>
          {!filePreview && (
            <table className='w-100'>
              <thead>
                <tr>
                  <th>
                    <input
                      type='checkbox'
                      onClick={() => {
                        if (selectedFiles.length === fileList.length) {
                          setSelectedFiles([])
                        } else {
                          setSelectedFiles(fileList.map((f) => f.name))
                        }
                      }}
                    />
                  </th>
                  <th>Name</th>
                  <th>Type</th>
                  <th className='text-right'>Size</th>
                  <th></th>
                </tr>
              </thead>

              <tbody>
                {fileList.map((file) => {
                  return (
                    <tr key={file.name}>
                      <td>
                        <input
                          type='checkbox'
                          name={file.name}
                          checked={selectedFiles.includes(file.name)}
                          onClick={(event) => {
                            let index = selectedFiles.indexOf(file.name)
                            if (index < 0) {
                              setSelectedFiles(selectedFiles.concat(file.name))
                            } else {
                              selectedFiles.splice(index, 1)
                              setSelectedFiles(selectedFiles.slice())
                            }
                          }}
                        />
                      </td>
                      <td style={{ maxWidth: 100 }}>
                        <Link
                          className='ellipsis block file-name'
                          to={fileUrl(concat(currentPath === '/' ? '' : currentPath, file.name))}>
                          {file.name.split('.')[0]}
                        </Link>
                      </td>
                      <td className='file-type'>
                        {file.type === 'directory'
                          ? 'Folder'
                          : file.name.split('.').slice(-1)[0].toUpperCase()}
                      </td>
                      <td className='file-size'>
                        {prettyBytes(file.size || folderSize[file.name] || 0).toUpperCase()}
                      </td>
                      <td></td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}

          {filePreview && <FilePage path={filePreview} />}
        </div>
      </div>

      <div className='p4' style={{ minWidth: 250 }}>
        <FileInput currentPath={currentPath} />

        {uploadState > 0 && uploadState <= 100 && (
          <progress className='w-100' value={uploadState} />
        )}
      </div>
    </div>
  )
}

export default Home

/**
 * Function that will add all selected file and folder paths to the folderPaths array
 * @param fileList - Will click all the checkboxes in the current directory.
 */
function handleSelectAll(fileList: any) {
  // TODO: Rework this function so that it gets all the files that need to be deleted instead of just the files in fileList
  for (let i = 0; i < fileList.length; i++) {
    const element = document.getElementsByName(fileList[i].name)
    element[0].click()
  }
}
