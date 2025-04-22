import axios from 'axios'
import React, { useEffect, useState } from 'react'
import ProdCartList from './ProdCartList'

const CartBatch = ({popQty, cart, setCart, popNew}) => {
    const fetchCart = async() => {
        const response = await axios.get(import.meta.env.VITE_DB_ENDPOINT + 'cart/batch')
        setCart(response.data)
    }
    useEffect(() => {
        fetchCart()
    }, [popQty, popNew])
    return (
        <div className=' w-full h-full flex flex-col'>
            <div className='flex flex-col flex-grow overflow-y-auto scroll-custom relative'>
                {cart.length > 1 && cart?.map((item, i) => {
                    if(i === cart.length - 1) return <div key={i}></div>
                    return <ProdCartList item={item} key={i} fetchCart={fetchCart} mode={'batch'}/>
                })}
            </div>
            <div className=' flex py-3 px-4 justify-between w-full border-t border-defblue font-semibold bg-white shadow-inner z-10'>
                <h1 className='flex gap-1'>Total Price:</h1>
                <h1 className='text-defblue'>Rp {cart[cart.length - 1]?.toLocaleString()}</h1>
            </div>
        </div>
    )
}

export default CartBatch