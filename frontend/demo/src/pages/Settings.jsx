// // import React, { useState, useEffect } from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { useAuth } from '../context/AuthContext';
// // import { useTheme } from '../context/ThemeContext';
// // import {
// //     User, Activity, Brain, Shield, Layout, Bell, Monitor, Settings as SettingsIcon,
// //     ChevronRight, Save, LogOut, Trash2
// // } from 'lucide-react';
// // import { getSettings, saveSettings } from '../utils/storage';
// // import './Settings.css';

// // const Settings = () => {
// //     const { currentUser, logout } = useAuth();
// //     const navigate = useNavigate();
// //     const { theme, toggleTheme } = useTheme();
// //     const [settings, setSettings] = useState(getSettings());
// //     const [hasChanges, setHasChanges] = useState(false);

// //     useEffect(() => {
// //         if (!currentUser) {
// //             navigate('/login');
// //         }
// //     }, [currentUser, navigate]);

// //     // Sync theme from Context to Settings state
// //     useEffect(() => {
// //         setSettings(prev => ({ ...prev, theme: theme }));
// //     }, [theme]);

// //     const handleSettingChange = (key, value) => {
// //         const newSettings = { ...settings, [key]: value };
// //         setSettings(newSettings);
// //         saveSettings(newSettings); // Auto-save for most interactions
// //         // setHasChanges(true); // If we wanted manual save button

// //         // Special side effects
// //         if (key === 'theme' && value !== theme) {
// //             toggleTheme();
// //         }
// //     };

// //     const handleLogout = async () => {
// //         try {
// //             await logout();
// //             navigate('/login');
// //         } catch {
// //             console.error("Failed to log out");
// //         }
// //     };

// //     const clearCache = () => {
// //         if (window.confirm('Are you sure you want to clear local cache? This will reset recent history.')) {
// //             localStorage.clear();
// //             window.location.reload();
// //         }
// //     };

// //     if (!currentUser) return null;

// //     return (
// //         <div className="settings-page page-transition container">
// //             <div className="settings-header">
// //                 <h1 className="settings-title">Settings</h1>
// //                 <p className="settings-subtitle">Manage your preferences, diagnostic tools, and account.</p>
// //             </div>

// //             <div className="settings-grid">

// //                 {/* 1. Profile Settings */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <User size={20} />
// //                         <h3>Profile Settings</h3>
// //                     </div>
// //                     <div className="setting-form-group">
// //                         <label className="setting-label">Full Name</label>
// //                         <input type="text" className="form-input" value={currentUser.doctor_name || 'Dr. User'} readOnly />
// //                     </div>
// //                     <div className="setting-form-group">
// //                         <label className="setting-label">Email Address</label>
// //                         <input type="email" className="form-input disabled" value={currentUser.email} readOnly />
// //                     </div>
// //                     <div className="setting-form-group">
// //                         <label className="setting-label">Role</label>
// //                         <input type="text" className="form-input disabled" value="Doctor / Admin" readOnly />
// //                     </div>
// //                     <div className="setting-form-group">
// //                         <label className="setting-label">Associated Hospital</label>
// //                         <input
// //                             type="text"
// //                             className="form-input"
// //                             value={settings.hospital}
// //                             onChange={(e) => handleSettingChange('hospital', e.target.value)}
// //                         />
// //                     </div>
// //                     <div className="action-row">
// //                         <button className="btn-outline small">Change Password</button>
// //                         <button className="btn-danger small" onClick={handleLogout}>
// //                             <LogOut size={14} style={{ marginRight: 5 }} /> Logout
// //                         </button>
// //                     </div>
// //                 </section>

