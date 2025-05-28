import axios from 'axios'
import React, { useEffect, useRef, useState } from 'react'

const StockBoxCashier = ({stock, popQty, setPopQty, cart, batchSelected, setBatchSelected}) => {
    const [pricePop, setPricePop] = useState('')
    const isPopQty = popQty === stock.code
    const zero = useRef()
    const already = useRef()
    const exceedQty = useRef()
    const batchInfo = JSON.parse(stock.batch_info)

    useEffect(() => {
        setPricePop('')
        if(isPopQty){
            setBatchSelected(batchInfo[0].batch)
        }
    }, [popQty])

    const handleSubmit = async(e) => {
        e.preventDefault()
        e.stopPropagation()
        if ((!e.target[0].value || !e.target[1].value)){
            zero.current.classList.add('opacity-100')
            setTimeout(() => {
                zero.current.classList.remove('opacity-100')
            }, 2000);
        }else {
            const thisBatch = typeof(batchSelected) === "number" ? batchSelected : 0
            const codeExist = cart.filter(item => (item.code === stock.code) && (item.batch === thisBatch)).length
            const itemBatch = batchInfo.filter(batch => batch.batch === batchSelected)[0]
            if(!codeExist){
                if (e.target[0].valueAsNumber > itemBatch.qty){
                    exceedQty.current.classList.add('opacity-100')
                    setTimeout(() => {
                        exceedQty.current.classList.remove('opacity-100')
                    }, 3000);
                } else {
                    try {
                        const data = {
                            code: stock.code,
                            item: stock.item,
                            brand: stock.brand,
                            qty: e.target[0].valueAsNumber,
                            price: parseInt(e.target[1].value.split(',').join('')),
                            purchPrice: itemBatch.price,
                            batch: thisBatch
                        }
                        await axios.post(import.meta.env.VITE_DB_ENDPOINT + 'cart/cashier', data)
                        setPopQty('submit')
                    } catch (error) {
                        console.error(error)
                    }
                }
            } else {
                already.current.classList.add('opacity-100')
                setTimeout(() => {
                    already.current.classList.remove('opacity-100')
                }, 2000)
            }
        }
    }

    const handleChange = (e) => {
        const next = e.target.value.split(',').join('')
        if (!e.target.value){
            setPricePop('')
        } else {
            setPricePop(parseInt(next))
        }
    }

    return (
        <div onClick={() => {setPopQty(stock.code)}} className=' shadow-input h-56 rounded-sm flex flex-col overflow-hidden hover:shadow-defblue transition-all cursor-pointer bg-white'>
            <div className=' w-full h-[55%] flex justify-center items-center flex-col gap-3 bg-defblue text-white'>
                <h3 className=' text-xs'>Quantity:</h3>
                <h1 className=' text-4xl font-semibold'>{stock.qty}</h1>
            </div>
            <div className='flex-grow p-2 pb-3 flex flex-col justify-between text-left w-full overflow-hidden'>
                <div className=' flex flex-col'>
                    <h2 className=' text-sm font-medium'>{stock.item}</h2>
                    <h3 className=' text-xs text-neutral-400'>{stock.brand}</h3>
                </div>
                <h2 className=' text-xs text-center text-defblue font-medium w-full'>{stock.code}</h2>
            </div>
            { isPopQty &&
                <div className=' absolute top-0 left-0 w-full h-full z-20 flex justify-center items-center cursor-default'>
                    <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit} className=' h-[60%] w-4/6 bg-white border border-grayborder rounded-md shadow-popup p-4 pb-3 flex flex-col text-sm justify-between gap-2'>
                        <h1 className=' font-semibold text-base'>{stock.item} ({stock.brand})</h1>
                        <div className=' flex items-center gap-2 w-full'>
                            <div className='flex flex-col w-2/5'>
                                <label htmlFor="qty">Quantity: </label>
                                <input autoFocus min={0} placeholder='0' type="number" id='qty' className='outline-none border border-grayborder rounded px-2 py-1'/>
                            </div>
                            <div className=' flex flex-col flex-grow'>
                                <label htmlFor="price">Selling Price: </label>
                                <div className='w-full h-fit relative'>
                                    <input placeholder='0' type="text" id='price' className='outline-none border border-grayborder rounded py-1 w-full text-right pr-2' value={pricePop.toLocaleString()} onChange={handleChange}/>
                                    <p className=' absolute bottom-1/2 translate-y-1/2 left-2 text-black'>Rp</p>
                                </div>
                            </div>
                        </div>
                        <div className='flex-grow flex flex-col gap-1 overflow-hidden'>
                            <h1>Select Item Batch: </h1>
                            <div className='flex-grow flex flex-col scroll-custom border border-grayborder rounded-sm overflow-y-auto relative'>
                            <div className=' sticky top-0 bg-graydef flex w-full px-2 py-1 border-b border-grayborder font-medium'>
                                <h2 className='w-[25%] text-left'>Batch</h2>
                                <h2 className='w-[20%] flex justify-center'>Supplier</h2>
                                <h2 className='w-[25%] flex justify-center'>Quantity</h2>
                                <h2 className='w-[30%] flex justify-end'>Purchase Price</h2>
                            </div>
                            {batchInfo.map(batch => {
                                return <button onClick={() => setBatchSelected(batch.batch)} type='button' key={batch.batch} className={' h-fit py-2 justify-between flex text-graytext gap-2 px-2 w-full transition-all ' + ((batchSelected === batch.batch) && 'bg-defblue text-white')}>
                                    <div className='w-[25%] text-left'>{batch.batch == 'Initial Stock' ? batch.batch : 'Batch-' + batch.batch}</div>
                                    <div className='w-[20%] flex justify-center'>{batch.supplier}</div>
                                    <div className='w-[25%] flex justify-center'>{batch.qty}</div>
                                    <div className='w-[30%] flex justify-between pl-4'><p>Rp</p>{batch.price.toLocaleString()}</div>
                                </button>
                            })}
                            </div>
                        </div>
                        <div className='flex items-start text-red-600 text-xs relative'>
                            <p ref={zero} className='opacity-0 transition-all'>Quantity and purchase price cannot be empty.</p>
                            <p ref={already} className='absolute top-0 left-0 opacity-0 transition-all'>This items is already in cart.</p>
                            <p ref={exceedQty} className='absolute top-0 left-0 opacity-0 transition-all'>Insufficient stock! The entered quantity exceeds the available inventory.</p>
                        </div>
                        <div className=' flex justify-end gap-2'>
                            <button onClick={(e) => {e.stopPropagation();setPopQty('closed')}} className='rounded px-4 py-1 border border-grayborder transition-all hover:bg-neutral-100' type='button'>Cancel</button>
                            <button className='rounded px-4 py-1 text-white font-medium bg-defblue transition-all hover:bg-defbluehov' type='submit'>Add to cart</button>
                        </div>
                    </form>
                </div>
            }
        </div>
    )
}

export default StockBoxCashier