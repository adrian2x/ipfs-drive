import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { walk } from '../lib/ipfs'
import { NewFolder } from './NewFolder'

type Folder = {
  name: string
  path: string
  subdirs: Folder[]
  open?: boolean
}

export function Sidebar({ currentPath }: { currentPath: string }) {
  const [tree, setTree] = useState<Folder>()

  useEffect(() => {
    async function loadTree() {
      const tree = await walk('/')
      setTree(tree)
    }
    loadTree()
  }, [])

  let content = []

  if (tree) {
    content.push(
      <TreeView
        key={tree.path}
        currentPath={currentPath}
        name={tree.name}
        path={tree.path}
        subdirs={tree.subdirs}
        open
      />
    )
  }

  return (
    <aside className='sidebar p4' style={{ minWidth: 250 }}>
      <NewFolder path={currentPath} />
      <div className='tree'>{content}</div>
    </aside>
  )
}

export function TreeView({
  name,
  path,
  subdirs,
  open,
  currentPath
}: Folder & {
  open?: boolean
  currentPath: string
}) {
  return (
    <ul key={path}>
      <li>
        <details open={open || currentPath.includes(path)}>
          <summary>
            <Link to={path}>{name || 'Drive'}</Link>
          </summary>
          {subdirs?.length > 0 &&
            subdirs.map((dir) => (
              <TreeView
                key={dir.path}
                name={dir.name}
                path={dir.path}
                subdirs={dir.subdirs}
                currentPath={currentPath}
              />
            ))}
        </details>
      </li>
    </ul>
  )
}
