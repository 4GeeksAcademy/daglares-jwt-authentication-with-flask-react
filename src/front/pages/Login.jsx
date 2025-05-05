import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";

export const Login = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        const res = await fetch('/api/token', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (res.ok) {
        
            localStorage.setItem("token", data.access_token);

            dispatch({ type: "SET_USER", payload: {
                email: data.email,
                name: data.name,
                last_name: data.last_name
            }});
            dispatch({ type: "set_token", payload: data.access_token });
            alert("Login exitoso");
            navigate("/protected");
        } else {
            alert(data.msg || "Error en login");
        }
    };

    return (
        <div className="container text-center d-flex flex-column justify-content-center align-items-center">
            <h2>Login</h2>
            <form onSubmit={handleLogin} className="col-6">
                <div className="mb-3 text-start">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div className="mb-3 text-start">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        </div>
    );
};