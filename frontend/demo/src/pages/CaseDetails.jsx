
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getScans } from '../utils/storage';
import { saveCaseToFirestore } from '../utils/uploadService';
import { Upload, FileText, Image as ImageIcon, ArrowLeft, Calendar, File } from 'lucide-react';
import './CaseDetails.css';

const CaseDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { currentUser } = useAuth();

    const [caseData, setCaseData] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [files, setFiles] = useState([]);

    // In a real app with Firestore fully integrated, we would fetch from 'cases' collection here.
    // For now, we load from our local storage simulation to show the UI
    // BUT we will enable the REAL upload button as requested.
    useEffect(() => {
        const allScans = getScans();
        // Convert ID to number if it matches, otherwise string
        const found = allScans.find(s => s.id == id);
        if (found) {
            setCaseData(found);
            // Initialize image_urls if not present
            if (!found.image_urls) {
                found.image_urls = [];
            }
        }
    }, [id]);

    const handleFileSelect = (e) => {
        if (e.target.files) {
            setFiles(Array.from(e.target.files));
        }
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        try {
            // Unified Save: Uploads AND Updates Firestore
            // We pass {} as metadata so we don't overwrite existing fields unless necessary
            const uploadedUrls = await saveCaseToFirestore(String(id), {}, files);

            if (uploadedUrls && uploadedUrls.length > 0) {
                alert("Files uploaded to Cloudinary and linked in Firestore successfully!");

                // 3. Update Local State to show the new images immediately
                setCaseData(prev => ({
                    ...prev,
                    image_urls: [...(prev.image_urls || []), ...uploadedUrls]
                }));
                setFiles([]);
            } else {
                alert("Upload completed but no URLs returned. (Check permissions/network)");
            }

        } catch (error) {
            console.error("Upload failed", error);
            alert("Upload failed. Check console for details.");
        } finally {
            setUploading(false);
        }
    };

    if (!caseData) return <div className="container" style={{ paddingTop: 100 }}>Loading or Case Not Found...</div>;

    return (
        <div className="case-details-page container page-transition">
            <button className="btn-text" onClick={() => navigate('/dashboard')} style={{ marginBottom: 20 }}>
                <ArrowLeft size={16} style={{ marginRight: 6 }} /> Back to Dashboard
            </button>

            <div className="glass-panel">
                <header className="case-header">
                    <div>
                        <h1 className="case-title">{caseData.patient || caseData.name}</h1>
                        <div className="case-meta">
                            <span className="meta-item"><Calendar size={14} /> {caseData.date}</span>
                            <span className={`case-status status-${caseData.status?.toLowerCase() || 'pending'}`}>
                                {caseData.status}
                            </span>
                        </div>
                    </div>
                </header>

                <div>
                    <h3>Diagnostic Images</h3>
                    <div className="gallery-grid">
                        {/* Existing or New Cloudinary Images */}
                        {caseData.image_urls && caseData.image_urls.map((url, idx) => (
                            <div key={idx} className="gallery-item">
                                {url.includes('/raw/') || url.endsWith('.dcm') ? (
                                    <div className="dicom-placeholder">
                                        <FileText size={32} />
                                        <span className="dicom-label">DICOM FILE</span>
                                    </div>
                                ) : (
                                    <img src={url} alt={`Scan ${idx}`} className="gallery-img" />
                                )}
                            </div>
                        ))}
                        {(!caseData.image_urls || caseData.image_urls.length === 0) && (
                            <div className="text-muted" style={{ gridColumn: '1/-1', padding: 20 }}>
                                No images uploaded yet.
                            </div>
                        )}
                    </div>
                </div>

                <div className="upload-section">
                    <h4>Upload New Scans</h4>
                    <p className="text-muted" style={{ marginBottom: 16 }}>Supported: JPG, PNG, DICOM (.dcm)</p>

                    <input
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.dcm"
                        onChange={handleFileSelect}
                        id="case-file-upload"
                        style={{ display: 'none' }}
                    />

                    {!files.length ? (
                        <label htmlFor="case-file-upload" className="btn-outline upload-btn">
                            <Upload size={18} /> Select Files
                        </label>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                            <span>{files.length} file(s) selected</span>
                            <button
                                className="upload-btn"
                                onClick={handleUpload}
                                disabled={uploading}
                            >
                                {uploading ? 'Uploading...' : 'Confirm Upload'}
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default CaseDetails;
