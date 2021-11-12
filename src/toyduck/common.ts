export const isObject = (target: any) => {
	return typeof target === 'object' && target != null
}

export const isArray = (target: any) => Array.isArray(target)
