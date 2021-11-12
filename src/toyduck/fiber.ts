import { isArray, isObject } from './common'
// this page is about vnode to fibernode

export const fiber = (vnode: any, parent = null) => {
	if (isArray(vnode)) {
		let prevSibling: any = null

		const fiberNodes = vnode.map((sigleVnode: any) => {
			const fiberNode = vnodeToFiberNode(sigleVnode, parent)
			if (prevSibling) {
				prevSibling.nextSibling = fiberNode
			}
			fiberNode.prevSibling = prevSibling
			prevSibling = fiberNode
			return fiberNode
		})

		return fiberNodes[0]
	}

	if (isObject(vnode)) {
		return vnodeToFiberNode(vnode, parent)
	}

	return null
}

const vnodeToFiberNode = (vnode: any, parent: any) => {
	const fiberNode = fiberStruct(parent)

	fiberNode.vnode = vnode

	vnodeHandler(vnode, fiberNode)

	return fiberNode
}

export const fiberStruct = (parent: any) => {
	return {
		parent,
		child: null,
		prevSibling: null,
		nextSibling: null,
		vnode: null,
		node: null,
	}
}

// if vnode have child vnode, deal with it
const vnodeHandler = (vnode: any, fiberNodeTemp: any) => {
	// if (isStateMark(vnode)) {
	// 	return
	// }

	// 如果是vnode对象，必然只有一个键值对
	const [htmlTag, htmlAttrs] = Object.entries(vnode)[0]

	// 含子元素
	if (isArray(htmlAttrs)) {
		const [attrs, ...children] = htmlAttrs as Array<any>

		fiberNodeTemp.vnode = { [htmlTag]: attrs } as any

		fiberNodeTemp.child = fiber(children, fiberNodeTemp as any)
	}
}
