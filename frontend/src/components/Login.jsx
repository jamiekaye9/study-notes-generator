import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        username: '',
        password: ''
    }); 

    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value     
        }))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await fetch(`${API_URL}/auth/jwt/create/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('access', data.access);
                localStorage.setItem('refresh', data.refresh);
                navigate('/dashboard');
            } else {
                setError(data.detail || "Login failed.")
            }

        } catch (e) {
            setError('Something went wrong.');
        }
    }

    return (
        <div>
            <h2>Login</h2>
            {error && <p>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='username'>Username</label>
                    <input 
                      type="text"
                      name='username'
                      value={formData.username}
                      onChange={handleChange}
                      required
                    />
                </div>
                <div>
                    <label htmlFor='password'>Password</label>
                    <input 
                      type="password"
                      name='password'
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;