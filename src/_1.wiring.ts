import { createContainer } from "iti"
import { A, B, C } from "./_0.business-logic"

export const appInstance = createContainer()
  .add(() => ({
    a: () => new A(),
  }))
  .add((ctx) => ({
    b: async () => new B(ctx.a),
  }))
  .add((ctx) => ({
    c: () => new C(ctx.a, ctx.b),
  }))
  .add((ctx) => ({
    test1: async () => "test",
    test2: async () => 1,
  }))
// Will fail at compile time
// because a `test2` already exists
// .add((ctx) => ({
//   test2: () => new C(ctx.a, ctx.b),
// }))
