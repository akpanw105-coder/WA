
'use client'

import { useEffect, useReducer } from 'react'

const WORDS = [
  'Problem-Solver',
  'Resourceful',
  'Innovative',
  'Reliable',
  'Solution-Driven',
]

const INTERVAL_MS = 2800
const TRANSITION_MS = 380

type State = { index: number; phase: 'visible' | 'exit' | 'enter' }
type Action = 'tick'

function reducer(state: State, action: Action): State {
  if (action === 'tick') {
    if (state.phase === 'visible') return { ...state, phase: 'exit' }
    if (state.phase === 'exit') return { index: (state.index + 1) % WORDS.length, phase: 'enter' }
    if (state.phase === 'enter') return { ...state, phase: 'visible' }
  }
  return state
}

/**
 * RotatingText
 *
 * Cycles through a list of words with a smooth slide-up / fade transition.
 * The outer container has a fixed height so surrounding layout never shifts.
 * Respects `prefers-reduced-motion` — shows a static word when enabled.
 */
export default function RotatingText() {
  const [state, dispatch] = useReducer(reducer, { index: 0, phase: 'visible' })

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    // visible → wait INTERVAL → start exit → wait TRANSITION → enter → wait TRANSITION → visible
    let timer: ReturnType<typeof setTimeout>

    if (state.phase === 'visible') {
      timer = setTimeout(() => dispatch('tick'), INTERVAL_MS)
    } else if (state.phase === 'exit') {
      timer = setTimeout(() => dispatch('tick'), TRANSITION_MS)
    } else if (state.phase === 'enter') {
      timer = setTimeout(() => dispatch('tick'), TRANSITION_MS)
    }

    return () => clearTimeout(timer)
  }, [state.phase])

  const styles: React.CSSProperties = {
    display: 'inline-block',
    opacity: state.phase === 'exit' ? 0
      : state.phase === 'enter' ? 0
        : 1,
    transform: state.phase === 'exit' ? 'translateY(-6px)'
      : state.phase === 'enter' ? 'translateY(6px)'
        : 'translateY(0)',
    transition: `opacity ${TRANSITION_MS}ms cubic-bezier(0.16,1,0.3,1), transform ${TRANSITION_MS}ms cubic-bezier(0.16,1,0.3,1)`,
  }

  return (
    /* Fixed-height inline-flex wrapper so surrounding text never reflows and sits on the same baseline */
    <span
      className="inline-flex items-baseline overflow-hidden"
      style={{ height: '1.25em' }}
      aria-live="polite"
      aria-atomic="true"
    >
      <span style={styles} className="text-foreground font-semibold whitespace-nowrap leading-[1.25em]">
        {WORDS[state.index]}
      </span>
    </span>
  )
}


