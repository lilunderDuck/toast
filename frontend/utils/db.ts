export function createIndexedDb(dbName: string) {
  const openRequest = indexedDB.open(dbName)

  return new Promise<IDBDatabase>((resolve, reject) => {
    openRequest.onupgradeneeded = (changeEvent) => {
      resolve(changeEvent.target!.result as IDBDatabase)
    }
  
    openRequest.onerror = (event) => {
      reject("Why didn't you allow my web app to use IndexedDB?!")
    }
  })
}

export interface IDBObjectMapping {
  name$: string
  unique$?: boolean
}

export function createDbObjectStore(db: IDBDatabase, name: string, mapping: IDBObjectMapping[]) {
  const objStore = db.createObjectStore(name, {
    keyPath: 'ssn'
  })

  for (const map of mapping) {
    objStore.createIndex(map.name$, map.name$, {
      unique: map.unique$
    })
  }

  return new Promise<IDBObjectStore>((resolve, reject) => {
    objStore.transaction.oncomplete = () => {
      // Store values in the newly created objectStore.
      const thisObjectStore = db
        .transaction(name, "readwrite")
        .objectStore(name)
      // ...

      resolve(thisObjectStore)
    }

    objStore.transaction.onerror = (event) => {
      reject("Could not create obj store")
    }
  })
}