// //                 {/* 2. Diagnostic Preferences */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <Activity size={20} />
// //                         <h3>Diagnostic Preferences</h3>
// //                     </div>
// //                     <div className="setting-item">
// //                         <div className="setting-info">
// //                             <span className="setting-label">Default Imaging Modality</span>
// //                         </div>
// //                         <div className="radio-group">
// //                             {['X-Ray', 'CT', 'MRI'].map(m => (
// //                                 <button
// //                                     key={m}
// //                                     className={`radio-btn ${settings.defaultModality === m ? 'active' : ''}`}
// //                                     onClick={() => handleSettingChange('defaultModality', m)}
// //                                 >
// //                                     {m}
// //                                 </button>
// //                             ))}
// //                         </div>
// //                     </div>
// //                     <div className="setting-item">
// //                         <span className="setting-label">Auto-generate Case ID</span>
// //                         <Toggle
// //                             checked={settings.autoCaseId}
// //                             onChange={() => handleSettingChange('autoCaseId', !settings.autoCaseId)}
// //                         />
// //                     </div>
// //                     <div className="setting-item">
// //                         <div className="setting-info">
// //                             <span className="setting-label">Default View Preset</span>
// //                         </div>
// //                         <select
// //                             className="select-input"
// //                             value={settings.viewPreset}
// //                             onChange={(e) => handleSettingChange('viewPreset', e.target.value)}
// //                         >
// //                             <option value="Lung">Lung</option>
// //                             <option value="Bone">Bone</option>
// //                             <option value="Soft Tissue">Soft Tissue</option>
// //                         </select>
// //                     </div>
// //                 </section>

// //                 {/* 3. AI & Analysis Settings */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <Brain size={20} />
// //                         <h3>AI & Analysis</h3>
// //                     </div>
// //                     <SettingToggle label="Enable AI-Assisted Analysis" checked={settings.aiAssisted} onChange={() => handleSettingChange('aiAssisted', !settings.aiAssisted)} />
// //                     <SettingToggle label="Show Confidence Scores" checked={settings.showConfidence} onChange={() => handleSettingChange('showConfidence', !settings.showConfidence)} />
// //                     <SettingToggle label="Show Differential Diagnoses" checked={settings.diffDiagnosis} onChange={() => handleSettingChange('diffDiagnosis', !settings.diffDiagnosis)} />
// //                     <SettingToggle label="Enable Visual Explainability (Grad-CAM)" checked={settings.visualExplainability} onChange={() => handleSettingChange('visualExplainability', !settings.visualExplainability)} />
// //                     <SettingToggle label="Require Manual Review" checked={settings.manualReview} onChange={() => handleSettingChange('manualReview', !settings.manualReview)} />
// //                 </section>

// //                 {/* 4. Data & Privacy */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <Shield size={20} />
// //                         <h3>Data & Privacy</h3>
// //                     </div>
// //                     <SettingToggle label="Store Results in Firestore" checked={settings.firestoreSync} onChange={() => handleSettingChange('firestoreSync', !settings.firestoreSync)} />
// //                     <SettingToggle label="Mask Patient Identifiers" checked={settings.maskPatientIds} onChange={() => handleSettingChange('maskPatientIds', !settings.maskPatientIds)} />
// //                     <SettingToggle label="Enable Case Activity Logs" checked={settings.activityLogs} onChange={() => handleSettingChange('activityLogs', !settings.activityLogs)} />
// //                     <div className="setting-item">
// //                         <span className="setting-label">Export Data</span>
// //                         <div className="btn-group">
// //                             <button className="btn-outline small">PDF</button>
// //                             <button className="btn-outline small">CSV</button>
// //                         </div>
// //                     </div>
// //                 </section>

// //                 {/* 5. Dashboard Settings */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <Layout size={20} />
// //                         <h3>Dashboard</h3>
// //                     </div>
// //                     <div className="setting-item">
// //                         <span className="setting-label">Default View</span>
// //                         <select
// //                             className="select-input"
// //                             value={settings.dashboardView}
// //                             onChange={(e) => handleSettingChange('dashboardView', e.target.value)}
// //                         >
// //                             <option>Recent Cases</option>
// //                             <option>Analytics</option>
// //                         </select>
// //                     </div>
// //                     <SettingToggle label="Show Status Indicators" checked={settings.showStatusIndicators} onChange={() => handleSettingChange('showStatusIndicators', !settings.showStatusIndicators)} />
// //                     <SettingToggle label="Enable Usage Analytics" checked={settings.usageAnalytics} onChange={() => handleSettingChange('usageAnalytics', !settings.usageAnalytics)} />
// //                 </section>

