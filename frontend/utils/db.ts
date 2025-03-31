export interface IIndexedDbUtils<T extends {}> {
  set$(data: T): void
  get$(someValue: T[keyof T] | (keyof T)[]): Promise<T>
  close$(): void
  delete$(someValue: T[keyof T]): void
  getAll$(): Promise<T[]>
}

export function openIndexedDb<T extends {}>(dbName: string, keyPathPropName: keyof T, nameIndex: (keyof T)[]) {
  const open = indexedDB.open(dbName, 1)

  return new Promise<IIndexedDbUtils<T>>((resolve, reject) => {
    open.onerror = () => reject("Can't even open indexeddb")
    
    open.onupgradeneeded = () => {
      const db = open.result
      const store = db.createObjectStore(dbName, { keyPath: keyPathPropName as string })
      store.createIndex(dbName, nameIndex as string[])
    }
    
    open.onsuccess = () => {
      const db = open.result
      const tx = db.transaction(dbName, "readwrite")
      const store = tx.objectStore(dbName)
      const index = store.index(dbName)

      resolve(createIt(db, store, index))
    }
  })
}

function createIt<T extends {}>(db: IDBDatabase, store: IDBObjectStore, index: IDBIndex): IIndexedDbUtils<T> {
  return {
    set$(data: T) {
      store.put(data)
    },
    get$(someValue: T[keyof T]) {
      const theStore = Array.isArray(someValue) ? index : store
      const thisRequest = theStore.get(someValue as IDBValidKey)

      return new Promise((resolve, reject) => {
        thisRequest.onsuccess = () => resolve(thisRequest.result)
      })
    },
    getAll$() {
      const thisRequest = store.getAll()
      return new Promise((resolve, reject) => {
        thisRequest.onsuccess = () => resolve(thisRequest.result)
      })
    },
    delete$(index: T[keyof T]) {
      store.delete(index as IDBValidKey)
    },
    close$() {
      db.close()
    }
  }
}