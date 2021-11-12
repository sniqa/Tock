import { isObject } from './common'
import { update } from './update'

const hasOwn = (target: any, key: any) => {
	return Reflect.has(target, key)
}

const curInfo = () => {
	let info: any = null

	const setInfo = (
		curFiber: any,
		curEffect: any,
		type: any,
		curAttr = null
	) => {
		const newInfo = {
			type,
			fiber: curFiber,
			attr: curAttr,
			effect: curEffect,
		}
		info = newInfo
	}

	const getInfo = () => info
	const cleanInfo = () => {
		info = null
	}
	return {
		setInfo,
		getInfo,
		cleanInfo,
	}
}

export const { setInfo, getInfo, cleanInfo } = curInfo()

export const reactive: any = (target: any) => {
	const state = new Proxy(target, {
		get(target, key, receiver) {
			const res = Reflect.get(target, key, receiver)

			// 如果是对象，递归代理
			if (isObject(res)) return reactive(res)

			tract(target, key)

			return res
		},
		set(target, key, value, receiver) {
			const hadKey = hasOwn(target, key)
			const oldValue = target[key]
			const res = Reflect.set(target, key, value, receiver)
			if (!hadKey) {
				trigger(target, 'ADD', key)
			} else if (value !== oldValue) {
				trigger(target, 'SET', key)
			}
			return res
		},
	})

	const write = (newVal: any) => {
		Object.assign(state, newVal)
	}

	return state
}

const targetMap = new WeakMap()
// 依赖收集
const tract = (target: any, key: any) => {
	// 判断 target 对象是否收集过依赖
	let depsMap = targetMap.get(target)
	// 不存在构建
	if (!depsMap) {
		targetMap.set(target, (depsMap = new Map()))
	}

	// 判断要收集的 key 中是否收集过 effect
	let dep = depsMap.get(key)
	// 不存在则创建
	if (!dep) {
		depsMap.set(key, (dep = new Set()))
	}

	// 如果未收集过当前依赖则添加
	const info = getInfo()
	if (!dep.has(info)) {
		dep.add(info)
	}

	// cleanInfo() //清空存储
}

const stateMark = Symbol.for('$_stateMark')

export const isStateMark = (target: any) => {
	return isObject(target) && Reflect.has(target, stateMark)
}

//副作用标记函数
export const effect = (fn: Function) => {
	const createEffect = (fiber: any, type: any, attr: any) => {
		setInfo(fiber, fn, type, attr)

		return fn()
	}

	const getEffect = () => {
		return fn()
	}

	return {
		[stateMark]: true,
		getEffect,
		createEffect,
		// originEffect: fn,
	}
}

function trigger(target: any, type: any, key: any) {
	// console.log(`set value:${type}`, key)
	const depsMap = targetMap.get(target)
	if (depsMap === void 0) {
		return
	}
	// 获取已存在的Dep Set执行
	const dep = depsMap.get(key)

	if (dep !== void 0) {
		dep.forEach((e: any) => {
			update(e)
		})
	}
}