// //                 {/* 6. Notifications */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <Bell size={20} />
// //                         <h3>Notifications</h3>
// //                     </div>
// //                     <SettingToggle label="Analysis Completed" checked={settings.notifyAnalysisComplete} onChange={() => handleSettingChange('notifyAnalysisComplete', !settings.notifyAnalysisComplete)} />
// //                     <SettingToggle label="Low-Confidence Alerts" checked={settings.notifyLowConfidence} onChange={() => handleSettingChange('notifyLowConfidence', !settings.notifyLowConfidence)} />
// //                     <SettingToggle label="System Updates" checked={settings.notifyUpdates} onChange={() => handleSettingChange('notifyUpdates', !settings.notifyUpdates)} />
// //                     <SettingToggle label="Email Notifications" checked={settings.emailNotifications} onChange={() => handleSettingChange('emailNotifications', !settings.emailNotifications)} />
// //                 </section>

// //                 {/* 7. Interface Settings */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <Monitor size={20} />
// //                         <h3>Interface</h3>
// //                     </div>
// //                     <div className="setting-item">
// //                         <span className="setting-label">Theme</span>
// //                         <div className="radio-group">
// //                             <button
// //                                 className={`radio-btn ${theme === 'dark' ? 'active' : ''}`}
// //                                 onClick={() => handleSettingChange('theme', 'dark')}
// //                             >Dark</button>
// //                             <button
// //                                 className={`radio-btn ${theme === 'light' ? 'active' : ''}`}
// //                                 onClick={() => handleSettingChange('theme', 'light')}
// //                             >Light</button>
// //                         </div>
// //                     </div>
// //                     <SettingToggle label="Keyboard Shortcuts" checked={settings.shortcuts} onChange={() => handleSettingChange('shortcuts', !settings.shortcuts)} />
// //                     <SettingToggle label="Auto-Save Form Inputs" checked={settings.autoSave} onChange={() => handleSettingChange('autoSave', !settings.autoSave)} />
// //                 </section>

// //                 {/* 8. System & Support */}
// //                 <section className="settings-section glass-panel">
// //                     <div className="section-title">
// //                         <SettingsIcon size={20} />
// //                         <h3>System & Support</h3>
// //                     </div>
// //                     <div className="setting-item">
// //                         <span className="setting-label">App Version</span>
// //                         <span className="setting-desc">v1.2.4 (Beta)</span>
// //                     </div>
// //                     <div className="setting-item">
// //                         <span className="setting-label">System Status</span>
// //                         <span className="status-tag">Online</span>
// //                     </div>
// //                     <div className="setting-item clickable" onClick={clearCache}>
// //                         <div className="setting-info">
// //                             <span className="setting-label text-danger">Clear Local Cache</span>
// //                         </div>
// //                         <Trash2 size={16} className="text-danger" />
// //                     </div>
// //                     <div className="setting-item clickable">
// //                         <span className="setting-label">Terms & Privacy Policy</span>
// //                     </div>
// //                 </section>

// //             </div>
// //         </div>
// //     );
// // };

// // // Helper Component for consistent toggles
// // const SettingToggle = ({ label, checked, onChange }) => (
// //     <div className="setting-item">
// //         <span className="setting-label">{label}</span>
// //         <Toggle checked={checked} onChange={onChange} />
// //     </div>
// // );

// // const Toggle = ({ checked, onChange }) => (
// //     <label className="switch">
// //         <input
// //             type="checkbox"
// //             checked={checked}
// //             onChange={onChange}
// //         />
// //         <span className="slider round"></span>
// //     </label>
// // );

// // export default Settings;


// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';
// import { useTheme } from '../context/ThemeContext';
// import {
//     User, Activity, Brain, Shield, Layout, Bell, Monitor, Settings as SettingsIcon,
//     ChevronRight, Save, LogOut, Trash2
// } from 'lucide-react';
// import { getSettings, saveSettings } from '../utils/storage';
// import './Settings.css';

