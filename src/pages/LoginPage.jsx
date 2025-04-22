import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import Input from '../components/Input';

const LoginPage = () => {
    const { login, token } = useAuth();
	const [error, setError] = useState()
	const [isDisabled, setIsDisabled] = useState(true)
	const input1 = useRef()
	const input2 = useRef()
	const btn = useRef()
	const invalid = useRef()
  
    const handleLogin = (e) => {
		e.preventDefault()
		login({ username: input1.current.value, password: input2.current.value }, setError);
    };

	const handleChange =() => {
		if (input1.current.value !== '' && input2.current.value !== ''){
			setIsDisabled(false)
			btn.current.classList.replace('bg-grayborder', 'bg-defblue')
		} else {
			setIsDisabled(true)
			btn.current.classList.replace('bg-defblue', 'bg-grayborder')
		}
	}

	useEffect(() => {
		if (error === 'Invalid'){
			input1.current.classList.add('border-red-600')
			input2.current.classList.add('border-red-600')
			invalid.current.style.opacity = 1
			setTimeout(() => {
				input1.current.classList.remove('border-red-600')
				input2.current.classList.remove('border-red-600')
				invalid.current.style.opacity = 0
			}, 3000)
		}
	}, [error])

    if (token) return <Navigate to="/main/dashboard" replace/>

    return (
		<div className=' flex justify-center flex-col text-[0.95rem] text-black h-screen items-center w-full gap-6'>
			<div className=' flex flex-col gap-1 justify-center items-center'>
				<h1 className=' flex justify-center text-4xl font-black w-fit leading-none text-black'>WIDJAYA SPARE PARTS</h1>
				<h3 className='text-graytext'>Sign in to manage stock, restocks, and transactions</h3>
			</div>
			<form onChange={handleChange} onSubmit={handleLogin} className=' flex flex-col gap-3 relative'>
				<Input placeholder={"Username"} type={'text'} refs={input1} error={error}/>
				<Input placeholder={"Password"} type={'password'} refs={input2} error={error}/>
				<p ref={invalid} className=' absolute left-0 bottom-[3.75rem] text-red-600 text-base opacity-0'>Invalid username or password</p>
				<button ref={btn} disabled={isDisabled} className=' font-semibold text-white bg-grayborder rounded-full py-3 mt-8 transition-all' type='submit' >Login</button>
			</form>
			
		</div>
    );
}

export default LoginPage