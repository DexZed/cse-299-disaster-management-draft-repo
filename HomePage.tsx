import { useState } from 'react'
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

export default function HomePage() {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        location: '',
        type: 'flood',
        priority: 'medium',
        description: ''
    })

    const [submitted, setSubmitted] = useState(false)

    const emergencyLocations = [
        { lat: 24.8949, lng: 91.8687, name: 'Sylhet - Flood', priority: 'critical', affected: 15000 },
        { lat: 22.3569, lng: 91.7832, name: 'Chittagong - Cyclone', priority: 'high', affected: 8500 },
        { lat: 25.7439, lng: 89.2752, name: 'Rangpur - Fire', priority: 'medium', affected: 450 },
        { lat: 22.8456, lng: 89.5403, name: 'Khulna - Medical', priority: 'high', affected: 1200 },
        { lat: 23.8103, lng: 90.4125, name: 'Dhaka', priority: 'medium', affected: 3200 }
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
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
        <div className="home-page">
            <div className="hero-container">
                <div className="hero-logo">🚨</div>
                <h1 className="hero-title">Disaster Relief Management Platform</h1>
                <p className="hero-subtitle">Real-Time Disaster Management for Bangladesh</p>

                <div className="stats-bar">
                    <div className="stat-item">
                        <span className="stat-number">35</span>
                        <span className="stat-label">Active Emergencies</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">3,627</span>
                        <span className="stat-label">Total Resources</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">156</span>
                        <span className="stat-label">Active Volunteers</span>
                    </div>
                    <div className="stat-item">
                        <span className="stat-number">89%</span>
                        <span className="stat-label">Response Rate</span>
                    </div>
                </div>

                {/* Emergency Map Section */}
                <section className="unified-section map-section">
                    <h2 className="section-title">🗺️ Live Emergency Map</h2>
                    <p className="section-subtitle">Real-time emergency situations across Bangladesh</p>
                    <div className="map-wrapper">
                        <MapContainer
                            {...({ center: [23.8103, 90.4125], zoom: 7, style: { height: '500px', width: '100%', borderRadius: '12px' } } as any)}
                        >
                            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                            {emergencyLocations.map((area, idx) => {
                                const color = area.priority === 'critical' ? 'red' : area.priority === 'high' ? 'orange' : 'yellow'
                                // Circle uses radius in meters; adjust values for visual differentiation
                                const radiusMeters = area.priority === 'critical' ? 30000 : area.priority === 'high' ? 20000 : 10000
                                return (
                                    <Circle
                                        key={idx}
                                        center={[area.lat, area.lng] as [number, number]}
                                        {...({ radius: radiusMeters } as any)}
                                        pathOptions={{
                                            color,
                                            fillColor: color,
                                            fillOpacity: 0.6
                                        }}
                                    >
                                        <Popup>
                                            <strong>{area.name}</strong><br />
                                            Priority: {area.priority}<br />
                                            Affected: {area.affected.toLocaleString()}
                                        </Popup>
                                    </Circle>
                                )
                            })}
                        </MapContainer>
                    </div>

                    <div className="map-legend">
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'red' }}></div>
                            <span>Critical</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'orange' }}></div>
                            <span>High</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'yellow' }}></div>
                            <span>Medium</span>
                        </div>
                        <div className="legend-item">
                            <div className="legend-color" style={{ background: 'green' }}></div>
                            <span>Low</span>
                        </div>
                    </div>
                </section>

                {/* Emergency Data Table */}
                <section className="unified-section data-section">
                    <h2 className="section-title">📊 Priority Emergencies</h2>
                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Location</th>
                                    <th>Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Affected</th>
                                    <th>Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td><strong>Sylhet</strong></td>
                                    <td>Flood</td>
                                    <td><span className="badge critical">Critical</span></td>
                                    <td>Active</td>
                                    <td>15,000</td>
                                    <td>5 mins ago</td>
                                </tr>
                                <tr>
                                    <td><strong>Chittagong</strong></td>
                                    <td>Cyclone</td>
                                    <td><span className="badge high">High</span></td>
                                    <td>Monitoring</td>
                                    <td>8,500</td>
                                    <td>1 hour ago</td>
                                </tr>
                                <tr>
                                    <td><strong>Rangpur</strong></td>
                                    <td>Fire</td>
                                    <td><span className="badge medium">Medium</span></td>
                                    <td>Responding</td>
                                    <td>450</td>
                                    <td>2 hours ago</td>
                                </tr>
                                <tr>
                                    <td><strong>Khulna</strong></td>
                                    <td>Medical</td>
                                    <td><span className="badge high">High</span></td>
                                    <td>Active</td>
                                    <td>1,200</td>
                                    <td>3 hours ago</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Report Emergency Form */}
                <section className="unified-section report-section">
                    <h2 className="section-title">📝 Report Emergency</h2>
                    <p className="section-subtitle">Submit emergency reports and request assistance</p>

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
                </section>

                <div className="footer">
                    <p>🇧🇩 Bangladesh Emergency Response System • Real-Time Disaster Management</p>
                    <p>© 2025 All Rights Reserved</p>
                </div>
            </div>
        </div>
    )
}
