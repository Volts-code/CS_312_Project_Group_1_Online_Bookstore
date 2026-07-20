import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios'
const url = "http://localhost:5000/";

function Signup(){
    const [user, setUser] = useState({
        username: "",
        password: "",
        preferences: []
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
                        password: prevValue.password,
                        preferences: prevValue.preferences
                    };
                case "password":
                    return {
                        username: prevValue.username,
                        password: newValue,
                        preferences: prevValue.preferences
                    };
                case "preferences":
                    return {
                        username: prevValue.username,
                        password: prevValue.password,
                        preferences: newValue !== "default" && 
                            !prevValue.preferences.includes(newValue)  ? 
                                [...prevValue.preferences, newValue] :
                                prevValue.preferences
                    };
            }
        });
    }

    function clearPref() {
        setUser((prevValue) => {
            return {
                username: prevValue.username,
                password: prevValue.password,
                preferences: []
            };
        })
    }

    const signupUser = async (event) => {
        event.preventDefault();

        const response = await axios.post( url + "signup", user);

        if( response.data.success ){
            navigate("/login");
        }
        else{
            alert("Error: User Already Exists");
        }
    }

    return (
        <div id="signup">
            <h1 className="signupHeader">Sign In</h1>
            <form onSubmit={signupUser}>
                <h5 className="signupLabel">Username</h5>
                <input className="signupInput" type="text" onChange={onChange} name="username" placeholder="Enter Your Username" />
                <h5 className="signupLabel">Password</h5>
                <input className="signupInput" type="password" onChange={onChange} name="password" placeholder="Enter Your Password" />
                <h5 className="signupLabel">Preferences: {user.preferences.join(', ')}</h5> 
                <select className="signupInput" onChange={onChange} name="preferences">
                    <option value="default">Preferences</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Sci-fi">Sci-Fi</option>
                </select>
                { user.preferences.length !== 0 ? <button onClick={clearPref}>Clear</button> : <></> }
                <br/>
                <button type="submit">Create Account</button>
            </form>
            <p>Already Have An Account?</p>
            <Link to="/login">Log in here</Link>
        </div>
    );
}


export default Signup;