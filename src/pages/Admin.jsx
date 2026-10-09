import { useState, useEffect, useRef } from 'react';
import AnimatedPage from '../components/AnimatedPage';
import PhotoCropper from '../components/PhotoCropper';
import { LogOut, RefreshCw, Send, KeyRound, AlertCircle, CheckCircle2, FileText, Upload, Trash2, ExternalLink } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const Admin = () => {
  const [token, setToken] = useState(localStorage.getItem('admin_token'));
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [serverError, setServerError] = useState('');
  const [uncroppedSrc, setUncroppedSrc] = useState(null);
  const photoInputRef = useRef(null);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setServerError('');
    try {
      const res = await fetch(`${API_BASE}/api/data`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error('Fetch data error:', e);
      setServerError('Unable to connect to backend server. Ensure "node server/index.js" is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMessage('');
    setServerError('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'varunbb30@gmail.com' })
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok) {
        setOtpSent(true);
        setMessage('OTP sent to varunbb30@gmail.com! Check your inbox.');
      } else {
        setMessage(json.error || 'Failed to send OTP. Please check server logs.');
      }
    } catch (e) {
      console.error(e);
      setMessage('Network error: Backend server is offline or unreachable on ' + API_BASE);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ otp: otp.trim() })
      });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.token) {
        setToken(json.token);
        localStorage.setItem('admin_token', json.token);
        setMessage('');
        setOtpSent(false);
        setOtp('');
      } else {
        setMessage(json.error || 'Invalid or expired OTP. Please try again.');
      }
    } catch (e) {
      console.error(e);
      setMessage('Network error verifying OTP. Please check server status.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('admin_token');
    setData(null);
    setOtpSent(false);
    setOtp('');
    setMessage('Logged out successfully.');
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        setMessage('Saved changes successfully!');
      } else {
        if (res.status === 401) {
          handleLogout();
          setMessage('Session expired. Please log in again.');
        } else {
          setMessage('Failed to save data. Please check server logs.');
        }
      }
    } catch (e) {
      console.error(e);
      setMessage('Network error saving data.');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handlePhotoLoad = (file) => {
    const reader = new FileReader();
    reader.onload = e => {
      setUncroppedSrc(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageBlobUrl) => {
    setUncroppedSrc(null);
    setLoading(true);
    setMessage('Uploading photo to Supabase S3...');
    
    try {
      const response = await fetch(croppedImageBlobUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const res = await fetch(`${API_BASE}/api/upload-s3-photo`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ image: base64data })
        });
        
        if (res.ok) {
          const json = await res.json();
          
          setData(prev => {
            const newData = {
              ...prev,
              profile: {
                ...prev.profile,
                photos: [...(prev.profile.photos || []), { url: json.url, key: json.key }]
              }
            };
            
            // Auto-save to backend
            fetch(`${API_BASE}/api/data`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(newData)
            }).then(() => setMessage('Photo uploaded & saved successfully!'));

            return newData;
          });
        } else {
          setMessage('Failed to upload photo to S3 storage');
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 4000);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error(e);
      setMessage('Error processing photo');
      setLoading(false);
    }
  };

  const handleDeletePhoto = async (photoKey) => {
    if (!window.confirm('Delete this photo?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/delete-s3-photo`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ key: photoKey })
      });
      if (res.ok) {
        setData(prev => {
          const newData = {
            ...prev,
            profile: {
              ...prev.profile,
              photos: (prev.profile.photos || []).filter(p => p.key !== photoKey)
            }
          };

          // Auto-save to backend
          fetch(`${API_BASE}/api/data`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newData)
          }).then(() => setMessage('Photo removed and saved!'));

          return newData;
        });
      } else {
        setMessage('Failed to delete photo from storage');
      }
    } catch (e) {
      console.error(e);
      setMessage('Network error deleting photo');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const handleCvUpload = async (file) => {
    if (!file) return;
    setLoading(true);
    setMessage('Uploading CV/Resume...');
    
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64data = reader.result;
        
        const res = await fetch(`${API_BASE}/api/upload-cv`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            file: base64data,
            fileName: file.name,
            fileType: file.type
          })
        });
        
        if (res.ok) {
          const json = await res.json();
          setData(prev => {
            const newData = {
              ...prev,
              profile: {
                ...prev.profile,
                cvUrl: json.url,
                cvKey: json.key,
                cvName: json.name || file.name,
                cvUpdatedAt: json.updatedAt || new Date().toISOString()
              }
            };
            
            // Auto-save to backend
            fetch(`${API_BASE}/api/data`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
              body: JSON.stringify(newData)
            }).then(() => setMessage('CV uploaded and saved successfully!'));

            return newData;
          });
        } else {
          const errData = await res.json().catch(() => ({}));
          setMessage(errData.error || 'Failed to upload CV');
        }
        setLoading(false);
        setTimeout(() => setMessage(''), 4000);
      };
      reader.readAsDataURL(file);
    } catch (e) {
      console.error(e);
      setMessage('Error reading CV file');
      setLoading(false);
    }
  };

  const handleDeleteCv = async () => {
    if (!data?.profile?.cvKey && !data?.profile?.cvUrl) return;
    if (!window.confirm('Are you sure you want to remove the uploaded CV?')) return;
    
    setLoading(true);
    try {
      if (data.profile.cvKey) {
        await fetch(`${API_BASE}/api/delete-cv`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ key: data.profile.cvKey })
        });
      }
      
      setData(prev => {
        const newData = {
          ...prev,
          profile: {
            ...prev.profile,
            cvUrl: '',
            cvKey: '',
            cvName: '',
            cvUpdatedAt: ''
          }
        };

        fetch(`${API_BASE}/api/data`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
          body: JSON.stringify(newData)
        }).then(() => setMessage('CV removed successfully!'));

        return newData;
      });
    } catch (e) {
      console.error(e);
      setMessage('Error deleting CV');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 4000);
    }
  };

  const updateProfile = (key, value) => {
    setData(prev => ({ ...prev, profile: { ...prev.profile, [key]: value } }));
  };

  const updateProject = (index, key, value) => {
    const newProjects = [...data.projects];
    newProjects[index][key] = value;
    setData(prev => ({ ...prev, projects: newProjects }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [
        ...prev.projects,
        { num: `PROJECT_0${prev.projects.length + 1}`, title: '', desc: '', tech: [], metric: '', github: '', live: '' }
      ]
    }));
  };

  const removeProject = (index) => {
    if (!window.confirm('Are you sure you want to remove this project?')) return;
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const adminStyles = `
    .admin-container { padding: 120px 80px; max-width: 1200px; margin: 0 auto; }
    .form-group { margin-bottom: 20px; }
    .form-group label { display: block; margin-bottom: 8px; color: var(--accent); font-size: 0.8rem; letter-spacing: 0.1em; text-transform: uppercase; }
    .input-field { width: 100%; padding: 12px; background: var(--card); border: 1px solid var(--border); color: var(--fg); font-family: var(--mono); }
    .input-field:focus { border-color: var(--accent); outline: none; }
    .msg { margin-top: 14px; font-size: 0.8rem; line-height: 1.5; padding: 10px 14px; border-radius: 4px; }
    .msg.error { color: #ff6b6b; background: rgba(255,107,107,0.1); border: 1px solid rgba(255,107,107,0.3); }
    .msg.success { color: var(--accent); background: rgba(0,255,136,0.1); border: 1px solid rgba(0,255,136,0.3); }
    .project-card-edit { background: var(--bg2); border: 1px solid var(--border); padding: 24px; margin-bottom: 24px; position: relative; }
    .upload-btn { position: relative; overflow: hidden; display: inline-block; cursor: pointer; }
    .upload-btn input[type="file"] { position: absolute; left: 0; top: 0; opacity: 0; cursor: pointer; width: 100%; height: 100%; }
    .btn-danger { background: rgba(255,80,80,0.15); color: #ff6b6b; border: 1px solid rgba(255,80,80,0.3); padding: 8px 16px; cursor: pointer; font-family: var(--mono); font-size: 0.75rem; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; }
    .btn-danger:hover { background: rgba(255,80,80,0.3); color: #fff; }
    @media (max-width: 900px) { .admin-container { padding: 120px 32px; } }
  `;

  return (
    <AnimatedPage>
      <style>{adminStyles}</style>
      <div className="admin-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <h2 className="section-title" style={{ margin: 0 }}>Admin Portal</h2>
            <p style={{ color: 'var(--dim)', fontSize: '0.75rem', marginTop: '6px' }}>Manage portfolio data &amp; profile information</p>
          </div>
          {token && (
            <button className="btn-danger" onClick={handleLogout} title="Log out of admin portal">
              <LogOut size={14} />
              <span>Log Out</span>
            </button>
          )}
        </div>

        {/* NOT LOGGED IN STATE */}
        {!token ? (
          <div style={{ maxWidth: '440px', background: 'var(--bg2)', padding: '40px', border: '1px solid var(--border)', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', color: 'var(--accent)' }}>
              <KeyRound size={22} />
              <h3 style={{ fontSize: '1.2rem', margin: 0 }}>Administrator Access</h3>
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp}>
                <p style={{ marginBottom: '24px', color: 'var(--fg2)', fontSize: '0.8rem', lineHeight: '1.6' }}>
                  A one-time verification code will be sent to the registered email: <strong style={{ color: 'var(--fg)' }}>varunbb30@gmail.com</strong>
                </p>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                  <Send size={15} />
                  <span>{loading ? 'Sending OTP...' : 'Send Verification OTP'}</span>
                </button>
                {message && (
                  <div className={`msg ${message.includes('sent') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp}>
                <p style={{ marginBottom: '16px', color: 'var(--accent)', fontSize: '0.8rem' }}>
                  ✓ OTP dispatched to varunbb30@gmail.com. Please enter it below:
                </p>
                <div className="form-group">
                  <label>6-Digit OTP Code</label>
                  <input 
                    type="text" 
                    className="input-field" 
                    placeholder="e.g. 123456" 
                    value={otp} 
                    onChange={e => setOtp(e.target.value)} 
                    maxLength={6}
                    autoFocus
                    required 
                  />
                </div>
                <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginBottom: '12px' }}>
                  <span>{loading ? 'Verifying...' : 'Verify &amp; Enter Dashboard'}</span>
                </button>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <button 
                    type="button" 
                    onClick={() => { setOtpSent(false); setMessage(''); }} 
                    style={{ background: 'none', border: 'none', color: 'var(--dim)', cursor: 'pointer', fontSize: '0.75rem', textDecoration: 'underline' }}
                  >
                    ← Back
                  </button>
                  <button 
                    type="button" 
                    onClick={handleSendOtp} 
                    disabled={loading}
                    style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.75rem' }}
                  >
                    Resend Code
                  </button>
                </div>

                {message && (
                  <div className={`msg ${message.includes('sent') ? 'success' : 'error'}`}>
                    {message}
                  </div>
                )}
              </form>
            )}
          </div>
        ) : serverError ? (
          <div style={{ background: 'var(--bg2)', border: '1px solid rgba(255,107,107,0.3)', padding: '32px', borderRadius: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ff6b6b', marginBottom: '16px' }}>
              <AlertCircle size={20} />
              <h3 style={{ margin: 0 }}>Backend Connection Error</h3>
            </div>
            <p style={{ color: 'var(--fg2)', fontSize: '0.85rem', marginBottom: '24px', lineHeight: '1.6' }}>
              {serverError}
            </p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn-primary" onClick={fetchData} disabled={loading}>
                <span>{loading ? 'Retrying...' : 'Retry Connection'}</span>
              </button>
              <button className="btn-outline" onClick={handleLogout}>
                <span>Clear Session &amp; Login Again</span>
              </button>
            </div>
          </div>
        ) : data ? (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
              <h3 style={{ color: 'var(--accent3)', margin: 0 }}>Edit Portfolio Content</h3>
              
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <div className="btn-outline upload-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <FileText size={14} />
                  <span>+ Upload CV</span>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,application/pdf" 
                    onChange={(e) => {
                      if (e.target.files[0]) handleCvUpload(e.target.files[0]);
                    }}
                  />
                </div>
                <div className="btn-outline upload-btn" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={14} />
                  <span>+ Upload Photo</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files[0]) handlePhotoLoad(e.target.files[0]);
                    }}
                  />
                </div>
                <button className="btn-primary" onClick={handleSave} disabled={loading}>
                  <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
                </button>
              </div>
            </div>

            {message && (
              <div className={`msg ${message.includes('success') || message.includes('uploaded') ? 'success' : 'error'}`} style={{ marginBottom: '24px' }}>
                {message}
              </div>
            )}

            {/* CV / Resume Management Section */}
            <div style={{ marginBottom: '32px', background: 'var(--bg2)', padding: '24px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <h4 style={{ margin: 0, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <FileText size={16} />
                    Curriculum Vitae (CV) / Resume
                  </h4>
                  <p style={{ margin: '4px 0 0', color: 'var(--dim)', fontSize: '0.72rem' }}>
                    Uploaded document will be served when visitors click "Download CV" at the top left.
                  </p>
                </div>
                
                <div className="btn-primary upload-btn" style={{ padding: '8px 16px', fontSize: '0.75rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <Upload size={13} />
                  <span>{data.profile?.cvUrl ? 'Replace CV' : 'Upload CV'}</span>
                  <input 
                    type="file" 
                    accept=".pdf,.doc,.docx,application/pdf" 
                    onChange={(e) => {
                      if (e.target.files[0]) handleCvUpload(e.target.files[0]);
                    }}
                  />
                </div>
              </div>

              {data.profile?.cvUrl ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--card)', padding: '16px 20px', borderRadius: '6px', border: '1px solid var(--border)', flexWrap: 'wrap', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ width: '42px', height: '42px', borderRadius: '6px', background: 'rgba(0, 255, 136, 0.1)', border: '1px solid rgba(0, 255, 136, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                      <FileText size={22} />
                    </div>
                    <div>
                      <div style={{ color: 'var(--fg)', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'var(--mono)' }}>
                        {data.profile.cvName || 'Nihal_Yadav_CV.pdf'}
                      </div>
                      <div style={{ color: 'var(--dim)', fontSize: '0.7rem', marginTop: '3px' }}>
                        {data.profile.cvUpdatedAt ? `Last updated: ${new Date(data.profile.cvUpdatedAt).toLocaleString()}` : 'CV Active & Ready for download'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <a 
                      href={data.profile.cvUrl.startsWith('http') ? data.profile.cvUrl : `${API_BASE}${data.profile.cvUrl}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-outline"
                      style={{ padding: '6px 14px', fontSize: '0.72rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                    >
                      <ExternalLink size={13} />
                      <span>Preview / Download</span>
                    </a>
                    <button 
                      className="btn-danger" 
                      onClick={handleDeleteCv}
                      style={{ padding: '6px 14px', fontSize: '0.72rem' }}
                      title="Delete current CV"
                    >
                      <Trash2 size={13} />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div style={{ padding: '24px', textAlign: 'center', border: '1px dashed var(--border)', borderRadius: '6px', color: 'var(--dim)', fontSize: '0.8rem' }}>
                  <p style={{ margin: '0 0 12px 0' }}>No custom CV uploaded yet. The top left button currently falls back to your online portfolio link.</p>
                  <div className="btn-outline upload-btn" style={{ padding: '8px 18px', fontSize: '0.75rem' }}>
                    <span>+ Choose CV File (PDF/DOCX)</span>
                    <input 
                      type="file" 
                      accept=".pdf,.doc,.docx,application/pdf" 
                      onChange={(e) => {
                        if (e.target.files[0]) handleCvUpload(e.target.files[0]);
                      }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Gallery UI */}
            <div style={{ marginBottom: '40px', background: 'var(--bg2)', padding: '24px', border: '1px solid var(--border)', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '20px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                Uploaded Photos (Slideshow)
              </h4>
              <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '16px' }}>
                {(data.profile?.photos || []).length === 0 && (
                  <span style={{ color: 'var(--dim)', fontSize: '0.8rem' }}>No photos uploaded. Default photo will be used.</span>
                )}
                {(data.profile?.photos || []).map((photo, idx) => (
                  <div key={idx} style={{ position: 'relative', width: '140px', height: '140px', flexShrink: 0, borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                    <img 
                      src={photo.url} 
                      alt={`photo-${idx}`} 
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/profile.jpg';
                      }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <button 
                      onClick={() => handleDeletePhoto(photo.key)}
                      style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,50,50,0.85)', color: 'white', border: 'none', borderRadius: '4px', padding: '4px 8px', cursor: 'pointer', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              {/* Profile Details */}
              <div>
                <h4 style={{ marginBottom: '20px', color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem' }}>
                  Profile Info
                </h4>
                {Object.keys(data.profile || {}).filter(k => !['photos', 'cvUrl', 'cvKey', 'cvName', 'cvUpdatedAt'].includes(k)).map(key => (
                  <div className="form-group" key={key}>
                    <label>{key}</label>
                    {key === 'bio' ? (
                      <textarea 
                        className="input-field" 
                        rows="6" 
                        value={data.profile[key]} 
                        onChange={e => updateProfile(key, e.target.value)} 
                      />
                    ) : (
                      <input 
                        type="text" 
                        className="input-field" 
                        value={data.profile[key]} 
                        onChange={e => updateProfile(key, e.target.value)} 
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Projects List */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h4 style={{ color: 'var(--dim)', textTransform: 'uppercase', letterSpacing: '0.1em', fontSize: '0.75rem', margin: 0 }}>
                    Projects ({(data.projects || []).length})
                  </h4>
                  <button className="btn-outline" onClick={addProject} style={{ padding: '8px 16px', fontSize: '0.65rem' }}>
                    + Add Project
                  </button>
                </div>
                
                {(data.projects || []).map((proj, idx) => (
                  <div key={idx} className="project-card-edit">
                    <button 
                      onClick={() => removeProject(idx)}
                      style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem' }}
                    >
                      ✕ Remove
                    </button>
                    <div className="form-group">
                      <label>Project ID / Num</label>
                      <input type="text" className="input-field" value={proj.num} onChange={e => updateProject(idx, 'num', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Title</label>
                      <input type="text" className="input-field" value={proj.title} onChange={e => updateProject(idx, 'title', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <textarea className="input-field" rows="3" value={proj.desc} onChange={e => updateProject(idx, 'desc', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Key Metric / Highlight</label>
                      <input type="text" className="input-field" value={proj.metric} onChange={e => updateProject(idx, 'metric', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>GitHub URL</label>
                      <input type="text" className="input-field" value={proj.github} onChange={e => updateProject(idx, 'github', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Tech (comma separated)</label>
                      <input 
                        type="text" 
                        className="input-field" 
                        value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech} 
                        onChange={e => updateProject(idx, 'tech', e.target.value.split(',').map(s => s.trim()))} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--dim)' }}>
            <p>Loading admin data...</p>
          </div>
        )}
      </div>

      {uncroppedSrc && (
        <PhotoCropper 
          imageSrc={uncroppedSrc} 
          onCropCompleteHandler={handleCropComplete} 
          onCancel={() => setUncroppedSrc(null)} 
        />
      )}
    </AnimatedPage>
  );
};

export default Admin;
