import { createComp } from './toyduck/component'
import { createArrayState, createState } from './toyduck/createState'
import { effect } from './toyduck/reactive'

export const App = createComp((fnset) => {
	const { props } = fnset

	const change = () => {}

	const getVdom = () => {
		return vdom
	}

	// const state = reactive({
	// 	isShow: true,
	// })

	// const state = createState(true)

	const [state, setState] = createState(true)

	const [arr, setArr] = createArrayState(['HELLO', 'WORLD'])

	const onpush = () => {
		setArr.push('this is push')
	}
	const onpop = () => {
		setArr.pop()
	}
	const onshift = () => {
		setArr.shift()
	}
	const onunshift = () => {
		setArr.unshift('this is push')
	}

	const vdom = {
		div: [
			,
			{
				section: [
					{ className: effect(() => `${state() && 'border'}`) },
					'section',
				],
			},
			effect(() => state() && { div: 'Hello1' }),
			effect(() => state() && { div: 'Hello2' }),
			effect(() =>
				arr().map((str, index) => {
					return {
						div: str + ' ' + index,
					}
				})
			),
			{
				div: [
					{ className: 'flex flex-col' },
					{
						button: [
							{ onclick: onpush, className: 'border p-2 m-2' },
							{ div: 'push' },
						],
					},
					{
						button: [
							{ onclick: onpop, className: 'border p-2 m-2' },
							{ div: 'pop' },
						],
					},
					{
						button: [
							{ onclick: onunshift, className: 'border p-2 m-2' },
							{ div: 'unshift' },
						],
					},
					{
						button: [
							{ onclick: onshift, className: 'border p-2 m-2' },
							{ div: 'shift' },
						],
					},
				],
			},
		],
	}

	return [vdom, { change, getVdom }]
})
