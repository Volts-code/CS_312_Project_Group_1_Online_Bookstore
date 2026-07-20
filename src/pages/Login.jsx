import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
const url = "http://localhost:5000/";

function Login(){
    const [user, setUser] = useState({
        username: "",
        password: ""
    });
    const navigate = useNavigate();

    function onChange(event){
        const inputName = event.target.name;
        const newValue = event.target.value;

        setUser((prevValue) => {
            switch (inputName) {
                case "username":
                    return {
                        username: newValue,
                        password: prevValue.password
                    };
                case "password":
                    return {
                        username: prevValue.username,
                        password: newValue
                    };
            }
        });
    }

    const loginUser = async (event) => {
        event.preventDefault();

        const response = await axios.post( url + "login", user);

        if( response.data.success ){
            navigate("/");
        }
        else{
            alert("Error: Username/Password May Be Incorrect");
        }
    }

    return (
        <div id="login">
            <h1 className="loginHeader">Log In</h1>
            <form onSubmit={loginUser}>
                <h5 className="loginLabel">Username</h5>
                <input className="loginInput" type="text" onChange={onChange} name="username" placeholder="Enter Your Username" />
                <h5 className="loginLabel">Password</h5>
                <input className="loginInput" type="password" onChange={onChange} name="password" placeholder="Enter Your Password" /><br/><br/>
                <button class="loginBtn" type="submit">Log In</button>
            </form>
            <p>Don't Have An Account?</p>
            <Link to="/signup">Sign up here</Link>
        </div>
    );
}


export default Login;