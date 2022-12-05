import { Store } from 'pullstate'

export const store = new Store<any>({
  progress: 0
})

export function startUpload() {
  store.update((s) => {
    s.progress = 0
  })
}
