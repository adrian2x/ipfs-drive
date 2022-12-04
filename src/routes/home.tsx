import { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { FileInput } from '../components/FileInput'
import { NewFolder } from '../components/NewFolder'
import { FolderSelector } from '../components/FolderSelector'
import { concat, getFiles, stats } from '../lib/ipfs'
import { MFSEntry } from '../lib/types'
import FilePage, { fileUrl, parseUrl } from './file'
import { FolderRemove } from '../components/FolderRemove'

function getParentUrl(pathname: string) {
  const urlpath = pathname.split('/')
  urlpath.pop()
  return urlpath.join('/') || '/'
  // let ends = pathname.lastIndexOf('/')
  // if (ends < 0) return '/'
  // return pathname.slice(0, ends)
}

function Home() {
  const params = useParams()
  let currentPath = concat(params.path || '', params['*'] || '')
  currentPath = parseUrl(currentPath)
  console.log('params', params, currentPath)
  const location = useLocation()
  const [parent, setParent] = useState(getParentUrl(location.pathname))
  const [fileList, setFileList] = useState<MFSEntry[]>([])
  const [filePreview, setFilePreview] = useState<any>()

  useEffect(() => {
    // Read files on this path
    const nextParent = getParentUrl(location.pathname)
    setParent(nextParent)
    const showFiles = async () => {
      const [info, files] = await Promise.all([stats(currentPath), getFiles(currentPath)])
      console.log('files:', info, files)
      console.log('CID', files[0].cid.toString())
      if (info.type === 'directory') {
        setFilePreview(undefined)
        setFileList(files)
      } else {
        setFilePreview(currentPath)
        setFileList([])
      }
    }
    showFiles()
  }, [location, currentPath])

  const folderPaths: string[] = []

  // <FolderAndFileDD />

  return (
    <div>
      <div>
        <NewFolder path={currentPath} />

        <FileInput path={currentPath} />

        <FolderRemove folder_paths={folderPaths} />
      </div>

      <div>
        <ul>
          <li>
            <input type='checkbox' onClick={() => handleSelectAll(fileList)} />
            <Link to={parent}>..</Link>
          </li>

          {filePreview && <FilePage path={filePreview} />}

          {fileList.map((file) => (
            <li key={file.name}>
              <input
                type='checkbox'
                name={file.name}
                onClick={(event) =>
                  handleClickCheckBoxEvent(
                    folderPaths,
                    concat(currentPath == '/' ? '' : currentPath, file.name)
                  )
                }
              />
              <Link to={fileUrl(concat(currentPath === '/' ? '' : currentPath, file.name))}>
                {file.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <FolderSelector current_path={currentPath} />
    </div>
  )
}

export default Home

/**
 * This function will add the selected file to the folderPaths array
 * @param folderPaths
 * @param file_name  - File name of the element that was checked
 */
function handleClickCheckBoxEvent(folderPaths: string[], file_name: string) {
  if (folderPaths.includes(file_name)) {
    for (let i = 0; i < folderPaths.length; i++) {
      if (folderPaths[i] === file_name) {
        folderPaths.splice(i, 1)
      }
    }
  } else {
    folderPaths.push(file_name)
  }
}

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
