// import { isArray } from './common'
import { insertAfter } from './dom'
import { setAttrs } from './render'

export const update = (info: any) => {
	const { fiber, effect, type, attr } = info

	switch (type) {
		case 'update_attr': {
			const el = fiber.node
			console.log(effect())

			if (attr === 'text') {
				el['firstChild']['data'] = effect()
				return
			}
			el[attr] = effect()

			break
		}

		case 'update_node': {
			const { node, vnode } = fiber
			const newVnode = vnode.getEffect()

			if (newVnode) {
				const [htmlTag, htmlAttrs] = Object.entries(newVnode)[0]
				const el = document.createElement(htmlTag)

				setAttrs(el, htmlAttrs, null)

				if (fiber.prevSibling) {
					const prevNode = fiber.prevSibling.node
					insertAfter(el, prevNode)
					fiber.node = [el]
				} else {
					const len = fiber.parent.node.length
					const target: HTMLElement = fiber.parent.node
					// console.log(target.p)
					fiber.node = [el]
					console.log(target.prepend(el))
				}
			} else {
				fiber.node.forEach((child) => child.remove())
			}

			// const newNode = render(fiber)

			// console.log(newNode)

			break
		}

		default: {
		}
	}
}
