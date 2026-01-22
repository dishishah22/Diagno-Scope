import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import './Home.css';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="home-page page-transition">
            <section className="hero-section">
                <div className="hero-content container">
                    <div className="hero-text">
                        {/* <div className="badge"> */}
                            {/* <span className="badge-dot"></span> */}
                            {/* v2.0 Now Available */}
                        {/* </div> */}
                        <h1 className="hero-title">
                            Medical Diagnostics <br />
                            <span className="text-gradient">Reimagined</span>
                        </h1>
                        <p className="hero-subtitle">
                            Advanced AI-powered scanning technology for precise and rapid medical analysis.
                            Diagno Scope brings the future of healthcare to your screen.
                        </p>
                        <div className="hero-actions">
                            <button className="btn-primary" onClick={() => navigate('/signup')}>
                                Start Diagnostics <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                            </button>
                            <button className="btn-outline" onClick={() => navigate('/about')}>
                                Learn More
                            </button>
                        </div>
                    </div>
                    <div className="hero-visual">
                        <div className="scan-circle">
                            <div className="scan-line"></div>
                            <Activity size={64} className="visual-icon" />
                        </div>
                        <div className="floating-card c1">
                            <ShieldCheck size={20} color="#00ffa3" />
                            <span>99.9% Accuracy</span>
                        </div>
                        <div className="floating-card c2">
                            <Zap size={20} color="#ffaa00" />
                            <span>Instant Results</span>
                        </div>
                    </div>
                </div>
                <div className="bg-glow"></div>
            </section>
        </div>
    );
};

export default Home;
