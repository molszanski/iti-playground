import { B } from "./_0.business-logic"
import { appInstance } from "./_1.wiring"
import { MyAppContext, useContainer } from "./_2.hooks"
import { runDisposeExample } from "./examples/0.disposing"

runDisposeExample()

const Example = () => {
  // This is an async request
  const [b, bErr] = useContainer().b
  if (!b) return null

  const text = b instanceof B ? "B" : "Not B"
  // console.log("render", b, bErr)
  return <p>Class Name: {text} </p>
}

function App() {
  return (
    <MyAppContext.Provider value={appInstance}>
      <div>
        <p>ITI example app</p>
        <Example />
      </div>
    </MyAppContext.Provider>
  )
}

export default App
