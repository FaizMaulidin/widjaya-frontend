import React, { useEffect, useReducer, useRef, useState } from 'react'
import { useAuth } from '../auth/AuthProvider';
import { Navigate } from 'react-router-dom';
import Input from '../components/Input';
import Loading from '../components/Loading';

const LoginPage = () => {
    const { login, token } = useAuth();
	const [error, setError] = useState()
	const [isDisabled, setIsDisabled] = useState(true)
	const [loading, setLoading] = useState(false)
	const input1 = useRef()
	const input2 = useRef()
	const btn = useRef()
	const invalid = useRef()
  
    const handleLogin = async(e) => {
		e.preventDefault()
		try {
			setLoading(true)
			await login({ username: input1.current.value, password: input2.current.value }, setError);
		} catch (error) {
			console.error(error)
		} finally {
			setLoading(false)
		}
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
				<div className='h-fit w-fit pt-2 overflow-hidden'>
					<h1 className='title flex justify-center text-4xl font-black w-fit leading-none text-black'>
						WIDJAYA SPARE PARTS
					</h1>
				</div>
				<div className='h-fit w-fit overflow-hidden'>
					<h3 className='subtitle text-graytext'>
						Sign in to manage stock, restocks, and transactions
					</h3>
				</div>
			</div>
			<form onChange={handleChange} onSubmit={handleLogin} className=' flex flex-col gap-3 relative'>
				<Input placeholder={"Username"} type={'text'} refs={input1} error={error}/>
				<Input placeholder={"Password"} type={'password'} refs={input2} error={error}/>
				<p ref={invalid} className=' absolute left-0 bottom-[3.75rem] text-red-600 text-base opacity-0'>Invalid username or password</p>
				<button ref={btn} disabled={isDisabled} className=' font-semibold text-white bg-grayborder rounded-full py-2 h-12 mt-8 transition-all' type='submit'>
					{!loading
						? <>Login</>
						: <Loading sizeClass={"py-0"} borderClass={'max-h-5 max-w-5 border-t-white border-neutral-300'}/>
					}
				</button>
			</form>
			
		</div>
    );
}

export default LoginPage