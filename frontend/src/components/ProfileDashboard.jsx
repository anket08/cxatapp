import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, User, Shield, Save, Lock, FileText, CheckCircle } from 'lucide-react';

const ProfileDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({ username: 'Traveler', id: '000', bio: '', gender: 'Unspecified' });
    const [formData, setFormData] = useState({
        username: '',
        bio: '',
        gender: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [saveStatus, setSaveStatus] = useState(null); // 'saving', 'success', 'error'

    useEffect(() => {
        const storedUser = sessionStorage.getItem('user'); // Or localStorage based on App.js
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setFormData({
                username: parsed.username || '',
                bio: parsed.bio || 'No bio signal detected.',
                gender: parsed.gender || 'm',
                newPassword: '',
                confirmPassword: ''
            });
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = (e) => {
        e.preventDefault();
        setSaveStatus('saving');

        // Simulate API Call
        setTimeout(() => {
            if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
                setSaveStatus('error');
                alert("Passwords do not match!");
                setSaveStatus(null);
                return;
            }

            const updatedUser = { ...user, ...formData };
            // In a real app, post to backend here
            setUser(updatedUser);
            sessionStorage.setItem('user', JSON.stringify(updatedUser)); // Update Local Session
            setSaveStatus('success');

            setTimeout(() => setSaveStatus(null), 2000);
        }, 1500);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="landing-hero" style={{ overflowY: 'auto', paddingBottom: '50px' }}>
            {/* Animated Background Gradient */}
            <div className="animated-gradient-bg"></div>

            {/* Floating Orbs */}
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>

            {/* Grid Background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
            </div>

            <div style={{ position: 'relative', zIndex: 10, maxWidth: '1000px', margin: '0 auto', padding: '40px 20px' }}>
                {/* Header */}
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px' }}>
                    <button
                        onClick={() => navigate('/lobby')}
                        style={{
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            color: '#fff',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            zIndex: 20
                        }}
                    >
                        <ChevronLeft size={16} /> RETURN TO COMMAND
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '8px', height: '8px', background: '#00ff95', borderRadius: '50%', boxShadow: '0 0 10px #00ff95' }}></div>
                        <span style={{ fontSize: '0.75rem', fontFamily: 'monospace', color: '#00ff95' }}>SYSTEM_ONLINE</span>
                    </div>
                </header>

                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}
                >
                    {/* User Identity Card */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: '30px', background: 'rgba(10,10,10,0.6)', padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)' }}>
                        <div style={{ position: 'relative' }}>
                            <div style={{ width: '120px', height: '120px', borderRadius: '50%', background: 'linear-gradient(135deg, #00f2ff, #00a8ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(0, 242, 255, 0.3)' }}>
                                <span style={{ fontSize: '3.5rem', fontWeight: '900', color: '#000' }}>{user.username?.charAt(0).toUpperCase()}</span>
                            </div>
                            <div style={{ position: 'absolute', bottom: '0', right: '0', background: '#000', borderRadius: '50%', padding: '4px', border: '2px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ width: '24px', height: '24px', background: '#00ff95', borderRadius: '50%', border: '2px solid #000' }}></div>
                            </div>
                        </div>
                        <div>
                            <h1 style={{ fontSize: '2.5rem', fontWeight: '900', margin: 0, color: '#fff', letterSpacing: '-1px' }}>{user.username}</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginTop: '10px' }}>
                                <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.5)', background: 'rgba(255,255,255,0.05)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>ID: {user.id}</span>
                                <span style={{ fontFamily: 'monospace', color: '#00f2ff', background: 'rgba(0, 242, 255, 0.1)', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem' }}>OPERATOR LEVEL</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* Edit Profile Form */}
                    <motion.div variants={itemVariants} style={{ background: 'rgba(20,20,20,0.6)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '40px', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '20px' }}>
                            <User size={24} color="#00f2ff" />
                            <h2 style={{ fontSize: '1.5rem', color: '#fff', margin: 0 }}>PROFILE_CONFIGURATION</h2>
                        </div>

                        <form onSubmit={handleSave} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                            {/* Full Name */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', letterSpacing: '1px' }}>OPERATOR ALIAS</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 50px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Bio */}
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', letterSpacing: '1px' }}>BIO-DATA SIGNATURE</label>
                                <div style={{ position: 'relative' }}>
                                    <FileText size={18} style={{ position: 'absolute', left: '16px', top: '20px', color: 'rgba(255,255,255,0.4)' }} />
                                    <textarea
                                        name="bio"
                                        value={formData.bio}
                                        onChange={handleChange}
                                        rows="4"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 50px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', resize: 'none', fontFamily: 'inherit' }}
                                    />
                                </div>
                            </div>

                            {/* Gender / Identity */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', letterSpacing: '1px' }}>IDENTITY MARKER</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none', cursor: 'pointer' }}
                                >
                                    <option value="m" style={{ background: '#000' }}>MALE</option>
                                    <option value="f" style={{ background: '#000' }}>FEMALE</option>
                                    <option value="n" style={{ background: '#000' }}>NON-BINARY</option>
                                    <option value="x" style={{ background: '#000' }}>UNDISCLOSED</option>
                                </select>
                            </div>

                            {/* Empty Grid for Layout */}
                            <div></div>

                            <div style={{ gridColumn: 'span 2', height: '1px', background: 'rgba(255,255,255,0.1)', margin: '10px 0' }}></div>

                            {/* Password Section */}
                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', letterSpacing: '1px' }}>NEW ACCESS CODE</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={formData.newPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 50px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '8px', letterSpacing: '1px' }}>CONFIRM ACCESS CODE</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.4)' }} />
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 16px 16px 50px', borderRadius: '12px', color: '#fff', fontSize: '1rem', outline: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Save Button */}
                            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                                <motion.button
                                    whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(0, 242, 255, 0.3)' }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    style={{
                                        background: saveStatus === 'success' ? '#00ff95' : '#fff',
                                        color: '#000',
                                        border: 'none',
                                        padding: '16px 40px',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '800',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        minWidth: '200px',
                                        justifyContent: 'center',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    {saveStatus === 'success' ? (
                                        <>
                                            <CheckCircle size={20} /> UPDATED
                                        </>
                                    ) : (
                                        <>
                                            <Save size={20} /> SAVE CHANGES
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ProfileDashboard;
