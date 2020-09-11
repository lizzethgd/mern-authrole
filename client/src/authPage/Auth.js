import React, {useState} from 'react'
import API from "../utils/API";

const Auth = () => {
    const [register, setRegister] = useState(false)

    const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
    
    const { email, password } = formData;

    const clearance = 'admin'



    //API CALLS
    const signupUser = async (email, password, clearance ) => {
      try {
        const config = { headers: { "Content-Type": "application/json" } };
        const body = { email, password, clearance };
        const res = await API.post("api/v1/auth/signup", body, config);
        console.log(res);
      } catch (err) {
        console.log(err.response.data.message);
      }
    }
    
    const loginUser = async (email, password) => {
      try {
        const config = { headers: { "Content-Type": "application/json" } };
        const body = { email, password };
        const res = await API.post("api/v1/auth/login", body, config);
        console.log(res);
      } catch (err) {
        console.log(err);
        console.log(err.response.data.message);
        console.log(err.message);
      }
    };

    //FUNCTIONS
    const onChange = e => {
        setFormData({
          ...formData,
          [e.target.name]: e.target.value,
        });
      };

    const onSubmit = (e) => {
        e.preventDefault(email, password);
        register ? signupUser(email, password, clearance) : loginUser(email, password)
       console.log('button clicked')
    };

    const registerClass = !register
    ? "form-switcher__option"
    : "form-switcher__option form-switcher__option--selected"

    const loginClass = register
    ? "form-switcher__option"
    : "form-switcher__option form-switcher__option--selected"

    const buttonText = register? 'Signup' : 'Login'

    return (
    <>
    <div className="form-switcher">
    <div className={loginClass} onClick={(e) => setRegister(false)}>
          Login
        </div>
        <div className={registerClass} onClick={(e) => setRegister(true)}>
          Signup
        </div>
    </div>   
    <div className="login-form">
        <form className="login-form__group" onSubmit={onSubmit}>
        <img className="login-form__logo"src={require("../img/logo.svg")} alt='logo'/>

        <input
        className="input__text"
        type="email"
        placeholder="email address"
        name="email"
        value={email}
        onChange={onChange}
        required
      />
      <input
        className="input__text"
        type="password"
        placeholder="password"
        name="password"
        value={password}
        onChange={onChange}
        minLength="6"
        required
      />
      <input className="input__submit" type="submit" value={buttonText} />
    </form>
    </div>
    </>
    )
}

export default Auth
