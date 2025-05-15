import React, { useEffect, useRef, useState } from 'react'
import { animate, createScope, createSpring } from 'animejs'

const Animate = ({text}) => {
    const scope = useRef()
    const root = useRef()
    useEffect(() => {
        scope.current = createScope({ root }).add(self => {
            animate('.test', {
                skewY: { from: '15deg', delay: 300 },
                y: {from: '100%' },
                ease: createSpring({stiffness: 40})
            })
        })
        return () => scope.current.revert()
    }, [])
    return (
        <div ref={root} className='w-fit h-fit overflow-hidden pt-1'>
            <p className='test origin-top-left'>{text}</p>
        </div>
    )
}

export default Animate