import React, { useState } from 'react'

const SurePop = ({text, surePop, setSurePop, setSure, yesNclose}) => {

    return (
        <div className={' absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  h-full w-full flex justify-center items-center scale-0 transition-all z-10' + (surePop ? ' scale-100' : '')}>
            <div className='shadow-input px-4 py-3 flex flex-col text-xs gap-4 rounded transition-all bg-white z-20'>
                <p className=' w-64'>{text}</p>
                <div className=' flex gap-2 justify-end'>
                    <button onClick={() => {setSurePop(false); setSure(false)}} className=' border-grayborder border rounded px-2'>Cancel</button>
                    <button onClick={yesNclose} className=' bg-defblue rounded px-2 py-1 text-white'>Yes</button>
                </div>
            </div>
        </div>
    )
}

export default SurePop