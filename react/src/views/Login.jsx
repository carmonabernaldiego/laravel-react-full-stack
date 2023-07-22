import {Link} from "react-router-dom";
import {useRef, useState} from "react";
import {useStateContext} from "../contexts/ContextProvider.jsx";
import axiosClient from "../axios-client.js";

export default function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const [errors, setErrors] = useState(null);
  const {setUser, setToken} = useStateContext()

  const onSubmit = (event) => {
    event.preventDefault()

    const payload = {
      email: emailRef.current.value,
      password: passwordRef.current.value,
    }

    console.log(payload);

    setErrors(null);
    axiosClient.post('/login', payload)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token)
      })
      .catch(error => {
        const response = error.response;
        if (response && response.status === 422) {
          if(response.data.errors){
            setErrors(response.data.errors);
          } else {
            setErrors({
              email: [response.data.message]
            });
          }
        }
      })
  }
  return (
    <form onSubmit={onSubmit}>
      <h1 className="title">
        Login into your account
      </h1>
      {
        errors && <div className="alert">
          {Object.keys(errors).map(key => (
            <p key={key}>{errors[key][0]}</p>
          ))}
        </div>
      }
      <input ref={emailRef} type="email" placeholder="Email"/>
      <input ref={passwordRef} type="password" placeholder="Password"/>
      <button className="btn btn-block">Login</button>
      <p className="message">
        Not Registered? <Link to="/signup">Create an account</Link>
      </p>
    </form>
  )
}
