import { useState } from 'react'
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import '../styles/Dashboard.css'

interface DashboardProps {
    onLogout: () => void
}

export default function Dashboard({ onLogout }: DashboardProps) {
    const [activeSection, setActiveSection] = useState('overview')

    const emergencyLocations = [
        { lat: 24.8949, lng: 91.8687, name: 'Sylhet - Flood', priority: 'critical', affected: 15000 },
        { lat: 22.3569, lng: 91.7832, name: 'Chittagong - Cyclone', priority: 'high', affected: 8500 },
        { lat: 25.7439, lng: 89.2752, name: 'Rangpur - Fire', priority: 'medium', affected: 450 },
        { lat: 22.8456, lng: 89.5403, name: 'Khulna - Medical', priority: 'high', affected: 1200 }
    ]

    return (
        <div className="dashboard-page">
            <nav className="top-nav">
                <div className="nav-brand">
                    <span>🚨</span>
                    <h1>Emergency Response Dashboard</h1>
                </div>
                <div className="nav-actions">
                    <button className="nav-btn">🔔 Notifications (3)</button>
                    <button className="nav-btn" onClick={() => window.location.href = '/'}>🏠 Home</button>
                    <button className="nav-btn logout-btn" onClick={onLogout}>🚪 Logout</button>
                </div>
            </nav>

            <div className="main-container">
                <aside className="sidebar">
                    <div className="sidebar-section">
                        <h3>Main Menu</h3>
                        <div className={`menu-item ${activeSection === 'overview' ? 'active' : ''}`}
                            onClick={() => setActiveSection('overview')}>
                            <span className="menu-icon">📊</span>
                            <span>Overview</span>
                        </div>
                        <div className={`menu-item ${activeSection === 'map' ? 'active' : ''}`}
                            onClick={() => setActiveSection('map')}>
                            <span className="menu-icon">🗺️</span>
                            <span>Live Map</span>
                        </div>
                        <div className={`menu-item ${activeSection === 'emergencies' ? 'active' : ''}`}
                            onClick={() => setActiveSection('emergencies')}>
                            <span className="menu-icon">🚨</span>
                            <span>Emergencies</span>
                        </div>
                        <div className={`menu-item ${activeSection === 'resources' ? 'active' : ''}`}
                            onClick={() => setActiveSection('resources')}>
                            <span className="menu-icon">📦</span>
                            <span>Resources</span>
                        </div>
                    </div>
                </aside>

                <main className="content-area">
                    <div className="stats-row">
                        <div className="stat-card">
                            <div className="stat-icon">🚨</div>
                            <div className="stat-content">
                                <div className="stat-value">35</div>
                                <div className="stat-label">Active Emergencies</div>
                                <div className="stat-change positive">↑ 12% from yesterday</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">📦</div>
                            <div className="stat-content">
                                <div className="stat-value">3,627</div>
                                <div className="stat-label">Total Resources</div>
                                <div className="stat-change positive">↑ 8% increase</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">👥</div>
                            <div className="stat-content">
                                <div className="stat-value">156</div>
                                <div className="stat-label">Active Volunteers</div>
                                <div className="stat-change positive">↑ 5 new today</div>
                            </div>
                        </div>

                        <div className="stat-card">
                            <div className="stat-icon">✅</div>
                            <div className="stat-content">
                                <div className="stat-value">89%</div>
                                <div className="stat-label">Response Rate</div>
                                <div className="stat-change positive">↑ 3% improvement</div>
                            </div>
                        </div>
                    </div>

                    <div className="map-section">
                        <h2 className="section-title">Live Emergency Map</h2>
                        <MapContainer {...({ center: [23.8103, 90.4125], zoom: 7 } as any)} style={{ height: '500px', borderRadius: '12px' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {emergencyLocations.map((loc, idx) => (
                                <Circle
                                    key={idx}
                                    center={[loc.lat, loc.lng]}
                                    {...({ radius: 15000 } as any)}
                                    pathOptions={{
                                        color: loc.priority === 'critical' ? 'red' : loc.priority === 'high' ? 'orange' : 'yellow',
                                        fillColor: loc.priority === 'critical' ? 'red' : loc.priority === 'high' ? 'orange' : 'yellow',
                                        fillOpacity: 0.6
                                    }}
                                >
                                    <Popup>
                                        <strong>{loc.name}</strong><br />
                                        Priority: {loc.priority}<br />
                                        Affected: {loc.affected.toLocaleString()}
                                    </Popup>
                                </Circle>
                            ))}
                        </MapContainer>
                    </div>

                    <div className="data-table-section">
                        <h2 className="section-title">Priority Emergencies</h2>
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
                </main>
            </div>
        </div>
    )
}
