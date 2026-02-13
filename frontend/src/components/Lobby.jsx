import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Plus, Link, LogOut, ShieldCheck, Zap, User, Crosshair, Settings, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Lobby = ({ user, onJoinRoom, onLogout }) => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [loading, setLoading] = useState(false);

    // --- Create Room Logic ---
    const handleCreateRoom = async () => {
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8080/chat/room');
            if (res.data && res.data.id) {
                onJoinRoom(res.data.id);
                navigate(`/chat/${res.data.id}`);
            }
        } catch (err) {
            console.error("Terminal Error:", err);
            alert("Backend Connection Failed. Check if server is running on port 8080.");
        } finally {
            setLoading(false);
        }
    };

    // --- Join Room Logic (FIXED) ---
    const handleJoinRoom = () => {
        if (roomId.trim()) {
            onJoinRoom(roomId.trim());
            navigate(`/chat/${roomId.trim()}`);
        } else {
            alert("Please enter a valid Frequency ID");
        }
    };

    return (
        <div className="lobby-root">
            <style>{`
                @keyframes orbit {
                    0% { transform: translate(0, 0) scale(1); }
                    50% { transform: translate(50px, -30px) scale(1.1); }
                    100% { transform: translate(0, 0) scale(1); }
                }

                .lobby-root {
                    position: fixed;
                    inset: 0;
                    width: 100vw;
                    height: 100vh;
                    background: #050505;
                    color: white;
                    font-family: 'Inter', sans-serif;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                /* Animated Background Elements */
                .bg-elements { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
                .grid-layer {
                    position: absolute; inset: 0;
                    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), 
                                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
                .orb {
                    position: absolute; width: 600px; height: 600px; border-radius: 50%;
                    filter: blur(140px); opacity: 0.15; animation: orbit 20s infinite ease-in-out;
                }
                .orb-1 { background: #00f2ff; top: -10%; left: -10%; }
                .orb-2 { background: #7000ff; bottom: -10%; right: -10%; animation-delay: -5s; }

                /* Header Styling */
                .lobby-nav {
                    position: relative; z-index: 10; height: 85px;
                    display: flex; align-items: center; justify-content: space-between;
                    padding: 0 40px; background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(15px); border-bottom: 1px solid rgba(255,255,255,0.08);
                }
                .brand-section { display: flex; align-items: center; gap: 15px; }
                .logo-box { background: rgba(0,242,255,0.1); padding: 10px; border-radius: 12px; border: 1px solid rgba(0,242,255,0.2); }
                
                .user-plate {
                    display: flex; align-items: center; gap: 15px;
                    background: rgba(255,255,255,0.03); padding: 8px 15px;
                    border-radius: 50px; border: 1px solid rgba(255,255,255,0.05);
                }
                .avatar { 
                    width: 35px; height: 35px; background: #6200ea; 
                    border-radius: 50%; display: flex; align-items: center; 
                    justify-content: center; font-weight: bold; border: 2px solid rgba(255,255,255,0.1);
                }

                .exit-btn {
                    background: transparent; border: none; color: #ff4b4b;
                    font-size: 0.75rem; font-weight: 800; cursor: pointer;
                    display: flex; align-items: center; gap: 5px; margin-left: 10px;
                }

                /* Main Content Layout */
                .lobby-main {
                    flex: 1; z-index: 5; display: flex; align-items: center;
                    justify-content: center; padding: 0 5%; gap: 30px;
                }

                .card {
                    flex: 1; max-width: 380px; height: 450px;
                    background: rgba(20, 20, 25, 0.6);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    border-radius: 24px; padding: 40px 30px;
                    display: flex; flex-direction: column; align-items: center;
                    text-align: center; transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .card:hover { 
                    transform: translateY(-10px); 
                    border-color: rgba(0,242,255,0.4);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                }

                .card-icon-wrap {
                    width: 70px; height: 70px; border-radius: 20px;
                    display: flex; align-items: center; justify-content: center;
                    margin-bottom: 25px; font-size: 1.5rem;
                }

                .h3-title { font-size: 1.4rem; font-weight: 800; margin-bottom: 15px; letter-spacing: -0.5px; }
                .p-desc { color: rgba(255,255,255,0.4); font-size: 0.9rem; line-height: 1.6; margin-bottom: auto; }

                /* Action Elements */
                .primary-btn {
                    width: 100%; height: 55px; border-radius: 15px; border: none;
                    background: #00f2ff; color: #000; font-weight: 800;
                    letter-spacing: 1px; cursor: pointer; transition: 0.3s;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .primary-btn:hover:not(:disabled) { 
                    background: #fff; box-shadow: 0 0 25px rgba(0,242,255,0.5); 
                    transform: scale(1.02);
                }

                .join-input {
                    width: 100%; height: 55px; background: rgba(0,0,0,0.3);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 15px;
                    padding: 0 20px; color: white; text-align: center;
                    font-family: 'Monaco', monospace; margin-bottom: 12px; outline: none;
                }

                .connect-btn {
                    width: 100%; height: 45px; border: 1px solid #7000ff;
                    background: rgba(112, 0, 255, 0.1); color: #7000ff;
                    border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s;
                }
                .connect-btn:hover { background: #7000ff; color: white; }

                .lobby-footer {
                    height: 60px; display: flex; align-items: center; justify-content: center;
                    gap: 30px; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05);
                }
                .status-tag { font-size: 0.65rem; color: rgba(255,255,255,0.3); letter-spacing: 2px; display: flex; align-items: center; gap: 8px; }
            `}</style>

            <div className="bg-elements">
                <div className="grid-layer" />
                <div className="orb orb-1" />
                <div className="orb orb-2" />
            </div>

            {/* Header */}
            <header className="lobby-nav">
                <div className="brand-section">
                    <div className="logo-box"><Zap size={22} color="#00f2ff" /></div>
                    <div>
                        <h1 style={{ fontSize: '1.2rem', fontWeight: '900', margin: 0 }}>cXat <span style={{ color: '#6200ea', fontSize: '0.7rem' }}>V2.0</span></h1>
                        <p style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', letterSpacing: '2px', margin: 0 }}>SECURE_UPLINK_ESTABLISHED</p>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="user-plate" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                        <div className="avatar">{user?.username?.charAt(0).toUpperCase() || 'U'}</div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{user?.username || 'Pilot'}</span>
                            <span style={{ fontSize: '0.55rem', color: '#00ff88' }}>OPERATOR_ACTIVE</span>
                        </div>
                    </div>
                    <button className="exit-btn" onClick={onLogout}><LogOut size={14} /> EXIT</button>
                </div>
            </header>

            {/* Main Action Hub */}
            <main className="lobby-main">
                {/* Generate Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card">
                    <div className="card-icon-wrap" style={{ background: 'rgba(0,242,255,0.1)', color: '#00f2ff' }}><Plus size={32} /></div>
                    <h3 className="h3-title">Generate Frequency</h3>
                    <p className="p-desc">Initialize a new end-to-end encrypted communication channel. Coordinates will be broadcasted to your HUD.</p>
                    <button className="primary-btn" onClick={handleCreateRoom} disabled={loading}>
                        {loading ? 'SYNCING...' : <>INITIALIZE <Crosshair size={18} /></>}
                    </button>
                </motion.div>

                {/* Sync Card - FIXED JOIN LOGIC */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card">
                    <div className="card-icon-wrap" style={{ background: 'rgba(112,0,255,0.1)', color: '#7000ff' }}><Link size={32} /></div>
                    <h3 className="h3-title">Sync Frequency</h3>
                    <p className="p-desc">Enter existing channel coordinates to intercept transmissions and join the secure network.</p>
                    <input
                        className="join-input"
                        placeholder="FREQUENCY_ID"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleJoinRoom()}
                    />
                    <button className="connect-btn" onClick={handleJoinRoom}>
                        ESTABLISH CONNECTION
                    </button>
                </motion.div>

                {/* Pilot Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card" onClick={() => navigate('/profile')} style={{ cursor: 'pointer' }}>
                    <div className="card-icon-wrap" style={{ background: 'rgba(255,75,75,0.1)', color: '#ff4b4b' }}><User size={32} /></div>
                    <h3 className="h3-title">Pilot Profile</h3>
                    <p className="p-desc">Access your mission logs, communication stats, and personalize your pilot configuration settings.</p>
                    <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: '#ff4b4b', fontSize: '0.7rem', fontWeight: 'bold' }}>
                        ACCESS SECURE DATA <Settings size={14} />
                    </div>
                </motion.div>
            </main>

            {/* Footer */}
            <footer className="lobby-footer">
                <div className="status-tag"><ShieldCheck size={14} color="#00ff88" /> ENCRYPTION: AES-256 ACTIVE</div>
                <div className="status-tag"><Activity size={14} color="#00f2ff" /> SYSTEM_CORE: NOMINAL</div>
                <div className="status-tag" style={{ color: 'rgba(255,255,255,0.1)' }}>STRLNK_v4.4.0</div>
            </footer>
        </div>
    );
};

export default Lobby;