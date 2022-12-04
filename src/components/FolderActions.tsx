import React from 'react'
import { FileInput } from './FileInput'
import { FolderRemove } from './FolderRemove'
import { NewFolder } from './NewFolder'

export function FolderActions({
  currentPath,
  folderPaths
}: {
  currentPath: string
  folderPaths: string[]
}) {
  return (
    <>
      <NewFolder path={currentPath} />

      <FileInput path={currentPath} />

      <FolderRemove folder_paths={folderPaths} />
    </>
  )
}
