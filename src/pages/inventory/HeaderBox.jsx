import React from 'react'

const HeaderBox = ({children}) => {
  return (
    <div className='flex justify-center items-center rounded-sm bg-neutral- shadow-input bg-white w-fit'>{children}</div>
  )
}

export default HeaderBox