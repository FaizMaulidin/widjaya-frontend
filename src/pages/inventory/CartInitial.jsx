import React, { useEffect } from 'react'
import axios from 'axios'
import ProdCartList from '../cashier/ProdCartList'

const CartInitial = ({cart, setCart, popQty}) => {
    const fetchCart = async() => {
        const response = await axios.get(import.meta.env.VITE_DB_ENDPOINT + 'cart/initial')
        setCart(response.data)
    }
    useEffect(() => {
        fetchCart()
    }, [popQty])
    return (
        <div className=' w-full h-full flex flex-col'>
            <div className='flex flex-col flex-grow overflow-y-auto scroll-custom relative'>
                {cart.length > 0 && cart?.map((item, i) => {
                    return <ProdCartList item={item} key={i} fetchCart={fetchCart} mode={'initial'}/>
                })}
            </div>
        </div>
    )
}

export default CartInitial