// const Settings = () => {
//     const { currentUser, logout } = useAuth();
//     const navigate = useNavigate();
//     const { theme, toggleTheme } = useTheme();
    
//     // 1. Existing settings logic
//     const [settings, setSettings] = useState(getSettings());
//     const [isSaved, setIsSaved] = useState(false);

//     useEffect(() => {
//         if (!currentUser) {
//             navigate('/login');
//         }
//     }, [currentUser, navigate]);

//     useEffect(() => {
//         setSettings(prev => ({ ...prev, theme: theme }));
//     }, [theme]);

//     const handleSettingChange = (key, value) => {
//         const newSettings = { ...settings, [key]: value };
//         setSettings(newSettings);
//         saveSettings(newSettings); 

//         if (key === 'theme' && value !== theme) {
//             toggleTheme();
//         }
//     };

//     // 2. New Logic: Manual Save for Profile
//     const handleProfileSave = () => {
//         saveSettings(settings);
//         setIsSaved(true);
//         setTimeout(() => setIsSaved(false), 3000);
//     };

//     const handleLogout = async () => {
//         try {
//             await logout();
//             navigate('/login');
//         } catch {
//             console.error("Failed to log out");
//         }
//     };

//     const clearCache = () => {
//         if (window.confirm('Are you sure you want to clear local cache? This will reset recent history.')) {
//             localStorage.clear();
//             window.location.reload();
//         }
//     };

//     if (!currentUser) return null;

//     return (
//         <div className="settings-page page-transition container">
//             <div className="settings-header">
//                 <h1 className="settings-title">Settings</h1>
//                 <p className="settings-subtitle">Manage your preferences, diagnostic tools, and account.</p>
//             </div>

//             <div className="settings-grid">

//                 {/* 1. NEW: Doctor Profile & Live Preview */}
//                 <section className="settings-section glass-panel profile-highlight">
//                     <div className="section-title">
//                         <User size={20} />
//                         <h3>Professional Profile</h3>
//                     </div>
                    
//                     {/* Live Preview Card */}
//                     <div className="live-profile-card">
//                         <div className="profile-avatar-circle">
//                             {(currentUser.doctor_name || 'D').charAt(0)}
//                         </div>
//                         <div className="profile-info-text">
//                             <h4>{currentUser.doctor_name || 'Dr. User'}</h4>
//                             <p className="hospital-tag">{settings.hospital || 'No Hospital Assigned'}</p>
//                             <span className="badge">Active Session</span>
//                         </div>
//                     </div>

//                     <div className="setting-form-group">
//                         <label className="setting-label">Full Name</label>
//                         <input type="text" className="form-input disabled" value={currentUser.doctor_name || 'Dr. User'} readOnly />
//                     </div>
//                     <div className="setting-form-group">
//                         <label className="setting-label">Associated Hospital (Type to update live)</label>
//                         <input
//                             type="text"
//                             className="form-input"
//                             placeholder="Enter hospital name..."
//                             value={settings.hospital || ''}
//                             onChange={(e) => handleSettingChange('hospital', e.target.value)}
//                         />
//                     </div>

//                     <div className="action-row">
//                         <button className="btn-primary" onClick={handleProfileSave}>
//                             {isSaved ? "✓ Profile Saved" : "Save Profile Details"}
//                         </button>
//                         <button className="btn-danger small" onClick={handleLogout}>
//                             <LogOut size={14} style={{ marginRight: 5 }} /> Logout
//                         </button>
//                     </div>
//                 </section>

