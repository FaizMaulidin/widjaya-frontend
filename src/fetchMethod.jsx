import React, { useState } from 'react'
import './App.css'
import axios from 'axios'

const fetchMethod = () => {
    const [response, setResponse] = useState([])
    const [batchState, setBatchState] = useState([])

    const fetchStock = async() => { // get data
        const res = await axios.get("http://localhost:5000/stock")
        setResponse(res.data)
        console.log("Requested stock by code, and stored it to response state")
    }

    const putStock = async() => { // upload manipulated batchInfo
        const data = JSON.stringify(batchState)
        const res = await axios.put("http://localhost:5000/buy1/DYN-SH-CU", {value: data})
        console.log("nextBatchInfo is uploaded")
        console.log(res.data)
    }

    const handleBuy = () => { // manipulate batchInfo
        response.map(res => {
            if(res.code === "DYN-SH-CU") {
                const nextBatchInfo = res.batchInfo.map(batch => {
                    if(batch.batch === 2){
                        return {
                            ...batch,
                            qty: batch.qty - 1
                        }
                    } else{
                        return batch
                    }
                })
                setBatchState(nextBatchInfo)
            }
        })
        console.log("Next Batch is developed and stored in nextBatchInfo")
    }

    const handleGet = async(e)=> {
        e.preventDefault()
        await fetchStock()
        if (response.length) console.log(response)
    }
    const handlePost = async() => { // add product (batch)
        const data = {
            code: "DYN-SH-AL",
            item: "Dinamo Spin Sh Al",
            brand: "Sharp"
        }
        console.log("tried to post")
        const res = await axios.post("http://localhost:5000/new-product/batch", data)
        console.log("should be posted")
        console.log(res.data)
    }
    const handleAdd = async () => { // add initial stock
        const data = {
            code: "DYN-UM-AL",
            item: "Dinamo Spin Umum Al",
            brand: "Sharp",
            qty: 8,
            price: 78000
        }
        console.log("tried to post")
        const res = await axios.post("http://localhost:5000/new-product/stock", data)
        console.log("should be posted")
        console.log(res.data)
    }

    const handleTry = async() => {
        setLoading(true)
        try {
            const data = {
                supplier: "Mursid",
                items: [
                    {
                        code: "DYN-SH-AL",
                        qty: 6,
                        price: 65000
                    },
                    {
                        code: "DYN-SH-CU",
                        qty: 5,
                        price: 98000
                    },
                    {
                        code: "DYN-UM-AL",
                        qty: 4,
                        price: 75000
                    },
                    {
                        code: "DNW-STC-AL",
                        item: "Dinamo Wash STC Al",
                        brand: "STARMEC",
                        qty: 8,
                        price: 115000
                    }
                ]
            }
            await axios.post(`${import.meta.env.VITE_DB_ENDPOINT}batch/new-batch`, data)
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <></>
    )
}

export default fetchMethod