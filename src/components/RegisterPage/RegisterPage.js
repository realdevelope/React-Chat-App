import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import firebase from '../../firebase';
import md5 from 'md5';

function RegisterPage() {

    const { register, watch, errors, handleSubmit } = useForm();
    const [ errorFromSubmit, setErrorFromSubmit ] = useState("")
    const [ loading, setloading ] = useState(false)
    
    //Password Comfirm 에러처리부분 정의
    const password = useRef();              //보통은 state로 비교를 해주는데 react-hook-form 모듈을 사용하기때문에 useRef로 비교
    password.current = watch("password");   //useRef란 : 특정 DOM을 선택할 때 사용 - Js 에선 getElementByid, querySelector 같dms DOM Selector함수를 사용
                                            //                                    - react에선 ref를 이용해서 DOM을 선택 -> class 컴포넌트에선 React.createRef 
                                            //                                                                            Function 컴포넌트에선 useRef
                                            //useRef를 이용해서 어떻게 같은지 알 수 있는지 : ref 생성하고 watch를 이용하여 password에 입력한 값을 가져오고 
                                            //                                             가져온 passwrod 값을 ref.current에 넣어주기 떄문에 체크가 가능!!
                                        
    const onSubmit = async (data) => {  //비동기처리 - react-hook-form 을 쓸때는 data파라미터를 넣어줌
        try {                              
            setloading(true)
            //firebase에서 이메일과 비밀번호로 유저 생성
            let createdUser = await firebase
                .auth() //서비스 접근
                .createUserWithEmailAndPassword(data.email, data.password)

            //firebase에서 생성한 유저에 추가 정보 입력
            await createdUser.user.updateProfile({
                    displayName: data.name,
                    photoURL: `http:gravatar.com/avatar/${md5(createdUser.user.email)}?d=identicon` // md5 사용 : email은 유일하기때문에 사용    
                })

            //Firebase 데이터베이스에 저장해주기
            await firebase.database().ref("users").child(createdUser.user.uid).set({
                name: createdUser.user.displayName,
                image: createdUser.user.photoURL
            })  //uid : user의유니크한 아이디

            console.log('createdUser', createdUser)
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
                    <h3>Register</h3>
                </div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <label>Email</label>
                    <input
                        name="email"
                        type="email"
                        ref={register({ required: true, pattern: /^\S+@\S+$/i })}
                    />
                    {errors.email && <p>This email field is required</p>}
    
                    <label>Name</label>
                    <input
                        name="name"
                        ref={register({ required: true, maxLength: 10 })}
                    />
                    {errors.name && errors.name.type === "required" && <p>This name field is required</p>}
                    {errors.name && errors.name.type === "maxLength" && <p>Your input exceed maximum length</p>}
    
                    <label>Password</label>
                    <input
                        name="password"
                        type="password"
                        ref={register({ required: true, minLength: 6 })}
                    />
                    {errors.password && errors.password.type === "required" && <p>This password field is required</p>}
                    {errors.password && errors.password.type === "minLength" && <p>Password must have at least 6 characters</p>}
    
                    <label>Password Confirm</label>
                    <input
                        name="password_confirm"
                        type="password"
                        ref={register({
                            required: true,
                            validate: (value) =>
                            value === password.current  //password.current 가 Password의 value고, value가 Password Confirm의 value이다!!!
                    })}                                 //둘이 같다면 validate 됬다고 표현
                />
                {errors.password_confirm && errors.password_confirm.type === "required" && <p>This password confirm field is required</p>}
                {errors.password_confirm && errors.password_confirm.type === "validate" && <p>The passwords do not match</p>}

                    {errorFromSubmit && <p>setErrorFromSubmit</p>}

                    <input type="submit" disabled={loading}></input>
                <Link style={{ color: 'gray', textDecoration: 'none' }} to="login">이미 아이디가 있으신가요?.?? </Link>
            </form>
        </div>
    )
}

export default RegisterPage