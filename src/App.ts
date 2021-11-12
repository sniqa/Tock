import { createComp } from './toyduck/component'
import { createState } from './toyduck/createState'
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

	const [s, set] = createState(true)

	const onclick = () => {
		set(!s())
	}

	const vdom = {
		div: [
			,
			{
				section: [{ className: effect(() => `${s() && 'border'}`) }, 'section'],
			},
			effect(() => s() && { div: 'Hello' }),
			{ button: [{ onclick }, { div: 'test' }] },
		],
	}

	return [vdom, { change, getVdom }]
})
