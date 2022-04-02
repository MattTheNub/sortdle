import { createContext } from 'react'
import GameState from './state'

export const StateContext = createContext(undefined as unknown as GameState)
