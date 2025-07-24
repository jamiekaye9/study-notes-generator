import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        username: '',
        password: '',
        confirmPassword: ''
    });

    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value     
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const data = await response.json();
                setError(data.username?.[0] || "Registration failed.");
            }
        } catch (e) {
            setError('Something went wrong.');
        }
    }

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>Registration successful! Redirecting to login...</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='first_name'>First Name</label>
                    <input 
                      type="text"
                      name='first_name'
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                    />
                </div>
                <div>
                    <label htmlFor='last_name'>Last Name</label>
                    <input 
                      type="text"
                      name='last_name'
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                    />
                </div>
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
                <div>
                    <label htmlFor='confirmPassword'>Confirm Password</label>
                    <input 
                      type="password"
                      name='confirmPassword'
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                </div>
                <button type="submit">Register</button>
            </form>
        </div>
    )
}

export default Register;