import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';

function LoginPage() {

    const { register, errors, handleSubmit } = useForm();
    const [errorFromSubmit, setErrorFromSubmit] = useState("")
    const [loading, setloading] = useState(false)
                                            
    const onSubmit = async (data) => {  //비동기처리 - react-hook-form 을 쓸때는 data파라미터를 넣어줌
        try {                              
            setloading(true)
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password);
            setloading(false)
        } 
        catch (error) {
            setErrorFromSubmit(error.message)
            setloading(false)
            setTimeout(() =>{
                setErrorFromSubmit("")
            }, 5000);   //에러문구 5초뒤에 사라지게      
        }
    }

        return (
            <div className="auth-wrapper">
                <div style={{ textAlign: 'center' }}>
                    <h3>Login</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                    />
                    { errors.email && <p>This email field is required</p>}

                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        ref={register({ required: true, minLength: 6 })}
                    />
                    { errors.password && errors.password.type === "required" && <p>This password field is required</p>}
                    { errors.password && errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}

                    { errorFromSubmit && <p>{ errorFromSubmit }</p>}

                    <input type="submit" disabled={ loading }></input>
                <Link style={{ color: 'gray', textDecoration: 'none' }} to="register">아직 아이디가 없으신가요?.??</Link>
            </form>

        </div>
    )
}

export default LoginPage