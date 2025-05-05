import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer";  // Tu hook global

export const Signup = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                last_name: lastName,
                email,
                password    
            })
        });

        const data = await res.json();

        if (res.ok) {
            alert("Usuario registrado con éxito");
            navigate("/login"); 
        } else {
            alert(data.msg || "Error en el registro");
        }
    };

    return (
        <div className="container text-center d-flex flex-column justify-content-center align-items-center">
            <h1>Register</h1>
            <form onSubmit={handleSubmit} className="col-6">
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" placeholder="Name"
                        value={name} onChange={(e) => setName(e.target.value)} required />
                    <label>Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" className="form-control" placeholder="Last Name"
                        value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    <label>Last Name</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" className="form-control" placeholder="Email"
                        value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label>Email address</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password" className="form-control" placeholder="Password"
                        value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <label>Password</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        </div>
    );
};