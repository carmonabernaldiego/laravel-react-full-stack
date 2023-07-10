import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import axiosClient from "../axios-client.js";
import {useStateContext} from "../contexts/ContextProvider.jsx";

export default function Signup() {
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken} = useStateContext()

  const onSubmit = (event) => {
    event.preventDefault()

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    }

    console.log(payload);

    axiosClient.post('/signup', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(error => {
        const response = error.response;
        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      })
  }

  return (
    <form onSubmit={onSubmit}>
      <h1 className="title">
        Signup for free
      </h1>
      {
        errors && <div className="alert">
          {Object.keys(errors).map(key => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      }
      <input ref={nameRef} placeholder="Full Name"/>
      <input ref={emailRef} type="email" placeholder="Email Address"/>
      <input ref={passwordRef} type="password" placeholder="Password"/>
      <input ref={passwordConfirmationRef} type="password" placeholder="Password Confirmation"/>
      <button className="btn btn-block">Signup</button>
      <p className="message">
        Already Registered? <Link to="/login">Sign in</Link>
      </p>
    </form>
  )
}
