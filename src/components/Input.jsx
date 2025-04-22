import React, { useEffect, useRef, useState } from 'react'

const Input = ({type, placeholder, refs, error}) => {
    const ref = useRef()
    const parrent = useRef()
    const handleSelect = (e) => {
        if(e.target.value){
            ref.current.classList.add('translate-y-0', 'text-sm', 'text-defblue')
            ref.current.classList.replace('top-1/2', 'top-1')
        } else{
            ref.current.classList.remove('translate-y-0', 'text-sm', 'text-defblue')
            ref.current.classList.replace('top-1', 'top-1/2')
        }
        refs.current.classList.remove('shadow-input')
        refs.current.classList.replace('border-defblue', 'border-grayborder')
    }
    const handleFocus = () => {
        refs.current.classList.add('shadow-input')
        refs.current.classList.replace('border-grayborder', 'border-defblue')
    }

  return (
    <div ref={parrent} className=' w-[28rem] text-lg relative text-graytext'>
        <input ref={refs} type={type} onBlur={handleSelect} onFocus={handleFocus} className='focus:outline-none px-4 pt-6 pb-1 w-full peer rounded-lg border border-grayborder transition-all' />
        <span ref={ref} onClick={() => refs.current.focus()} className='absolute left-4 top-1/2 -translate-y-1/2 transition-all peer-focus:top-1 peer-focus:translate-y-0 peer-focus:text-sm peer-focus:text-defblue'>{placeholder}</span>
    </div>
  )
}

export default Input