import { isObject } from './common'
import { fiber } from './fiber'
import { render } from './render'

interface Opreate<T> {
	createState: () => void
	createRef: () => void
	props: T
}

export const $_isComponent = Symbol.for('TockComponent')
export const $_renderder = Symbol.for('TockRenderer')

export const isComponent = (target: any) => {
	return isObject(target) && Reflect.has(target, $_isComponent)
}

export const renderer = (target: any, parent: any) => {
	return isObject(target) && Reflect.get(target, $_renderder)(parent)
}

const componentPrototype = (render: () => any) => ({
	[$_isComponent]: true,
	[$_renderder]: render,
})

export const createComp = <T = any, K = any>(
	fn: (obj: Opreate<T>) => [any, K]
) => {
	const component = (...props: any) => {
		const createState = () => {}

		const createRef = () => {}

		const [vnode, opraFn] = fn({
			createRef,
			createState,
			props,
		})

		const $_render = () => {
			const fiberNode = fiber(vnode)

			const node = render(fiberNode)

			return node
		}

		const prototype = componentPrototype($_render)

		return Object.assign(Object.create(prototype), opraFn) as K
	}

	return component
}
