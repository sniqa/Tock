export const insertAfter = (node: HTMLElement, target: HTMLElement) => {
	const parent = target.parentNode

	if (target.nextSibling) {
		parent?.insertBefore(node, target.nextSibling)
	} else {
		parent?.appendChild(node)
	}
}
