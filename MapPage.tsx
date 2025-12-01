import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet'
import { Link } from 'react-router-dom'
import 'leaflet/dist/leaflet.css'
import '../styles/MapPage.css'

export default function MapPage() {
    const affectedAreas = [
        { lat: 24.8949, lng: 91.8687, name: 'Sylhet', priority: 'critical', people: 15000 },
        { lat: 22.3569, lng: 91.7832, name: 'Chittagong', priority: 'high', people: 8500 },
        { lat: 25.7439, lng: 89.2752, name: 'Rangpur', priority: 'medium', people: 450 },
        { lat: 22.8456, lng: 89.5403, name: 'Khulna', priority: 'high', people: 1200 },
        { lat: 23.8103, lng: 90.4125, name: 'Dhaka', priority: 'medium', people: 3200 }
    ]

    return (
        <div className="map-page">
            <nav className="top-nav">
                <div className="nav-brand">
                    <span>🚨</span>
                    <h1>Emergency Map</h1>
                </div>
                <div className="nav-actions">
                    <Link to="/" className="nav-btn">🏠 Home</Link>
                    <Link to="/report" className="nav-btn">📝 Report</Link>
                    <Link to="/admin/login" className="nav-btn">👨‍💼 Admin</Link>
                </div>
            </nav>

            <div className="map-container-full">
                <div className="map-sidebar">
                    <h2>🇧🇩 Bangladesh Emergency Map</h2>
                    <p>Real-Time Disaster Response</p>

                    <div className="map-legend">
                        <h3>Legend</h3>
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

                    <div className="areas-list">
                        <h3>Affected Areas</h3>
                        {affectedAreas.map((area, idx) => (
                            <div key={idx} className={`area-item ${area.priority}`}>
                                <div className="area-name">{area.name}</div>
                                <div className={`area-priority ${area.priority}`}>{area.priority}</div>
                                <div className="area-people">{area.people.toLocaleString()} affected</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="map-view">
                    <MapContainer
                        {...({ center: [23.8103, 90.4125], zoom: 7, style: { height: '100%', width: '100%' } } as any)}
                    >
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        {affectedAreas.map((area, idx) => (
                            <CircleMarker
                                key={idx}
                                center={[area.lat, area.lng]}
                                pathOptions={{
                                    color: area.priority === 'critical' ? 'red' :
                                        area.priority === 'high' ? 'orange' : 'yellow',
                                    fillColor: area.priority === 'critical' ? 'red' :
                                        area.priority === 'high' ? 'orange' : 'yellow',
                                    fillOpacity: 0.6
                                }}
                            >
                                <Popup>
                                    <strong>{area.name}</strong><br />
                                    Priority: {area.priority}<br />
                                    Affected: {area.people.toLocaleString()}
                                </Popup>
                            </CircleMarker>
                        ))}
                    </MapContainer>
                </div>
            </div>
        </div>
    )
}
