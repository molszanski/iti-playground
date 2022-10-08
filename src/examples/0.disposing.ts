import { createContainer } from "iti"
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
class DB {
  public connected = false
  public id: string
  constructor() {
    this.id = Math.random().toString(36).substring(2, 4)
    console.log(`db[${this.id}]: creating new db instance`)
  }
  async connect() {
    console.log(`db[${this.id}]: connecting`)
    await wait(10)
    this.connected = true
    console.log(`db[${this.id}]: connected`)
  }
  async disconnect() {
    console.log(`db[${this.id}]: disconnecting`)
    await wait(20)
    this.connected = false
    console.log(`db[${this.id}]: disconnected`)
  }
}
export class A {
  constructor() {
    console.log("a: creating new A instance")
  }
}
export class B {
  constructor(dbConn: DB) {
    console.log("b: creating new B instance")
    console.log("b: db connected? --> ", dbConn.connected)
  }
}

let container = createContainer()
  .add({
    db: async () => {
      const db = new DB()
      await db.connect()
      return db
    },
  })
  .add((ctx) => ({
    a: () => new A(),
    b: async () => new B(await ctx.db),
  }))
  .addDisposer((ctx) => ({
    a: () => console.log("disposer[A]: disposing a"),
    b: () => console.log("disposer[B]: disposing b"),
    //    ↓ `db` is a resolved value of a `DB`
    db: (db) => {
      // We can access all values via ctx
      ctx.db.then((db) => {
        console.log("disposer[db]: accessing db[" + db.id + "] via async ctx")
      })
      console.log("disposer[db]: db id: ", db.id)

      // We can also access the value directly
      const disconnectPromise = db.disconnect()
      return disconnectPromise
    },
  }))

export async function runDisposeExample() {
  console.log("runDisposeExample: starting")
  container.get("b")
  await container.disposeAll()
  console.log("runDisposeExample: everything should be clear")

  // requesting db will create a new instance, because it was disposed
  const newDb = await container.get("db")
  console.log("runDisposeExample: new db instance created: ", newDb.id)
  container.dispose("db")
}

/**
Sample output:

runDisposeExample: starting
db[p5]: creating new db instance
db[p5]: connecting
db[p5]: connected

b: creating new B instance
b: db connected? -->  true

disposer[db]: db id:  p5
db[p5]: disconnecting
disposer[B]: disposing b
disposer[db]: accessing db[p5] via async ctx
db[p5]: disconnected

runDisposeExample: everything should be clear


db[qv]: creating new db instance
db[qv]: connecting
db[qv]: connected
runDisposeExample: new db instance created:  qv
disposer[db]: db id:  qv
db[qv]: disconnecting
disposer[db]: accessing db[qv] via async ctx
db[qv]: disconnected

 */
