// import { isArray } from './common'
import { isArray } from './common'
import { insertAfter } from './dom'
import { setAttrs } from './render'

export const update = (info: any) => {
	const { fiber, effect, type, attr } = info

	switch (type) {
		case 'update_attr': {
			const el = fiber.node

			el[attr] = effect()

			break
		}

		case 'update_node': {
			const { vnode } = fiber
			const newVnode = vnode.getEffect()

			if (newVnode) {
				const [htmlTag, htmlAttrs] = Object.entries(newVnode)[0]
				const el = document.createElement(htmlTag)

				setAttrs(el, htmlAttrs, null)

				if (fiber.prevSibling) {
					// const last = fiber.prevSibling.node.length - 1

					const prevNode = fiber.prevSibling.node

					if (isArray(prevNode)) {
						insertAfter(el, prevNode[0])
					}
					insertAfter(el, prevNode)
					fiber.node = [el]
				} else {
					// const len = fiber.parent.node.length
					const target: HTMLElement = fiber.parent.node
					// console.log(target.p)
					fiber.node = [el]
					console.log(target.prepend(el))
				}
			} else {
				fiber.node.forEach((child: HTMLElement) => child.remove())
			}

			// const newNode = render(fiber)

			// console.log(newNode)

			break
		}

		case 'update_node_push': {
			Array.prototype.map = function (fn) {
				var newArr = []
				for (var i = 0; i < this.length; i++) {
					if (i != this.length - 1) {
						continue
					}
					newArr.push(fn(this[i], i, this))
				}
				return newArr
			}

			const diff = effect()

			diff.forEach((vnode) => {
				const [htmlTag, htmlAttrs] = Object.entries(vnode)[0]
				const el = document.createElement(htmlTag)

				setAttrs(el, htmlAttrs, null)
				const last = fiber.node.length - 1

				insertAfter(el, fiber.node[last])
				fiber.node = [...fiber.node, el]
			})

			// parent.appendChild()
			break
		}

		case 'update_node_shift': {
			// const parent = fiber.node[0].parentNode

			const target = fiber.node.shift()

			target.remove()
			break
		}
		case 'update_node_pop': {
			const target = fiber.node.pop()

			target.remove()
			break
		}
		case 'update_node_unshift': {
			// Array.prototype.map = function (fn) {
			// 	var newArr = []
			// 	const first = fn(this[0], 0, this)

			// 	newArr.push(first)

			// 	for (var i = 1; i < this.length; i++) {
			// 		if (fn(this[i], i, this) === fiber.node[1]) {
			// 			return newArr
			// 		}

			// 		newArr.push(fn(this[i], i, this))
			// 	}

			// 	return newArr
			// }

			const diff = effect()

			diff.forEach((vnode, index) => {
				const [htmlTag, htmlAttrs] = Object.entries(vnode)[0]
				const el = document.createElement(htmlTag)

				setAttrs(el, htmlAttrs, null)

				const target = fiber.node[0]
				if (index >= 1) {
					;(fiber.node[index] as HTMLElement).remove()

					insertAfter(el, fiber.node[index - 1])
					fiber.node[index] = el
				} else {
					fiber.node = [el, ...fiber.node]
					target.parentNode.insertBefore(el, target)
				}
			})

			break
		}

		default: {
		}
	}
}
