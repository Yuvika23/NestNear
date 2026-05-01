// src/components/AuthModal.jsx
// Login + Register in one modal — clean, minimal, warm

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ onClose, onSuccess }) {
  const { login, register } = useAuth();
  const [tab, setTab]       = useState('login'); // 'login' | 'register'
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const [form, setForm] = useState({
    name: '', email: '', password: '', college: '', year: '', role: 'student'
  });

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async () => {
    setError('');
    if (!form.email || !form.password) { setError('Email and password are required.'); return; }
    if (tab === 'register' && !form.name) { setError('Name is required.'); return; }

    setLoading(true);
    try {
      if (tab === 'login') {
        await login(form.email, form.password);
      } else {
        await register({
          name:    form.name,
          email:   form.email,
          password: form.password,
          college: form.college,
          year:    form.year ? Number(form.year) : undefined,
          role:    form.role,
          phone: form.phone,
        });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') handleSubmit(); };

  return (
    <div className="modal-overlay open" onClick={e => e.target.classList.contains('modal-overlay') && onClose()}>
      <div className="modal auth-modal">
        {/* Header */}
        <div className="auth-header">
          <div className="logo" style={{ fontSize:'1.3rem' }}>Nest<span>Near</span></div>
          <button className="modal-close" style={{ position:'static' }} onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        <div className="auth-tabs">
          <button className={`auth-tab ${tab === 'login' ? 'active' : ''}`} onClick={() => { setTab('login'); setError(''); }}>
            Login
          </button>
          <button className={`auth-tab ${tab === 'register' ? 'active' : ''}`} onClick={() => { setTab('register'); setError(''); }}>
            Register
          </button>
        </div>

        <div className="auth-body">
          <div className="auth-headline">
            {tab === 'login' ? 'Welcome back 👋' : 'Join NestNear 🏠'}
          </div>
          <div className="auth-subline">
            {tab === 'login'
              ? 'Login to save PGs, add listings and write reviews.'
              : 'Create an account to add PG listings and help fellow students.'}
          </div>

          {error && (
            <div className="auth-error">⚠️ {error}</div>
          )}

          {/* Register-only fields */}
          {tab === 'register' && (
            <>
              <div className="form-group">
                <label>Full Name *</label>
                <input className="form-input" placeholder="Your name" value={form.name}
                  onChange={e => set('name', e.target.value)} onKeyDown={handleKey} />
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" placeholder="10-digit mobile number"
                  value={form.phone} onChange={e => set('phone', e.target.value)} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>College</label>
                  <input className="form-input" placeholder="SRM Kattankulathur" value={form.college}
                    onChange={e => set('college', e.target.value)} />
                </div>
                <div className="form-group">
                  <label>Year</label>
                  <select className="form-input" value={form.year} onChange={e => set('year', e.target.value)}>
                    <option value="">Select</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>I am a</label>
                <div className="role-picker">
                  <button type="button"
                    className={`role-btn ${form.role === 'student' ? 'active' : ''}`}
                    onClick={() => set('role', 'student')}>🎓 Student</button>
                  <button type="button"
                    className={`role-btn ${form.role === 'owner' ? 'active' : ''}`}
                    onClick={() => set('role', 'owner')}>🏠 PG Owner</button>
                </div>
              </div>
            </>
          )}

          {/* Common fields */}
          <div className="form-group">
            <label>Email *</label>
            <input className="form-input" type="email" placeholder="you@college.edu" value={form.email}
              onChange={e => set('email', e.target.value)} onKeyDown={handleKey} />
          </div>
          <div className="form-group">
            <label>Password *</label>
            <input className="form-input" type="password" placeholder="Min 6 characters" value={form.password}
              onChange={e => set('password', e.target.value)} onKeyDown={handleKey} />
          </div>

          <button className="auth-submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? '⏳ Please wait...' : tab === 'login' ? 'Login →' : 'Create Account →'}
          </button>

          <div className="auth-switch">
            {tab === 'login' ? (
              <>Don't have an account? <span onClick={() => { setTab('register'); setError(''); }}>Register</span></>
            ) : (
              <>Already have an account? <span onClick={() => { setTab('login'); setError(''); }}>Login</span></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
