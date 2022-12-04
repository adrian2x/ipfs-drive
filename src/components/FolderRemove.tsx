import React from 'react'
import { removeFolder } from '../lib/ipfs'

/**
 *
 * @description - Function that removes an array of folders and files from the IPFS network
 * @param folder_paths - Array of paths to folders to be removed
 */
function folderRemoveOnClick(folder_paths: string[]) {
  for (let i = 0; i < folder_paths.length; i++) {
    console.log('Removing: ', folder_paths[i])
    removeFolder(folder_paths[i])
  }
  window.location.reload()
}

export function FolderRemove({ folder_paths }: { folder_paths: string[] }) {
  return (
    <div>
      <button disabled={folder_paths.length < 1} onClick={() => folderRemoveOnClick(folder_paths)}>
        Remove
      </button>
    </div>
  )
}
