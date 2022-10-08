import * as React from "react"
import { getContainerSetHooks } from "iti-react"
import { appInstance } from "./_1.wiring"

export const MyAppContext = React.createContext<typeof appInstance>({} as any)

const hooks = getContainerSetHooks(MyAppContext)
export const useContainerSet = hooks.useContainerSet
export const useContainer = hooks.useContainer
