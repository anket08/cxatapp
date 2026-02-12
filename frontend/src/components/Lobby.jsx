import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Link, LogOut, ShieldCheck, Zap, User, Crosshair } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Lobby = ({ user, onJoinRoom, onLogout }) => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCreateRoom = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/chat/room');
            onJoinRoom(res.data.id);
            navigate(`/chat/${res.data.id}`);
        } catch (err) {
            alert("Terminal Error: Backend connection failed.");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-hero" style={{ overflow: 'hidden' }}>
            {/* Animated Background Gradient */}
            <div className="animated-gradient-bg"></div>

            {/* Floating Orbs */}
            <div className="floating-orb orb-1"></div>
            <div className="floating-orb orb-2"></div>
            <div className="floating-orb orb-3"></div>

            {/* Architectural Grid Background */}
            <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
                <div style={{ position: 'absolute', inset: 0, backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`, backgroundSize: '60px 60px' }}></div>
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="ship-container"
                style={{ maxWidth: '1000px', width: '90%', flexDirection: 'column', position: 'relative', zIndex: 10, padding: '40px' }}
            >
                <header className="lobby-header-ui" style={{ width: '100%', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="brand" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ background: 'rgba(0, 242, 255, 0.1)', padding: '8px', borderRadius: '8px' }}>
                            <Zap className="neon-icon" size={24} style={{ color: '#00f2ff' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>cXat <span className="v-tag" style={{ fontSize: '0.6rem', background: '#00f2ff', color: '#000', padding: '2px 6px', borderRadius: '4px', verticalAlign: 'middle' }}>v2.0</span></h1>
                            <span style={{ fontSize: '0.75rem', color: '#666', letterSpacing: '2px' }}>SECURE_UPLINK_ESTABLISHED</span>
                        </div>
                    </div>

                    <div className="user-profile-plate" style={{ display: 'flex', alignItems: 'center', gap: '20px', background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('/profile')}>
                            <div className="avatar-ring" style={{ width: '36px', height: '36px', borderRadius: '50%', border: '2px solid #00f2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div className="avatar-core" style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>
                                    {user.username.charAt(0).toUpperCase()}
                                </div>
                            </div>
                            <div className="user-meta" style={{ display: 'flex', flexDirection: 'column' }}>
                                <span className="u-name" style={{ fontSize: '0.9rem', fontWeight: '700' }}>{user.username}</span>
                                <span className="u-status" style={{ fontSize: '0.65rem', color: '#00ff95', letterSpacing: '1px' }}>OPERATOR</span>
                            </div>
                        </div>
                        <div style={{ width: '1px', height: '24px', background: 'rgba(255,255,255,0.1)' }}></div>
                        <button className="exit-trigger" onClick={onLogout} title="De-authorize" style={{ background: 'transparent', border: 'none', color: '#ff4b4b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: '600' }}>
                            <LogOut size={16} /> EXIT
                        </button>
                    </div>
                </header>

                <main className="lobby-actions" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', width: '100%' }}>
                    {/* Create Room Card */}
                    <motion.div
                        whileHover={{ y: -5, borderColor: 'rgba(0, 242, 255, 0.4)' }}
                        className="action-card highlight"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '2rem',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div className="card-icon" style={{ background: 'rgba(0, 242, 255, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#00f2ff' }}>
                            <Plus size={24} />
                        </div>
                        <div className="card-content">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Generate Frequency</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>Initialize a new encrypted communication channel. Coordinates will be generated automatically.</p>
                        </div>
                        <button
                            className="action-btn primary"
                            onClick={handleCreateRoom}
                            disabled={loading}
                            style={{
                                marginTop: 'auto',
                                background: '#fff',
                                color: '#000',
                                border: 'none',
                                padding: '12px',
                                borderRadius: '10px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '8px'
                            }}
                        >
                            {loading ? 'SIGNALING...' : <>INITIALIZE <Crosshair size={16} /></>}
                        </button>
                    </motion.div>

                    {/* Join Room Card */}
                    <motion.div
                        whileHover={{ y: -5, borderColor: 'rgba(112, 0, 255, 0.4)' }}
                        className="action-card"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '2rem',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        <div className="card-icon" style={{ background: 'rgba(112, 0, 255, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#7000ff' }}>
                            <Link size={24} />
                        </div>
                        <div className="card-content">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Sync Frequency</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>Enter existing channel coordinates to intercept transmission.</p>
                        </div>
                        <div className="join-group" style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                            <input
                                type="text"
                                placeholder="CHANNEL_ID"
                                value={roomId}
                                onChange={(e) => setRoomId(e.target.value)}
                                style={{
                                    flex: 1,
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    padding: '12px',
                                    borderRadius: '10px',
                                    color: '#fff',
                                    outline: 'none',
                                    fontFamily: 'monospace'
                                }}
                            />
                            <button
                                className="action-btn secondary"
                                onClick={() => {
                                    if (roomId) {
                                        onJoinRoom(roomId);
                                        navigate(`/chat/${roomId}`);
                                    }
                                }}
                                style={{
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    padding: '0 20px',
                                    borderRadius: '10px',
                                    fontWeight: '700',
                                    cursor: 'pointer'
                                }}
                            >
                                CONNECT
                            </button>
                        </div>
                    </motion.div>

                    {/* Profile Card Shortcut */}
                    <motion.div
                        whileHover={{ y: -5, borderColor: 'rgba(255, 75, 75, 0.4)' }}
                        className="action-card"
                        style={{
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            background: 'rgba(255, 255, 255, 0.02)',
                            padding: '2rem',
                            borderRadius: '20px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1.5rem',
                            transition: 'all 0.3s ease',
                            cursor: 'pointer'
                        }}
                        onClick={() => navigate('/profile')}
                    >
                        <div className="card-icon" style={{ background: 'rgba(255, 75, 75, 0.1)', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff4b4b' }}>
                            <User size={24} />
                        </div>
                        <div className="card-content">
                            <h3 style={{ fontSize: '1.2rem', fontWeight: '700', marginBottom: '0.5rem' }}>Pilot Profile</h3>
                            <p style={{ color: '#888', fontSize: '0.9rem', lineHeight: '1.6' }}>Access your mission logs, stats, and personal configuration.</p>
                        </div>
                        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4b4b', fontSize: '0.8rem', fontWeight: '700' }}>
                            ACCESS DATA <div style={{ width: '4px', height: '4px', background: 'currentColor', borderRadius: '50%' }}></div>
                        </div>
                    </motion.div>
                </main>

                <footer className="lobby-status-footer" style={{ marginTop: '3rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1.5rem', width: '100%', display: 'flex', justifyContent: 'space-between', opacity: 0.6 }}>
                    <div className="status-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        <ShieldCheck size={14} style={{ color: '#00ff95' }} />
                        <span>ENCRYPTION: AES-256 ACTIVE</span>
                    </div>
                    <div className="status-item" style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontFamily: 'monospace' }}>
                        <div className="live-dot" style={{ width: '6px', height: '6px', background: '#00f2ff', borderRadius: '50%', boxShadow: '0 0 5px #00f2ff' }}></div>
                        <span>CORE: NOMINAL</span>
                    </div>
                </footer>
            </motion.div>
        </div>
    );
};

export default Lobby;