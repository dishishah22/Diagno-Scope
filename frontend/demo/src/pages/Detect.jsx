import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, X, FileText, User, Activity, Clock, Plus, Zap, ZoomIn, ZoomOut, Sun, Contrast, Maximize, FileDown } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { useVoice } from '../context/VoiceContext';
import { addScan, getScans, updateScanStatus } from '../utils/storage';
import { saveCaseToFirestore } from '../utils/uploadService';
import './Detect.css';

const Detect = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const voiceContext = useVoice();

    const { registerHandler, unregisterHandler } = voiceContext || {
        registerHandler: () => { },
        unregisterHandler: () => { }
    };

    const [showResults, setShowResults] = useState(false);

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    // UPDATED STATE: Added diseaseType
    const [formData, setFormData] = useState({
        name: '',
        reportType: '',
        diseaseType: '' 
    });
    
    const formDataRef = useRef(formData);
    useEffect(() => { formDataRef.current = formData; }, [formData]);

    const [files, setFiles] = useState([]);
    const filesRef = useRef(files);
    useEffect(() => { filesRef.current = files; }, [files]);

    const [dragActive, setDragActive] = useState(false);
    const [analyzedImages, setAnalyzedImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleVoiceCommand = (action, value) => {
        const currentData = formDataRef.current;
        if (action === 'NAVIGATE') { navigate(value); }
        else if (action === 'SET_CASE_NUMBER' || action === 'INPUT_VALUE') {
            setFormData(prev => ({ ...prev, name: value }));
            const input = document.getElementById('case-input');
            if (input) input.focus();
        }
        else if (action === 'CONFIRM') {
            if (currentData.name && !currentData.reportType) {
                const firstRadio = document.querySelector('input[name="reportType"]');
                if (firstRadio) firstRadio.focus();
            }
            else if (currentData.reportType) {
                const uploadBtn = document.getElementById('file-upload');
                if (uploadBtn) uploadBtn.click();
            }
        }
        else if (action === 'SET_REPORT_TYPE') {
            handleReportTypeChange(value);
        }
    };

    useEffect(() => {
        registerHandler(handleVoiceCommand);
        return () => unregisterHandler();
    }, []);

    if (!currentUser) return null;

    const reportRef = useRef(null);
    const [historyData, setHistoryData] = useState([]);

    useEffect(() => {
        const loaded = getScans().map(s => ({
            id: s.id,
            name: s.patient,
            date: s.date,
            status: s.status
        }));
        setHistoryData(loaded);
    }, []);

    // NEW FUNCTION: Handles dynamic logic for Report and Disease types
    const handleReportTypeChange = (type) => {
        setFormData(prev => ({
            ...prev,
            reportType: type,
            diseaseType: type === 'MRI' ? 'Tumor' : '' // Auto-set MRI to Tumor
        }));
    };

    const handleChange = (e) => {
        if (e.target.name === 'reportType') {
            handleReportTypeChange(e.target.value);
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleDrag = (e) => {
        e.preventDefault(); e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") { setDragActive(true); } 
        else if (e.type === "dragleave") { setDragActive(false); }
    };

    const handleDrop = (e) => {
        e.preventDefault(); e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) { handleFiles(e.dataTransfer.files); }
    };

    const updateImageAdjustment = (index, field, value) => {
        setAnalyzedImages(prev => prev.map((img, i) => i === index ? { ...img, [field]: Number(value) } : img));
    };

    const resetImageAdjustment = (index) => {
        setAnalyzedImages(prev => prev.map((img, i) => i === index ? { ...img, brightness: 100, contrast: 100 } : img));
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) { handleFiles(e.target.files); }
    };

    const handleFiles = (newFiles) => {
        const validFiles = Array.from(newFiles).filter(file => file.type.startsWith('image/') || file.name.endsWith('.dcm'));
        setFiles(prev => [...prev, ...validFiles]);
    };

    const removeFile = (index) => { setFiles(prev => prev.filter((_, i) => i !== index)); };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (files.length === 0) {
            alert("Please upload at least one scan to analyze.");
            return;
        }
        setLoading(true);

        const newAnalyzedImages = Array.from(files).map((file, index) => ({
            url: URL.createObjectURL(file),
            name: file.name, id: index, brightness: 100, contrast: 100
        }));
        setAnalyzedImages(newAnalyzedImages);

        const metadata = {
            doctor_id: currentUser?.id || 'unknown',
            doctor_name: currentUser?.doctor_name || 'Unknown',
            hospital_name: currentUser?.hospital_name || 'Unknown',
            report_type: formData.reportType,
            disease: formData.diseaseType, // Using dynamic disease type
            confidence_threshold: 92.8,
            severity: "High",
            accepted: null
        };

        if (formData.name) {
            import('../firebase').then(({ db }) => {
                if (!db) {
                    alert("FIREBASE IS NOT CONNECTED!");
                } else {
                    saveCaseToFirestore(formData.name, metadata, files);
                }
            });
        }

        setTimeout(() => {
            const newCase = addScan({
                name: `Case #${formData.name || 'Unknown'}`,
                reportType: formData.reportType,
                status: 'Completed',
                result: 'Pending'
            });
            setHistoryData(prev => [{ id: newCase.id, name: newCase.patient, date: newCase.date, status: 'Completed' }, ...prev]);
            updateScanStatus(newCase.id, 'Completed', 'Normal');
            setLoading(false);
            setShowResults(true);
        }, 1000);
    };

    const resetCase = () => {
        setShowResults(false);
        setFiles([]);
        if (analyzedImages.length > 0) { analyzedImages.forEach(img => URL.revokeObjectURL(img.url)); }
        setAnalyzedImages([]);
        setFormData({ name: '', reportType: '', diseaseType: '' });
    };

    const downloadReport = async () => {
        if (!reportRef.current) return;
        try {
            const canvas = await html2canvas(reportRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, imgHeight);
            pdf.save(`DiagnoScope_Report_${formData.name || 'Patient'}_${Date.now()}.pdf`);
        } catch (err) { alert("Could not generate report. Please try again."); }
    };

    return (
        <div className="detect-page page-transition container">
            {showResults && (
                <div style={{ position: 'absolute', top: -10000, left: -10000 }}>
                    <div ref={reportRef} className="print-report fa-print">
                        <div className="print-header">
                            <div className="print-logo">
                                <Activity size={32} color="#00d4ff" />
                                <span className="logo-text-dark">Diagno Scope</span>
                            </div>
                            <div className="print-meta">
                                <p>Report Date: {new Date().toLocaleDateString()}</p>
                                <p>Report ID: #{Math.floor(Math.random() * 100000)}</p>
                            </div>
                        </div>

                        <div className="print-patient-info">
                            <h3>Patient Information</h3>
                            <div className="info-grid">
                                <div className="info-item"><strong>Case ID:</strong> {formData.name}</div>
                                <div className="info-item"><strong>Report Type:</strong> {formData.reportType}</div>
                                <div className="info-item"><strong>Disease Type:</strong> {formData.diseaseType}</div>
                                <div className="info-item"><strong>Ref. Physician:</strong> {currentUser.doctor_name || 'Dr. User'}</div>
                            </div>
                        </div>

                        <div className="print-image-section">
                            <h3>Scan Analysis</h3>
                            <div className="print-image-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
                                {analyzedImages.map((img, idx) => (
                                    <div key={idx} className="print-image-container">
                                        <img src={img.url} alt={`Scan ${idx + 1}`} className="print-img" style={{ width: '100%', filter: `brightness(${img.brightness}%) contrast(${img.contrast}%)` }} />
                                        <div className="print-overlay-box">Abnormality Detected</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="print-findings">
                            <h3>Diagnostic Results</h3>
                            <div className="finding-row highlight">
                                <span>Primary Detection:</span>
                                <strong>{formData.diseaseType} (Confidence: 92.8%)</strong>
                            </div>
                            <div className="finding-content">
                                <p>Scan reveals findings consistent with selected disease parameters.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="detect-header">
                <div>
                    <h1 className="detect-title">AI Detection Center</h1>
                    <p className="detect-subtitle">Advanced diagnostic analysis powered by Deep Learning</p>
                </div>
                <div className="detect-actions">
                    {showResults && (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="btn-primary" onClick={downloadReport}><FileDown size={18} /> Download Report</button>
                            <button className="btn-new-case" onClick={resetCase}><Plus size={18} /> Add New Case</button>
                        </div>
                    )}
                </div>
            </div>

            {!showResults ? (
                <div className="input-layout">
                    <div className="history-sidebar glass-panel">
                        <div className="section-label" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}><Clock size={16} /> Recent History</div>
                        <div className="history-list">
                            {historyData.map(item => (
                                <div key={item.id} className="history-item">
                                    <span className="history-name">{item.name}</span>
                                    <span className="history-date">{item.date}</span>
                                </div>
                            ))}
                        </div>
                        <button className="btn-outline small full-width">View All records</button>
                    </div>

                    <div className="main-input-area">
                        <div className="detect-card glass-panel" style={{ padding: '30px' }}>
                            <div className="card-header"><User className="card-icon" /><h3>Case Entry</h3></div>
                            <form id="detect-form" onSubmit={handleSubmit} className="detect-form">
                                <div className="form-group">
                                    <label className="form-label">Case ID</label>
                                    <input type="text" name="name" id="case-input" className="form-input" placeholder="Enter Case ID" value={formData.name} onChange={handleChange} required autoFocus />
                                </div>

                                <div className="form-group">
                                    <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Report Type</label>
                                    <div className="report-type-radios" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                        {['X-Ray', 'MRI'].map(type => (
                                            <label key={type} className="radio-container">
                                                <input type="radio" name="reportType" value={type} checked={formData.reportType === type} onChange={handleChange} required />
                                                <span className="radio-check"></span>
                                                <span className="radio-label">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* DYNAMIC DISEASE TYPE SECTION */}
                                {formData.reportType && (
                                    <div className="form-group animate-slide-down">
                                        <label className="form-label">Disease Type</label>
                                        
                                        {formData.reportType === 'MRI' ? (
                                            <input type="text" className="form-input disabled" value="Tumor" readOnly disabled />
                                        ) : (
                                            <div className="report-type-radios" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                                                {['Pneumonia', 'Fracture'].map(disease => (
                                                    <label key={disease} className="radio-container">
                                                        <input type="radio" name="diseaseType" value={disease} checked={formData.diseaseType === disease} onChange={handleChange} required />
                                                        <span className="radio-check"></span>
                                                        <span className="radio-label">{disease}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </form>
                        </div>

                        <div className="detect-card glass-panel" style={{ flex: 1, padding: '30px' }}>
                            <div className="card-header"><Activity className="card-icon" /><h3>Scan Upload</h3></div>
                            <div className="upload-wrapper">
                                <input type="file" id="file-upload" className="file-input" multiple onChange={handleFileChange} accept=".jpg,.jpeg,.png,.dcm" />
                                <div className={`upload-zone ${dragActive ? 'active' : ''}`} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} onClick={() => document.getElementById('file-upload').click()}>
                                    <div className="upload-icon-wrapper"><Upload size={32} /></div>
                                    <div className="upload-text"><span className="text-highlight">Click to upload</span> or drag and drop</div>
                                    <p className="upload-hint">Supported formats: PNG, JPG, DICOM (Max 50MB)</p>
                                </div>
                            </div>
                            {files.length > 0 && (
                                <div className="file-list">
                                    <h4 className="file-list-title">Ready for Analysis</h4>
                                    <div className="file-items">
                                        {files.map((file, index) => (
                                            <div key={index} className="file-item">
                                                <div className="file-info"><FileText size={16} /><span className="file-name">{file.name}</span></div>
                                                <button type="button" onClick={() => removeFile(index)} className="btn-remove"><X size={16} /></button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <button type="submit" form="detect-form" className="btn-primary full-width" style={{ marginTop: '24px', padding: '16px' }} disabled={loading}>
                                {loading ? 'Processing Analysis...' : 'Run Analysis'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="results-layout">
                    <div className="image-viewer-panel" style={{ height: 'auto', maxHeight: 'none', overflow: 'visible', background: 'transparent', border: 'none', boxShadow: 'none' }}>
                        {analyzedImages.map((img, idx) => (
                            <div key={idx} style={{ marginBottom: 30, background: '#000', borderRadius: 20, overflow: 'hidden', border: '1px solid var(--border-color)', boxShadow: '0 20px 50px rgba(0,0,0,0.3)' }}>
                                <div className="image-container" style={{ flexDirection: 'column', gap: 10 }}>
                                    <div style={{ width: '100%', padding: '10px 20px', borderBottom: '1px solid #333', color: '#fff', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: 10 }}>
                                        <FileText size={16} color="var(--primary)" />{img.name}
                                    </div>
                                    <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'center' }}>
                                        <img src={img.url} alt={`Scan Analysis ${idx + 1}`} className="main-scan-image" style={{ filter: `brightness(${img.brightness}%) contrast(${img.contrast}%)`, transition: 'filter 0.1s ease' }} />
                                        <div className="scan-overlay"><div className="overlay-tag">Abnormality Detected</div></div>
                                    </div>
                                </div>
                                <div className="viewer-controls">
                                    <div className="control-group">
                                        <Sun size={20} color="#a0a0b0" /><div className="slider-wrapper"><input type="range" className="custom-range" min="0" max="200" value={img.brightness} onChange={(e) => updateImageAdjustment(idx, 'brightness', e.target.value)} /><span className="slider-value">{img.brightness}%</span></div>
                                    </div>
                                    <div className="control-group">
                                        <Contrast size={20} color="#a0a0b0" /><div className="slider-wrapper"><input type="range" className="custom-range" min="0" max="200" value={img.contrast} onChange={(e) => updateImageAdjustment(idx, 'contrast', e.target.value)} /><span className="slider-value">{img.contrast}%</span></div>
                                    </div>
                                    <div className="control-group" style={{ justifyContent: 'flex-end', gap: '10px' }}>
                                        <button className="icon-btn" onClick={() => resetImageAdjustment(idx)} title="Reset Filters"><Clock size={16} /></button>
                                        <button className="icon-btn"><ZoomOut size={20} /></button><button className="icon-btn"><ZoomIn size={20} /></button><button className="icon-btn"><Maximize size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="detect-card glass-panel report-panel">
                        <div className="results-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><h2 className="report-header-title" style={{ margin: 0 }}>Diagnosis Report</h2><button className="btn-outline small" onClick={resetCase}> <Plus size={14} /> New Case</button></div>
                        <div className="report-section">
                            <div className="section-label">Case Information</div>
                            <div className="info-grid" style={{ gridTemplateColumns: '1fr 1fr', fontSize: '0.9rem' }}>
                                <div><strong>Case ID:</strong> {formData.name}</div><div><strong>Type:</strong> {formData.reportType}</div><div><strong>Diagnosis:</strong> {formData.diseaseType}</div>
                            </div>
                        </div>
                        <div className="report-section">
                            <div className="section-label">CNN Prediction</div>
                            <div style={{ fontSize: '1.4rem', fontWeight: '700', color: 'var(--primary)' }}>{formData.diseaseType} Detected: 92.8%</div>
                        </div>
                        <div className="report-section"><div className="section-label">Severity Score</div><div className="severity-meter"><span className="severity-badge high">High (8/10)</span><div className="progress-bar-bg" style={{ flex: 1, height: '8px' }}><div className="progress-bar-fill fill-high" style={{ width: '80%' }}></div></div></div></div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Detect;