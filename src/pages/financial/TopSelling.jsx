import React from 'react'

const TopSelling = ({item}) => {
  return (
    <div className=' w-fit h-full flex flex-col items-center font-medium text-graytext'>
        <p className='font-semibold text-center text-sm'>{item.item}({item.brand})</p>
        <div className='flex flex-col flex-grow items-center justify-center text-blackop'>
            <h2 className='text-3xl text-green-600 font-bold  max-w-52'>Rp{item.rev.toLocaleString()}</h2>
            <p>Revenue Generated</p>
        </div>
        <div className=' flex gap-0.5 items-end'>
            <h3 className='text-2xl leading-[1.2rem] font-semibold'>{item.qtySold}</h3>
            <p className='leading-none text-blackop '>Qty Sold</p>
        </div>
    </div>
    )
}

export default TopSelling