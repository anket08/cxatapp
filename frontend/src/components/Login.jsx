import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Atom } from 'react-loading-indicators';
import { User, Lock, Mail, ArrowRight, ChevronLeft } from 'lucide-react';

const Login = ({ onLogin }) => {
    const navigate = useNavigate();
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', email: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // --- YOUR ORIGINAL LOGIC (Functionality Unchanged) ---
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const minLoadTime = (startTime) => {
        const elapsed = Date.now() - startTime;
        const minTime = 2500;
        return new Promise(resolve => setTimeout(resolve, Math.max(0, minTime - elapsed)));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        const startTime = Date.now();
        try {
            const response = await axios.post('http://localhost:8080/auth/login', {
                username: formData.username,
                password: formData.password
            });
            await minLoadTime(startTime);
            if (response.data === "Login successful") {
                try {
                    const userResponse = await axios.get(`http://localhost:8080/auth/user/${formData.username}`);
                    onLogin(userResponse.data);
                } catch (fetchError) {
                    onLogin({ username: formData.username, id: Date.now() });
                }
            } else {
                setError(response.data);
            }
        } catch (err) {
            await minLoadTime(startTime);
            setError('Connection failed. Check if backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        const startTime = Date.now();
        try {
            const res = await axios.post('http://localhost:8080/auth/register', {
                username: formData.username,
                password: formData.password,
                email: formData.email,
                role: 'USER'
            });
            await minLoadTime(startTime);
            onLogin(res.data);
        } catch (err) {
            await minLoadTime(startTime);
            setError('Registration failed. Username/Email might be taken.');
        } finally {
            setLoading(false);
        }
    };
    // --- END OF LOGIC ---

    const pageVariants = {
        initial: { opacity: 0, scale: 0.99 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
        exit: { opacity: 0, transition: { duration: 0.3 } }
    };

    if (loading) {
        return (
            <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit"
                style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508' }}>
                <Atom color="#00f2ff" size="medium" />
                <motion.p animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 2 }}
                    style={{ color: '#00f2ff', letterSpacing: '4px', fontSize: '0.7rem', fontWeight: '800', marginTop: '2rem' }}>
                    AUTHENTICATING_ACCESS...
                </motion.p>
            </motion.div>
        );
    }

    return (
        <motion.div
            variants={pageVariants} initial="initial" animate="animate" exit="exit"
            style={{ width: '100vw', height: '100vh', overflowY: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#050508', position: 'relative' }}
        >
            {/* Architectural Grid Background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '80px 80px' }}></div>
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at center, rgba(20, 22, 32, 0.4) 0%, #050508 100%)' }}></div>
            </div>

            <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: '400px', padding: '0 20px' }}>

                <button onClick={() => navigate('/')} style={backBtnStyle}>
                    <ChevronLeft size={14} /> Back to Terminal
                </button>

                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-0.05em', marginBottom: '0.5rem' }}>
                        cXat<span style={{ color: '#00f2ff' }}>.</span>
                    </h1>
                    <div style={{ fontSize: '0.6rem', color: '#00f2ff', letterSpacing: '3px', fontWeight: '800', opacity: 0.6, textTransform: 'uppercase' }}>
                        Identity Verification
                    </div>
                </div>

                {error && (
                    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        style={{ background: 'rgba(255, 75, 75, 0.1)', border: '1px solid rgba(255, 75, 75, 0.2)', color: '#ff4b4b', padding: '12px', borderRadius: '12px', fontSize: '0.75rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '600' }}>
                        {error}
                    </motion.div>
                )}

                <form onSubmit={isRegistering ? handleRegister : handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <AnimatePresence mode="wait">
                        <motion.div key={isRegistering ? 'reg' : 'log'} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                            {isRegistering && (
                                <div style={{ position: 'relative', marginBottom: '12px' }}>
                                    <Mail size={16} style={iconStyle} />
                                    <input name="email" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required style={inputStyle} />
                                </div>
                            )}
                            <div style={{ position: 'relative', marginBottom: '12px' }}>
                                <User size={16} style={iconStyle} />
                                <input name="username" type="text" placeholder="Username" value={formData.username} onChange={handleChange} required style={inputStyle} />
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={16} style={iconStyle} />
                                <input name="password" type="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={inputStyle} />
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Submit Button With Hover Effect */}
                    <motion.button
                        type="submit"
                        style={btnStyle}
                        disabled={loading}
                        whileHover={{
                            scale: 1.02,
                            boxShadow: '0 0 20px rgba(0, 242, 255, 0.4)',
                            backgroundColor: '#e2e2e2'
                        }}
                        whileTap={{ scale: 0.98 }}
                    >
                        {isRegistering ? 'INITIALIZE ACCOUNT' : 'AUTHORIZE ACCESS'} <ArrowRight size={18} />
                    </motion.button>
                </form>

                <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                    {/* Register Toggle With Darker & Bold Effect */}
                    <motion.button
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); }}
                        style={toggleBtnStyle}
                        whileHover={{ color: '#ffffff', opacity: 1 }}
                    >
                        {isRegistering ? 'EXISTING OPERATOR? SIGN IN' : 'NEW OPERATOR? REGISTER SYSTEM'}
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

// --- STYLES ---
const inputStyle = {
    width: '100%',
    padding: '16px 16px 16px 48px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    borderRadius: '14px',
    color: '#fff',
    fontSize: '0.9rem',
    outline: 'none',
};

const iconStyle = {
    position: 'absolute',
    left: '16px',
    top: '50%',
    transform: 'translateY(-50%)',
    color: '#52525b'
};

const btnStyle = {
    marginTop: '1rem',
    height: '56px',
    backgroundColor: '#fff',
    color: '#000',
    border: 'none',
    borderRadius: '14px',
    fontWeight: '900', // Bold
    fontSize: '0.85rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    cursor: 'pointer',
    transition: 'box-shadow 0.3s ease',
};

const backBtnStyle = {
    background: 'none', border: 'none', color: '#52525b', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.7rem', fontWeight: '700', cursor: 'pointer', marginBottom: '2.5rem', textTransform: 'uppercase', letterSpacing: '1px'
};

const toggleBtnStyle = {
    background: 'none',
    border: 'none',
    color: '#a1a1aa', // Darker/Deeper Grey for better visibility
    fontSize: '0.75rem',
    fontWeight: '850', // Bold
    cursor: 'pointer',
    letterSpacing: '1.5px',
    opacity: 0.8,
    transition: 'all 0.3s ease'
};

export default Login;