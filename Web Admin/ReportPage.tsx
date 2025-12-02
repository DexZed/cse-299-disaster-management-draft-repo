import { useState } from 'react'
import { Link } from 'react-router-dom'
import '../styles/ReportPage.css'

export default function ReportPage() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
        type: 'flood',
        priority: 'medium',
        description: ''
    })

    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // Save to localStorage
        const messages = JSON.parse(localStorage.getItem('emergencyMessages') || '[]')
        messages.push({
            id: Date.now(),
            ...formData,
            timestamp: new Date().toISOString(),
            status: 'pending'
        })
        localStorage.setItem('emergencyMessages', JSON.stringify(messages))
        setSubmitted(true)
        setTimeout(() => {
            setFormData({
                name: '',
                contact: '',
                location: '',
                type: 'flood',
                priority: 'medium',
                description: ''
            })
            setSubmitted(false)
        }, 3000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    return (
        <div className="report-page">
            <nav className="top-nav">
                <div className="nav-brand">
                    <span>🚨</span>
                    <h1>Report Emergency</h1>
                </div>
                <div className="nav-actions">
                    <Link to="/" className="nav-btn">🏠 Home</Link>
                    <Link to="/map" className="nav-btn">🗺️ Map</Link>
                    <Link to="/admin/login" className="nav-btn">👨‍💼 Admin</Link>
                </div>
            </nav>

            <div className="report-container">
                <div className="report-box">
                    <div className="report-icon">🚨</div>
                    <h2>Emergency Alert System</h2>
                    <p>Report danger or emergency situations in your area</p>

                    {submitted ? (
                        <div className="success-message">
                            <div className="success-icon">✅</div>
                            <h3>Report Submitted Successfully!</h3>
                            <p>Your emergency report has been received. Response teams have been notified.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="report-form">
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Your Name *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Contact Number *</label>
                                    <input
                                        type="tel"
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="+880 1XXX-XXXXXX"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Location *</label>
                                <input
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="Enter affected location"
                                    required
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Emergency Type *</label>
                                    <select name="type" value={formData.type} onChange={handleChange} required>
                                        <option value="flood">Flood</option>
                                        <option value="fire">Fire</option>
                                        <option value="cyclone">Cyclone</option>
                                        <option value="earthquake">Earthquake</option>
                                        <option value="medical">Medical Emergency</option>
                                        <option value="accident">Accident</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Priority Level *</label>
                                    <select name="priority" value={formData.priority} onChange={handleChange} required>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe the emergency situation in detail..."
                                    rows={5}
                                    required
                                ></textarea>
                            </div>

                            <button type="submit" className="btn-submit">
                                📢 Submit Emergency Report
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
