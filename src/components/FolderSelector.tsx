import React, { useEffect, useRef, useState } from 'react'
import { collectFiles, concat } from '../lib/ipfs'

let files: File[] = []
let files_final: any = []
let new_files: any = []
let paths: string[] = []

/**
 * Function that will call on the functions to upload directory
 * @param event Event from the callback of the onChange event.
 * @param current_path Current path that is being worked on.
 */
async function handleChange(event: any, current_path: string) {
  files_final = []
  new_files = []
  paths = []
  await handleSubmit(event, current_path)
  await collectFiles(paths, files_final, new_files)
  window.location.reload()
}

function readFile(file: File) {
  return new Promise<string | ArrayBuffer | null>((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.onload = () => {
      const result = fileReader.result
      resolve(result)
    }
    fileReader.onerror = reject
    fileReader.readAsArrayBuffer(file)
  })
}

function readFiles(currentPath: string, files: File[], data: File[]) {
  return Promise.allSettled(
    files.map((f) => {
      let path = f.name
      if (data?.length === 1 && data[0].type === '') {
        path = concat(currentPath, data[0].name)
        path = concat(path, f.name)
      } else path = concat(currentPath, f.name)
      paths.push(path)
      return readFile(f).then((result) => files_final.push(result))
    })
  )
}

async function readFileEntry(entry: FileSystemFileEntry) {
  return new Promise((resolve, reject) => {
    entry.file((file) => {
      resolve(file)
    }, reject)
  })
}

async function readDirectoryEntry(entry: FileSystemDirectoryEntry) {
  let dirReader = entry.createReader()
  return new Promise<FileSystemEntry[]>((resolve, reject) => {
    dirReader.readEntries((entries) => {
      resolve(entries)
    }, reject)
  })
}

async function processEntries(entry: FileSystemEntry, result: any[]) {
  if (entry?.isFile) {
    let file = await readFileEntry(entry as FileSystemFileEntry)
    result.push(file)
  } else if (entry?.isDirectory) {
    let entries = await readDirectoryEntry(entry as FileSystemDirectoryEntry)
    for (let k = 0; k < entries.length; k++) {
      const element = entries[k]
      await processEntries(element, result)
    }
  }
}

async function readItems(data: DataTransfer) {
  let allFiles: File[] = []
  let items = data.items
  for (let i = 0; i < items.length; i++) {
    const entry = items[i].webkitGetAsEntry()
    if (entry) {
      await processEntries(entry, allFiles)
    }
  }
  return allFiles
}

/**
 *
 * This function will get triggered once a user uploads a directory. This function will trigger the appearance of the progress bar and will collect all of the information needed for the collectFiles function to run.
 * @param event Event from the callback of the onChange event.
 * @param current_path Current path that is being worked on.
 */
async function handleSubmit(event: any, current_path: string) {
  console.log('Handling onChange')
  event.preventDefault()
  event.stopPropagation()
  let files: File[] = [],
    transferedFiles: File[] = []
  if (event.target.files) {
    files = Array.from(event.target.files)
  } else if (event.dataTransfer) {
    transferedFiles = Array.from(event.dataTransfer.files)
    files = await readItems(event.dataTransfer)
  }
  return readFiles(current_path, files, transferedFiles)
}

export function useDropZone({ currentPath }: { currentPath: string }) {
  const onDragOver = (e: any) => {
    e.preventDefault()
    e.stopPropagation()
    e.target.classList.add('is-active')
    e.dataTransfer.dropEffect = 'copy'
  }

  const onDragLeave = async (e: any) => {
    e.target.classList.remove('is-active')
  }

  const onDrop = async (e: any) => {
    e.target.classList.remove('is-active')
    await handleChange(e, currentPath)
  }

  return { onDragOver, onDrop, onDragLeave }
}

export function FolderSelector({ currentPath }: { currentPath: string }) {
  const ref = useRef<HTMLInputElement>(null)
  const [isDisabled, setDisabled] = useState(false)

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('webkitdirectory', '')
    }
  }, [ref])

  const { onDragOver, onDrop } = useDropZone({ currentPath })

  // <ProgressBar />
  return (
    <div>
      <div data-disabled={isDisabled} className='upload' onDragOver={onDragOver} onDrop={onDrop}>
        <div>Drag & drop files here</div>
        <div className='my1'>OR</div>
        <div>
          <button
            disabled={isDisabled}
            className='primary mx0'
            onClick={() => {
              ref?.current?.click()
            }}>
            Browse
          </button>
        </div>
      </div>
      <input
        type='file'
        aria-label='Select folder'
        className='hidden'
        multiple
        ref={ref}
        onChange={async (event) => {
          await handleChange(event, currentPath)
        }}
      />
    </div>
  )
}
