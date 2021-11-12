import 'virtual:windi.css'
import { App } from './App'
import { renderer } from './toyduck/component'

const root = document.querySelector('#app')

const app1 = App('hello')

const el = renderer(app1, root)

root?.append(...el)
