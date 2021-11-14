import { getInfo } from './reactive'
import { update } from './update'

interface State<T = any> {
	value: T
	set: (newVal: T) => void
}

export const createState2 = <T>(initValue: T) => {
	const set = new Set()

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

	const proxy = new Proxy<State<T>>(state, {
		get(target: any, key: any, receiver: any) {
			const info = getInfo()
			if (!set.has(info)) {
				set.add(info)
			}
			console.log(set)

			return Reflect.get(target, key, receiver)
		},
	})

	return proxy
}

type CreateState<T = any> = [
	() => T,
	(newVal: T) => void,
	(cb: (newVal: T, oldVal: T) => void) => void
]
export const createState = <T>(initValue: T): CreateState<T> => {
	const set = new Set()

	let state = initValue

	let watcher: (newVal: T, oldVal: T) => void

	const read = () => {
		const info = getInfo()
		if (!set.has(info)) {
			set.add(info)
		}
		return state
	}

	const write = (newVal: T) => {
		if (state != newVal) {
			watcher && watcher(newVal, state)

			state = newVal

			if (set.size > 0) {
				set.forEach((e) => {
					update(e)
				})
			}
		}
	}

	const watch = (watcherCallback: (newVal: T, oldVal: T) => void) => {
		watcher = watcherCallback
	}

	return [read, write, watch]
}

export const createArrayState = <T>(initValue: Array<T>): any => {
	const set = new Set()

	let state = initValue

	let watcher: (newVal: T, oldVal: T) => void

	let isTrack = true //是否收集依赖

	const read = () => {
		if (isTrack) {
			const info = getInfo()
			if (!set.has(info)) {
				set.add(info)
			}
		}

		return state
	}

	const push = (...item: T[]) => {
		isTrack = false
		state.push(...item)
		isTrack = true

		set.forEach((e: any) => {
			e.type = 'update_node_push'

			update(e)
		})
	}

	const pop = () => {
		if (state.length === 0) {
			return
		}
		isTrack = false
		state.shift()
		isTrack = true
		set.forEach((e: any) => {
			e.type = 'update_node_pop'

			update(e)
		})
	}

	const unshift = (...item: T[]) => {
		isTrack = false
		state.unshift(...item)
		console.log(state)

		isTrack = true
		set.forEach((e: any) => {
			e.type = 'update_node_unshift'

			update(e)
		})
	}

	const shift = () => {
		if (state.length === 0) {
			return
		}
		isTrack = false
		state.shift()
		isTrack = true
		set.forEach((e: any) => {
			e.type = 'update_node_shift'

			update(e)
		})
	}

	const write = { push, shift, pop, unshift }

	const watch = (watcherCallback: (newVal: T, oldVal: T) => void) => {
		watcher = watcherCallback
	}

	return [read, write, watch]
}
