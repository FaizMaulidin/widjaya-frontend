import React from 'react'

const Loading = ({sizeClass, borderClass}) => {

  return (
    <div className={'flex justify-center w-full py-8 ' + sizeClass}>
        <div className={'rounded-full aspect-square w-full max-w-8 max-h-8 bg-transparent border-[4px] border-t-graytext border-grayborder animate-spin ' + borderClass}>
        </div>
    </div>
  )
}

export default Loading