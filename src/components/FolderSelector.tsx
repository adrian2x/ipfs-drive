import * as React from 'react'
import { collectFiles } from '../lib/ipfs'

const files: File[] = []
const files_final: any = []
const new_files: any = []
const paths: string[] = []

/**
 * Function that will call on the functions to upload directory
 * @param event Event from the callback of the onChange event.
 * @param current_path Current path that is being worked on.
 */
async function handleChange(event: any, current_path: string) {
  await handleSubmit(event, current_path)
  await collectFiles(paths, files_final, new_files)
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
  for (let i = 0; i < event.target.files.length; i++) {
    const file = event.target.files[i]
    const path = '/' + current_path + '/' + file.webkitRelativePath
    files.push(file)
    paths.push(path)
  }
  for (let i = 0; i < files.length; i++) {
    const fileReader = new FileReader()
    fileReader.addEventListener(
      'load',
      () => {
        const result = fileReader.result
        files_final.push(result)
      },
      false
    )
    fileReader.readAsArrayBuffer(files[i])
  }
  console.log('Finished onChange')
}

export function FolderSelector({ current_path }: { current_path: string }) {
  const ref = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute('directory', '')
      ref.current.setAttribute('webkitdirectory', '')
    }
  }, [ref])

  // <ProgressBar />
  return (
    <div>
      <input
        type='file'
        ref={ref}
        onChange={async (event) => {
          await handleChange(event, current_path)
        }}
      />
    </div>
  )
}
