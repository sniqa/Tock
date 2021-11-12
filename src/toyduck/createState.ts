import { getInfo } from './reactive'
import { update } from './update'

export let info = null

interface State<T = any> {
	value: T
	set: (newVal: T) => void
}

export const createState = <T>(initValue: T) => {
	const state: State<T> = {
		value: initValue,
		set: (newValuie: T) => {
			state.value = newValuie
			if (set.size > 0) {
				set.forEach((e: any) => {
					update(e)
				})
			}
		},
	}

	const set = new Set()

	const proxy = new Proxy<State<T>>(state, {
		get(target: any, key: any, receiver: any) {
			const info = getInfo()
			if (!set.has(info)) {
				info && set.add(info)
			}
			console.log(set)

			return Reflect.get(target, key, receiver)
		},
	})

	const get = () => proxy.value

	return [get, proxy.set] as any
}
