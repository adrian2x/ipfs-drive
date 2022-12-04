import React from 'react'
import { concat, removeFolder } from '../lib/ipfs'

/**
 *
 * @description - Function that removes an array of folders and files from the IPFS network
 * @param folder_paths - Array of paths to folders to be removed
 */
async function folderRemoveOnClick(currentPath: string, folder_paths: string[]) {
  for (let i = 0; i < folder_paths.length; i++) {
    await removeFolder(concat(currentPath, folder_paths[i]))
    console.log('Removed ', folder_paths[i])
  }
  window.location.reload()
}

export function FolderRemove({
  currentPath,
  folderPaths
}: {
  currentPath: string
  folderPaths: string[]
}) {
  return (
    <div>
      <button
        className='outline secondary'
        disabled={folderPaths.length < 1}
        onClick={() => folderRemoveOnClick(currentPath, folderPaths)}>
        Remove
      </button>
    </div>
  )
}