//                 {/* 2. Diagnostic Preferences */}
//                 <section className="settings-section glass-panel">
//                     <div className="section-title">
//                         <Activity size={20} />
//                         <h3>Diagnostic Preferences</h3>
//                     </div>
//                     <div className="setting-item">
//                         <span className="setting-label">Default Imaging Modality</span>
//                         <div className="radio-group">
//                             {['X-Ray', 'CT', 'MRI'].map(m => (
//                                 <button
//                                     key={m}
//                                     className={`radio-btn ${settings.defaultModality === m ? 'active' : ''}`}
//                                     onClick={() => handleSettingChange('defaultModality', m)}
//                                 >{m}</button>
//                             ))}
//                         </div>
//                     </div>
//                     <div className="setting-item">
//                         <span className="setting-label">Auto-generate Case ID</span>
//                         <Toggle
//                             checked={settings.autoCaseId}
//                             onChange={() => handleSettingChange('autoCaseId', !settings.autoCaseId)}
//                         />
//                     </div>
//                     <div className="setting-item">
//                         <span className="setting-label">Default View Preset</span>
//                         <select
//                             className="select-input"
//                             value={settings.viewPreset}
//                             onChange={(e) => handleSettingChange('viewPreset', e.target.value)}
//                         >
//                             <option value="Lung">Lung</option>
//                             <option value="Bone">Bone</option>
//                             <option value="Soft Tissue">Soft Tissue</option>
//                         </select>
//                     </div>
//                 </section>

//                 {/* 3. AI & Analysis Settings */}
//                 <section className="settings-section glass-panel">
//                     <div className="section-title">
//                         <Brain size={20} />
//                         <h3>AI & Analysis</h3>
//                     </div>
//                     <SettingToggle label="Enable AI-Assisted Analysis" checked={settings.aiAssisted} onChange={() => handleSettingChange('aiAssisted', !settings.aiAssisted)} />
//                     <SettingToggle label="Show Confidence Scores" checked={settings.showConfidence} onChange={() => handleSettingChange('showConfidence', !settings.showConfidence)} />
//                     <SettingToggle label="Show Differential Diagnoses" checked={settings.diffDiagnosis} onChange={() => handleSettingChange('diffDiagnosis', !settings.diffDiagnosis)} />
//                     <SettingToggle label="Enable Visual Explainability (Grad-CAM)" checked={settings.visualExplainability} onChange={() => handleSettingChange('visualExplainability', !settings.visualExplainability)} />
//                     <SettingToggle label="Require Manual Review" checked={settings.manualReview} onChange={() => handleSettingChange('manualReview', !settings.manualReview)} />
//                 </section>

//                 {/* 7. Interface Settings */}
//                 <section className="settings-section glass-panel">
//                     <div className="section-title">
//                         <Monitor size={20} />
//                         <h3>Interface</h3>
//                     </div>
//                     <div className="setting-item">
//                         <span className="setting-label">Theme Mode</span>
//                         <div className="radio-group">
//                             <button
//                                 className={`radio-btn ${theme === 'dark' ? 'active' : ''}`}
//                                 onClick={() => handleSettingChange('theme', 'dark')}
//                             >Dark</button>
//                             <button
//                                 className={`radio-btn ${theme === 'light' ? 'active' : ''}`}
//                                 onClick={() => handleSettingChange('theme', 'light')}
//                             >Light</button>
//                         </div>
//                     </div>
//                     <SettingToggle label="Keyboard Shortcuts" checked={settings.shortcuts} onChange={() => handleSettingChange('shortcuts', !settings.shortcuts)} />
//                     <SettingToggle label="Auto-Save Form Inputs" checked={settings.autoSave} onChange={() => handleSettingChange('autoSave', !settings.autoSave)} />
//                 </section>

//                 {/* 8. System & Support */}
//                 <section className="settings-section glass-panel">
//                     <div className="section-title">
//                         <SettingsIcon size={20} />
//                         <h3>System & Support</h3>
//                     </div>
//                     <div className="setting-item">
//                         <span className="setting-label">App Version</span>
//                         <span className="setting-desc">v1.2.4 (Beta)</span>
//                     </div>
//                     <div className="setting-item clickable" onClick={clearCache}>
//                         <span className="setting-label text-danger">Clear Local Cache</span>
//                         <Trash2 size={16} className="text-danger" />
//                     </div>
//                 </section>

//             </div>
//         </div>
//     );
// };

// const SettingToggle = ({ label, checked, onChange }) => (
//     <div className="setting-item">
//         <span className="setting-label">{label}</span>
//         <Toggle checked={checked} onChange={onChange} />
//     </div>
// );

