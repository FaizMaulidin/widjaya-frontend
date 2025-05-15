import React from 'react'
import { motion } from 'framer-motion'

const Loading = ({sizeClass = 'py-8', borderClass}) => {

  return (
    <motion.div
    initial={{ opacity: 0, translateX: 30 }}
    animate={{ opacity: 1, translateX: 0 }}
    transition={{ duration: 0.2 }} 
    className={'flex justify-center w-full ' + sizeClass}>
        <div className={'rounded-full aspect-square w-full max-w-8 max-h-8 bg-transparent border-[4px] border-t-graytext border-grayborder animate-spin ' + borderClass}>
        </div>
    </motion.div>
  )
}

export default Loading