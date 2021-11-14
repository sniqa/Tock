import { isArray } from './common'
import { isComponent, renderer } from './component'
import { fiber } from './fiber'
import { isStateMark } from './reactive'

export const render = (fiberNode: any) => {
	let curFiberNode = fiberNode
	let temp: Array<any> = []

	while (true) {
		//为当前节点执行任务，并获取其子节点
		let child = fiberNodeToElement(curFiberNode, temp)

		if (child) {
			curFiberNode = child
			continue
		}

		//有兄弟节点就循环兄弟节点，没有就返回到父节点
		while (curFiberNode.nextSibling === null) {
			if (curFiberNode.parent === null) {
				return temp
			}
			curFiberNode = curFiberNode.parent
		}

		curFiberNode = curFiberNode.nextSibling
	}
}

//fiberNode 转为  htmlelement
const fiberNodeToElement = (fiberNode: any, container: any) => {
	const { vnode, child, parent } = fiberNode

	if (vnode) {
		if (isComponent(vnode)) {
			fiberNode.node = renderer(vnode, parent)

			fiberNode.node.forEach((node: any) => {
				if (parent) {
					parent.node.appendChild(node)
				} else {
					container.push(node)
				}
			})

			return child
		}

		// 如果是数组
		if (isArray(vnode)) {
			const fnode = fiber(vnode)

			fiberNode.node = render(fnode)
			fiberNode.node.forEach((node: any) => {
				if (parent) {
					parent.node.appendChild(node)
				} else {
					container.push(node)
				}
			})

			return child
		}

		// 如果是标记更新的位置
		if (isStateMark(vnode)) {
			const fnode = vnode.createEffect(fiberNode, 'update_node')

			fiberNode.node = render(fiber(fnode))
			fiberNode.node.forEach((node: any) => {
				if (parent) {
					parent.node.appendChild(node)
				} else {
					container.push(node)
				}
			})

			return child
		}

		if (typeof vnode === 'string') {
			const el = document.createTextNode(vnode)
			parent.node.appendChild(el)
			return child
		}

		const [htmlTag, htmlAttrs] = Object.entries(vnode)[0]
		const el = document.createElement(htmlTag)

		setAttrs(el, htmlAttrs, fiberNode)

		if (parent) {
			parent.node.appendChild(el)
		} else {
			container.push(el)
		}

		fiberNode.node = el
	}

	return child
}

const renderVnodeToNode = (vnode: any) => {}

// 为元素设置属性
export const setAttrs = (el: HTMLElement, attrs: any, fiberNode: any) => {
	// 如果元素的值为字符串，代表这是文本节点
	if (typeof attrs === 'string') {
		addTextNode(el, attrs)
	}

	// 如果元素值为对象，代表其含有多个属性值
	if (typeof attrs === 'object') {
		for (let attrkey in attrs) {
			const attrvalue = attrs[attrkey]

			// 如果属性对象内含有text字段，代表这是一个文本节点
			if (attrkey === 'text') {
				addTextNode(el, attrvalue)
				continue
			}

			// 如果是被标记为可以被更新的属性对象
			if (isStateMark(attrvalue)) {
				const attr = attrvalue.createEffect(fiberNode, 'update_attr', attrkey)
				setAttribute(el, attrkey, attr)
				continue
			}

			setAttribute(el, attrkey, attrvalue)
		}
	}
}

//新建文本节点
const addTextNode = (el: HTMLElement, value: any) => {
	el.firstChild ? (el.firstChild.nodeValue = value) : (el.innerText = value)
}

// 设置属性
const setAttribute = (el: HTMLElement, key: string, value: string) => {
	;(el as any)[key] = value
	// el.setAttribute(key, value)
}