// const Toggle = ({ checked, onChange }) => (
//     <label className="switch">
//         <input type="checkbox" checked={checked} onChange={onChange} />
//         <span className="slider round"></span>
//     </label>
// );

// export default Settings;


import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
    User, Activity, Brain, Shield, Layout, Bell, Monitor, Settings as SettingsIcon,
    ChevronRight, Save, LogOut, Trash2
} from 'lucide-react';
import { getSettings, saveSettings } from '../utils/storage';
import './Settings.css';

const Settings = () => {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    
    const [settings, setSettings] = useState(getSettings());
    const [isSaved, setIsSaved] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    useEffect(() => {
        setSettings(prev => ({ ...prev, theme: theme }));
    }, [theme]);

    // UPDATED LOGIC: Handles the dependency between Modality and Disease
    const handleSettingChange = (key, value) => {
        setSettings(prev => {
            const newSettings = { ...prev, [key]: value };

            // Logic matching the Detect page:
            // If MRI is selected, auto-set disease to Tumor
            if (key === 'defaultModality') {
                if (value === 'MRI') {
                    newSettings.defaultDisease = 'Tumor';
                } else if (value === 'X-Ray') {
                    newSettings.defaultDisease = 'Pneumonia'; // Default choice for X-Ray
                }
            }

            saveSettings(newSettings);
            return newSettings;
        });

        if (key === 'theme' && value !== theme) {
            toggleTheme();
        }
    };

    const handleProfileSave = () => {
        saveSettings(settings);
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 3000);
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch {
            console.error("Failed to log out");
        }
    };

    const clearCache = () => {
        if (window.confirm('Are you sure you want to clear local cache? This will reset recent history.')) {
            localStorage.clear();
            window.location.reload();
        }
    };

    if (!currentUser) return null;

    return (
        <div className="settings-page page-transition container">
            <div className="settings-header">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your preferences, diagnostic tools, and account.</p>
            </div>

            <div className="settings-grid">

                {/* 1. Profile Settings */}
                <section className="settings-section glass-panel profile-highlight">
                    <div className="section-title">
                        <User size={20} />
                        <h3>Professional Profile</h3>
                    </div>
                    
                    <div className="live-profile-card">
                        <div className="profile-avatar-circle">
                            {(currentUser.doctor_name || 'D').charAt(0)}
                        </div>
                        <div className="profile-info-text">
                            <h4>{currentUser.doctor_name || 'Dr. User'}</h4>
                            <p className="hospital-tag">{settings.hospital || 'No Hospital Assigned'}</p>
                            <span className="badge">Active Session</span>
                        </div>
                    </div>

                    <div className="setting-form-group">
                        <label className="setting-label">Full Name</label>
                        <input type="text" className="form-input disabled" value={currentUser.doctor_name || 'Dr. User'} readOnly />
                    </div>
                    <div className="setting-form-group">
                        <label className="setting-label">Associated Hospital</label>
                        <input
                            type="text"
                            className="form-input"
                            value={settings.hospital || ''}
                            onChange={(e) => handleSettingChange('hospital', e.target.value)}
                        />
                    </div>

                    <div className="action-row">
                        <button className="btn-primary" onClick={handleProfileSave}>
                            {isSaved ? "✓ Profile Saved" : "Save Profile Details"}
                        </button>
                        <button className="btn-danger small" onClick={handleLogout}>
                            <LogOut size={14} style={{ marginRight: 5 }} /> Logout
                        </button>
                    </div>
                </section>

                {/* 2. UPDATED Diagnostic Preferences (Dynamic logic) */}
                <section className="settings-section glass-panel">
                    <div className="section-title">
                        <Activity size={20} />
                        <h3>Diagnostic Preferences</h3>
                    </div>
                    
                    <div className="setting-item">
                        <span className="setting-label">Default Imaging Modality</span>
                        <div className="radio-group">
                            {['X-Ray', 'MRI'].map(m => (
                                <button
                                    key={m}
                                    className={`radio-btn ${settings.defaultModality === m ? 'active' : ''}`}
                                    onClick={() => handleSettingChange('defaultModality', m)}
                                >{m}</button>
                            ))}
                        </div>
                    </div>

                    {/* DYNAMIC DISEASE PREFERENCE SECTION */}
                    <div className="setting-item animate-slide-down">
                        <span className="setting-label">Default Disease Type</span>
                        {settings.defaultModality === 'MRI' ? (
                            <input type="text" className="form-input disabled" style={{width: '120px', textAlign: 'center'}} value="Tumor" readOnly disabled />
                        ) : (
                            <div className="radio-group">
                                {['Pneumonia', 'Fracture'].map(d => (
                                    <button
                                        key={d}
                                        className={`radio-btn ${settings.defaultDisease === d ? 'active' : ''}`}
                                        onClick={() => handleSettingChange('defaultDisease', d)}
                                    >{d}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="setting-item">
                        <span className="setting-label">Auto-generate Case ID</span>
                        <Toggle
                            checked={settings.autoCaseId}
                            onChange={() => handleSettingChange('autoCaseId', !settings.autoCaseId)}
                        />
                    </div>
                    <div className="setting-item">
                        <span className="setting-label">Default View Preset</span>
                        <select
                            className="select-input"
                            value={settings.viewPreset}
                            onChange={(e) => handleSettingChange('viewPreset', e.target.value)}
                        >
                            <option value="Lung">Lung</option>
                            <option value="Bone">Bone</option>
                            <option value="Soft Tissue">Soft Tissue</option>
                        </select>
                    </div>
                </section>

                {/* 3. AI & Analysis Settings */}
                <section className="settings-section glass-panel">
                    <div className="section-title">
                        <Brain size={20} />
                        <h3>AI & Analysis</h3>
                    </div>
                    <SettingToggle label="Enable AI-Assisted Analysis" checked={settings.aiAssisted} onChange={() => handleSettingChange('aiAssisted', !settings.aiAssisted)} />
                    <SettingToggle label="Show Confidence Scores" checked={settings.showConfidence} onChange={() => handleSettingChange('showConfidence', !settings.showConfidence)} />
                    <SettingToggle label="Show Differential Diagnoses" checked={settings.diffDiagnosis} onChange={() => handleSettingChange('diffDiagnosis', !settings.diffDiagnosis)} />
                    <SettingToggle label="Enable Visual Explainability (Grad-CAM)" checked={settings.visualExplainability} onChange={() => handleSettingChange('visualExplainability', !settings.visualExplainability)} />
                    <SettingToggle label="Require Manual Review" checked={settings.manualReview} onChange={() => handleSettingChange('manualReview', !settings.manualReview)} />
                </section>

                {/* 4. Interface Settings */}
                <section className="settings-section glass-panel">
                    <div className="section-title">
                        <Monitor size={20} />
                        <h3>Interface</h3>
                    </div>
                    <div className="setting-item">
                        <span className="setting-label">Theme Mode</span>
                        <div className="radio-group">
                            <button
                                className={`radio-btn ${theme === 'dark' ? 'active' : ''}`}
                                onClick={() => handleSettingChange('theme', 'dark')}
                            >Dark</button>
                            <button
                                className={`radio-btn ${theme === 'light' ? 'active' : ''}`}
                                onClick={() => handleSettingChange('theme', 'light')}
                            >Light</button>
                        </div>
                    </div>
                    <SettingToggle label="Keyboard Shortcuts" checked={settings.shortcuts} onChange={() => handleSettingChange('shortcuts', !settings.shortcuts)} />
                    <SettingToggle label="Auto-Save Form Inputs" checked={settings.autoSave} onChange={() => handleSettingChange('autoSave', !settings.autoSave)} />
                </section>

            </div>
        </div>
    );
};

const SettingToggle = ({ label, checked, onChange }) => (
    <div className="setting-item">
        <span className="setting-label">{label}</span>
        <Toggle checked={checked} onChange={onChange} />
    </div>
);

const Toggle = ({ checked, onChange }) => (
    <label className="switch">
        <input type="checkbox" checked={checked} onChange={onChange} />
        <span className="slider round"></span>
    </label>
);

export default Settings;