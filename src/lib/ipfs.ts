import { memoize } from 'atomic-fns'
import { create } from 'ipfs-http-client'
import mime from 'mime/lite'

// Connect to the local address
export const ipfs = create('/ip4/127.0.0.1/tcp/5001' as any)

export async function getLinks(path: string) {
  const id = await ipfs.id()
  const links = []
  for await (const link of ipfs.ls(path)) {
    links.push(link)
  }
  return links
}

export async function getFiles(path: string = '/') {
  const id = await ipfs.id()
  const links = []
  for await (const link of ipfs.files.ls(path)) {
    links.push(link)
  }
  return links
}

export async function stats(path: string) {
  return await ipfs.files.stat(path)
}

export async function read(path: string) {
  const chunks = []
  const asyncStream = ipfs.files.read(path)

  for await (const chunk of asyncStream) {
    chunks.push(chunk)
  }

  console.log('mime', mime.getType(path))

  return new Blob(chunks, {
    type: mime.getType(path) || ''
  })
}

export function getType(path: string) {
  return mime.getType(path)
}

export async function mkdir(dir: string) {
  if (!dir) return false
  return await ipfs.files.mkdir(rootPath(dir), { parents: true })
}

export async function uploadFile(path: string, content: string | Blob | Uint8Array) {
  await ipfs.files.write(path, content, {
    create: true
  })
}

/**
 * This will remove the path from the ipfs network recursively
 * @param path - Path of the folder to be removed
 */
export async function removeFolder(path: string) {
  await ipfs.files.rm(path, { recursive: true })
}

export function concat(path: string, other: string) {
  if (!path) {
    if (other.startsWith('/')) return other
    return '/' + other
  }
  if (path && !path?.startsWith('/')) path = '/' + path
  if (other && !other.startsWith('/') && !path.endsWith('/')) other = '/' + other
  return path + other
}

export function rootPath(path: string) {
  if (!path) return '/'
  if (path.startsWith('/')) return path
  return '/' + path
}

/**
 * This function will add the destination path reference to the given hash path.
 * @param {string} hash_path Hash path of file that is being worked on.
 * @param {string} destination_path Destination path to be added for reference to the file.
 */
export async function reflect_changes(hash_path: string, destination_path: string) {
  const ipfs_path = hash_path
  const parent_path = destination_path.split('/').slice(0, -1).join('/')
  await ipfs.files.mkdir(parent_path, { parents: true })
  const response = await ipfs.files.cp(ipfs_path, destination_path)
  return response
}

/**
 * This function will take in the specified parameters and add the files to the IPFS network.
 * @param paths An array of file paths to be added to the IPFS network.
 * @param files  An array of arraybuffers to be added to the IPFS network.
 * @param new_files An array of objects that include the file path, the file content, and file hash.
 */
export async function collectFiles(paths: string[], files: any, new_files: any) {
  console.log('Collecting Files...')
  // console.log("Paths: ", paths, typeof paths)
  // console.log("Files: ", files, typeof files)
  // console.log("New Files: ", new_files, typeof new_files)
  for (var i = 0; i < files.length; i++) {
    var percentage_done = (i / (new_files.length + files.length)) * 100
    const hash = await ipfs.add(files[i])
    // /ipfs/ is used before the hash.path below to avoid Uncaught (in promise) HTTPError: paths must start with a leading slash and core.js:103 Uncaught (in promise) HTTPError: cp: cannot get node from path /QmR45jDa5GvaLXVpRs5eXG4GZCQ9woD1UpmogT35UQ8xtb: file does not exist
    const file = {
      content: files[i],
      path_name: paths[i],
      hash: '/ipfs/' + hash.path
    }

    console.log('Percent Uploaded: ', percentage_done.toString() + '%')
    new_files.push(file)
  }

  console.log('Files Collected... Reflecting Changes...')
  for (var i = 0; i < new_files.length; i++) {
    const destination_path = new_files[i].path_name
    const hash_path = new_files[i].hash
    await reflect_changes(hash_path, destination_path)
    var percentage_done = ((i + files.length) / (new_files.length + files.length)) * 100
    console.log('Percent Uploaded: ', percentage_done.toString() + '%')
  }
  // window.location.reload()
}

export const walk = memoize(async function walk(path = '', name = '') {
  let files = await getFiles(path)
  let nested = {
    name,
    path,
    subdirs: [] as any[]
  }
  for (const f of files) {
    if (f.type === 'directory') {
      let subPath = concat(path, f.name)
      console.log(subPath)
      let result = await walk(subPath, f.name)
      nested.subdirs.push({
        name: f.name,
        path: subPath,
        subdirs: result.subdirs
      })
    }
  }
  return nested
})
