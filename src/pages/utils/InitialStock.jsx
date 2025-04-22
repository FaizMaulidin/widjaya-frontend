import React, { useState, useRef, useEffect } from 'react'
import SurePop from './SurePop'
import CartInitial from './CartInitial'
import axios from 'axios'
import Loading from '../../components/Loading'

const Initial = ({setInitialStock, fetchStock, stock}) => {
    const [sureRemove, setSureRemove] = useState(false)
    const [surePop, setSurePop] = useState(false)
    const [surePopSubmit, setSurePopSubmit] = useState(false)
    const [sureSubmit, setSureSubmit] = useState(false)
    const [saving, setSaving] = useState(false)
    const [popQty, setPopQty] = useState('')
    const [priceNew, setPriceNew] = useState('')
    const [cart, setCart] = useState([])
    
    const invalid = useRef()
    const newBlank = useRef()
    const newExist = useRef()
    
    const handleClear = async() => {
        if(!sureRemove && cart.length > 0){
            setSurePop(true)
            setSureRemove(true)
        } else {
            await axios.delete(import.meta.env.VITE_DB_ENDPOINT + 'cart/initial')
            setSurePop(false)
            setPopQty('clear')
            setSureRemove(false)
        }
    }

    const handleSubmit = async(e) => {
        if(cart.length > 0){
            if(sureSubmit){
                try {
                    setSurePopSubmit(false)
                    setSureSubmit(false)
                    setSaving(true)
                    await axios.post(`${import.meta.env.VITE_DB_ENDPOINT}stock`, cart)
                } catch (error) {
                    console.error(error)
                } finally{
                    await axios.put(import.meta.env.VITE_DB_ENDPOINT + 'cart/initial/clear')
                    setSaving(false)
                    fetchStock()
                    setInitialStock(false)
                }
            } else {
                setSurePopSubmit(true)
                setSureSubmit(true)
            }
        } else{
            e.target.classList.remove('hover:bg-defbluehov')
            e.target.classList.replace('bg-defblue', 'bg-red-600')
            invalid.current.classList.replace('opacity-0', 'opacity-100')
            setTimeout(() => {
                e.target.classList.add('hover:bg-defbluehov')
                e.target.classList.replace('bg-red-600', 'bg-defblue')
                invalid.current.classList.replace('opacity-100', 'opacity-0')
            }, 2000);
        }
    }

    const handleChangeNewPrice = (e) => {
        if (!e.target.value){
            setPriceNew('')
        } else {
            const next = e.target.value.split(',').join('')
            setPriceNew(parseInt(next))
        }
    }

    const handleAddNew = async(e) => {
        e.preventDefault()
        const target = e.target
        let isValid = true
        if (!target[0].value || !target[1].value || !target[2].value || !target[3].value || !target[5].value){
            newBlank.current.classList.add('opacity-100')
            setTimeout(() => {
                newBlank.current.classList.remove('opacity-100')
            }, 2000);
            isValid = false
        }
        const codeExistStock = stock.filter(item => item.code===target[1].value).length > 0
        const codeExistCart = cart.filter(item => item.code===target[1].value).length > 0
        if(codeExistCart || codeExistStock){
            target[1].value = ''
            target[1].classList.add('border-red-600')
            newExist.current.classList.replace('opacity-0', 'opacity-100')
            newExist.current.classList.replace('scale-0', 'scale-100')
            setTimeout(() => {
                target[1].classList.remove('border-red-600')
                newExist.current.classList.replace('opacity-100', 'opacity-0')
                newExist.current.classList.replace('scale-100', 'scale-0')
            }, 2000);
            isValid = false
        }
        if(isValid){
            const data = {
                code: target[1].value,
                item: target[0].value,
                brand: target[2].value,
                qty: target[3].valueAsNumber,
                price: parseInt(target[5].value.split(',').join('')),
                threshold: target[4].valueAsNumber ?? 0
            }
            try {
                await axios.post(import.meta.env.VITE_DB_ENDPOINT + 'cart/initial', data)
            } catch (error) {
                console.error(error)
            } finally {
                setPopQty('Added New Item = ' + data.code)
                setPriceNew('')
                target.reset()
            }
        }
    }

    return (
        <div className=' absolute top-0 left-0 flex w-full h-screen justify-center items-center bg-blackop z-10 text-black'>
            <div className=' bg-white h-5/6 w-5/6 rounded-lg p-6 flex flex-col'>
                <div className=' flex justify-between border-b-2 border-grayborder pb-4'>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-4xl font-bold text-defblue'>Add Initial Stock</h1>
                        <h3 className=' text-sm font-medium'>Set the initial stock level for each product to maintain accurate inventory tracking.</h3>
                    </div>
                    <button onClick={() => setInitialStock(false)} className='font-semibold h-8 w-8 text-lg rounded-full border-[2px] border-black opacity-70'>X</button>
                </div>
                <div className=' flex-grow w-full mt-4 flex overflow-hidden'>
                    <div className='w-3/5 border-r-2 border-grayborder flex flex-col gap-3 pr-6 relative'>
                        <form onClick={e => e.stopPropagation()} onSubmit={handleAddNew} className=' h-full w-full bg-white rounded-md p-4 flex flex-col text-sm gap-2 justify-between'>
                            <div className=' flex flex-col gap-2'>
                                <div className='flex flex-col gap-1'>
                                    <label htmlFor="item">Item Name:</label>
                                    <input placeholder='' type="text" id='item' className='outline-none border border-grayborder rounded py-1 w-full px-2' />
                                </div>
                                <div className='flex items-center gap-2'>
                                    <div className='flex flex-col gap-1 relative w-4/6'>
                                        <label htmlFor="code">Code:</label>
                                        <input placeholder='' type="text" id='code' className='outline-none border border-grayborder rounded py-1 w-full px-2' />
                                        <p ref={newExist} className=' absolute bottom-1.5 left-2 text-red-600 opacity-0 scale-0 transition-opacity text-xs text-nowrap'>Code is already in cart/stock</p>
                                    </div>
                                    <div className='flex flex-col gap-1 flex-grow'>
                                        <label htmlFor="brand">Brand:</label>
                                        <input placeholder='' type="text" id='brand' className='outline-none border border-grayborder rounded py-1 w-full px-2' />
                                    </div>
                                </div>
                                <div className=' flex gap-2 items-center'>
                                    <div className='flex flex-col gap-1 w-24'>
                                        <label htmlFor="qty">Quantity:</label>
                                        <input placeholder='0' type="number" min={0} id='qty' className='outline-none border border-grayborder rounded py-1 w-full px-2' onInvalid={e => e.target.classList.add('border-red-600')} />
                                    </div>
                                    <div className='flex flex-col gap-1 flex-grow'>
                                        <label htmlFor="qty">Quantity Threshold:</label>
                                        <input placeholder='0' defaultValue={0} type="number" id='qtythreshold' className='outline-none border border-grayborder rounded py-1 w-full px-2'/>
                                    </div>
                                    <div className='flex flex-col gap-1 relative flex-grow'>
                                        <label htmlFor="price">Purchase Price:</label>
                                        <input placeholder='0' type="text" id='price' className='outline-none border border-grayborder rounded py-1 w-full text-right pr-2' value={priceNew.toLocaleString()} onChange={handleChangeNewPrice}/>
                                        <p className=' absolute bottom-1.5 left-2 text-black'>Rp</p>
                                    </div>
                                </div>
                            <p ref={newBlank} className=' text-red-600 text-xs opacity-0 transition-all'>All the fields above cannot be blank.</p>
                            </div>
                            <div className='flex justify-end gap-2'>
                                <button onClick={(e) => {e.stopPropagation(); setPriceNew('')}} className='rounded px-4 py-1 border border-grayborder transition-all hover:bg-neutral-100' type='reset'>Clear</button>
                                <button className='rounded px-4 py-1 text-white font-medium bg-defblue transition-all hover:bg-defbluehov' type='submit'>Add to cart</button>
                            </div>
                        </form>
                    </div>
                    <div className=' w-2/5 flex flex-col gap-2 pl-6 justify-between overflow-hidden'>
                        <div className=' flex justify-between'>
                            <h1 className=' font-semibold text-xl text-defblue'>Initial Stock Cart</h1>
                            <button onClick={handleClear} className='rounded px-2 py-1 text-white bg-defblue hover:bg-defbluehov text-xs transition-all'>Clear cart</button>
                        </div>
                        <div className='w-full flex-grow shadow-inner rounded flex flex-col justify-between overflow-hidden relative'>
                            <CartInitial cart={cart} setCart={setCart} popQty={popQty}/>
                            <SurePop text={"Are you sure you want to clear all items from the cart?"} surePop={surePop} setSurePop={setSurePop} setSure={setSureRemove} yesNclose={handleClear}/>
                            <SurePop text={"Are you sure you want to save all the items to the stock inventory?"} surePop={surePopSubmit} setSurePop={setSurePopSubmit} setSure={setSureSubmit} yesNclose={handleSubmit}/>
                        </div>
                        <h3 ref={invalid} className='text-xs text-red-600 opacity-0 text-center transition-opacity'>Cart cannot be blank.</h3>
                        <button onClick={handleSubmit} className='h-9 bg-defblue rounded text-white font-medium flex justify-center items-center hover:bg-defbluehov transition-all'>{saving ? <Loading borderClass={" border-t-white border-neutral-300"} sizeClass={'w-[1.39rem] py-0'} /> : "Save Initial Stock"}</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Initial