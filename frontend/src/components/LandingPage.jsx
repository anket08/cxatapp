import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Database, Share2, Layers, ChevronRight, Activity } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    const handleEnterSystem = () => {
        sessionStorage.setItem('has_visited_landing', 'true');
        navigate('/login');
    };

    // Animation Variants for Scroll Reveal
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="landing-root" style={{
            backgroundColor: '#050508',
            width: '100vw',
            height: '100vh',
            overflowY: 'auto',
            color: '#fff',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>

            {/* --- Architectural Background --- */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                {/* Subtle Grid */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
                    backgroundSize: '80px 80px',
                }}></div>
                {/* Radial Depth */}
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(circle at 50% 40%, rgba(20, 22, 32, 0.8) 0%, #050508 100%)'
                }}></div>
            </div>

            {/* --- Hero Section --- */}
            <header style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', position: 'relative', zIndex: 10, padding: '0 20px' }}>
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="hero-badge"
                    style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        padding: '6px 16px',
                        borderRadius: '100px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '1.5rem',
                        backdropFilter: 'blur(5px)'
                    }}
                >
                    <div className="status-dot" style={{ width: '6px', height: '6px', background: '#00ff95', borderRadius: '50%', boxShadow: '0 0 10px #00ff95' }}></div>
                    <span style={{ fontSize: '0.65rem', fontWeight: '700', letterSpacing: '2px', color: '#808090', textTransform: 'uppercase' }}>Protocol v2.0 Live</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, filter: 'blur(0px)' }}
                    transition={{ duration: 1 }}
                    style={{ fontSize: 'clamp(3rem, 12vw, 8rem)', fontWeight: '900', letterSpacing: '-0.04em', marginBottom: '1.5rem', textAlign: 'center' }}
                >
                    cXat<span style={{ color: '#00f2ff' }}>.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: '#a1a1aa', maxWidth: '500px', textAlign: 'center', lineHeight: '1.6', marginBottom: '3rem', fontSize: '1.1rem' }}
                >
                    High-performance, low-latency communication infrastructure for the decentralized era.
                </motion.p>

                <motion.button
                    whileHover={{ scale: 1.02, backgroundColor: '#fff', color: '#000' }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleEnterSystem}
                    style={{
                        background: 'transparent',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        padding: '14px 40px',
                        borderRadius: '14px',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                >
                    ACCESS TERMINAL <ChevronRight size={18} />
                </motion.button>
            </header>

            {/* --- Features Grid (The "On Scroll" Reveal) --- */}
            <section style={{ padding: '0 20px 150px', position: 'relative', zIndex: 10 }}>
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '24px'
                    }}
                >
                    <FeatureCard
                        variants={itemVariants}
                        icon={<Zap size={22} />}
                        title="Lightning Fast"
                        desc="Powered by WebSocket technology for sub-millisecond data transmission latency, ensuring your messages arrive instantly."
                        color="#00f2ff"
                    />

                    <FeatureCard
                        variants={itemVariants}
                        icon={<Layers size={22} />}
                        title="Spring Boot"
                        desc="Built with Spring Boot for production-grade backend stability and high-performance data management."
                        color="#00ff95"
                    />

                    <FeatureCard
                        variants={itemVariants}
                        icon={<Database size={22} />}
                        title="Redis Cache"
                        desc="Ultra-fast data persistence and session management layer powered by Redis 7.0 caching architecture."
                        color="#ff4b4b"
                    />

                    <FeatureCard
                        variants={itemVariants}
                        icon={<Share2 size={22} />}
                        title="Apache Kafka"
                        desc="Scalable asynchronous messaging infrastructure to handle massive throughput and event streaming."
                        color="#7000ff"
                    />
                </motion.div>
            </section>

            <footer style={{ padding: '60px 20px', borderTop: '1px solid rgba(255,255,255,0.03)', textAlign: 'center' }}>
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '15px', opacity: 0.4 }}>
                    <Activity size={14} style={{ color: '#00ff95' }} />
                    <span style={{ fontSize: '0.7rem', fontWeight: '600', letterSpacing: '1px', fontFamily: 'monospace' }}>© 2026 CXAT_STREAMS // ALL_SYSTEMS_OPERATIONAL</span>
                </div>
            </footer>
        </div>
    );
};

// Internal Feature Card Component
const FeatureCard = ({ icon, title, desc, color, variants }) => (
    <motion.div
        variants={variants}
        whileHover={{ borderColor: color, backgroundColor: 'rgba(255,255,255,0.04)' }}
        style={{
            padding: '2.5rem',
            background: 'rgba(255, 255, 255, 0.02)',
            borderRadius: '24px',
            border: '1px solid rgba(255,255,255,0.06)',
            backdropFilter: 'blur(20px)',
            transition: 'all 0.4s ease',
            display: 'flex',
            flexDirection: 'column'
        }}
    >
        <div style={{
            color: color,
            marginBottom: '1.5rem',
            background: `rgba(${color === '#00f2ff' ? '0,242,255' : color === '#00ff95' ? '0,255,149' : color === '#ff4b4b' ? '255,75,75' : '112,0,255'}, 0.08)`,
            width: '44px',
            height: '44px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.4s ease'
        }}>
            {icon}
        </div>
        <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '1rem', color: '#fff' }}>{title}</h3>
        <p style={{ color: '#808090', fontSize: '0.9rem', lineHeight: '1.7', margin: 0 }}>{desc}</p>
    </motion.div>
);

export default LandingPage;