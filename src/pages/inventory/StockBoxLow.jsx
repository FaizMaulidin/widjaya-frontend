import React, { useEffect, useRef, useState } from 'react'

const StockBoxLow = ({stock}) => {

    return (
        <div className=' shadow-input rounded-sm flex flex-col overflow-hidden h-full w-32'>
            <div className=' w-full h-[45%] flex justify-center items-center flex-col gap-1 bg-red-600 text-white'>
                <h3 className=' text-xs'>Quantity:</h3>
                <h1 className=' text-3xl font-semibold'>{stock.qty}</h1>
            </div>
            <div className='flex-grow p-2 pb-3 flex flex-col justify-between text-left w-full overflow-hidden'>
                <div className=' flex flex-col'>
                    <h2 className=' text-xs font-medium'>{stock.item}</h2>
                    <h3 className=' text-xs text-neutral-400'>{stock.brand}</h3>
                </div>
                <h2 className=' text-xs text-center text-defblue font-medium w-full'>{stock.code}</h2>
            </div>
        </div>
    )
}

export default StockBoxLow