

class AffectedAreasMap {
    constructor(mapElementId, options = {}) {
        this.mapElementId = mapElementId;
        this.map = null;
        this.markers = {
            affected: [],
            resources: []
        };
        this.options = {
            center: options.center || [40.7589, -73.9751],
            zoom: options.zoom || 13,
            ...options
        };
    }

    /**
     * Initialize the map
     */
    init() {
        // Create map instance
        this.map = L.map(this.mapElementId).setView(this.options.center, this.options.zoom);

        // Add tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(this.map);

        return this;
    }

    /**
     * Get marker color based on priority
     */
    getMarkerColor(priority) {
        const colors = {
            critical: '#dc3545',
            high: '#ff8042',
            medium: '#ffc107',
            low: '#28a745'
        };
        return colors[priority] || '#666';
    }

    /**
     * Create custom marker icon
     */
    createCustomIcon(color, emoji) {
        return L.divIcon({
            className: 'custom-marker',
            html: `
                <div style="
                    background: ${color};
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                ">${emoji}</div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16]
        });
    }

    /**
     * Add affected area to map
     */
    addAffectedArea(area) {
        const emojiMap = {
            critical: '⚠️',
            high: '⚡',
            medium: '⚠️',
            low: '✓'
        };

        const icon = this.createCustomIcon(
            this.getMarkerColor(area.priority),
            emojiMap[area.priority]
        );

        const marker = L.marker(area.coordinates, { icon })
            .addTo(this.map)
            .bindPopup(this.createAreaPopup(area));

        marker.areaData = area;
        this.markers.affected.push(marker);

        return marker;
    }

    /**
     * Add resource center to map
     */
    addResourceCenter(center) {
        const icon = this.createCustomIcon('#0088FE', '📦');

        const marker = L.marker(center.coordinates, { icon })
            .addTo(this.map)
            .bindPopup(this.createResourcePopup(center));

        marker.centerData = center;
        this.markers.resources.push(marker);

        return marker;
    }

    /**
     * Create popup HTML for affected area
     */
    createAreaPopup(area) {
        return `
            <div class="custom-popup">
                <h3>${area.name}</h3>
                <p><strong>Priority:</strong> <span style="color: ${this.getMarkerColor(area.priority)}; text-transform: uppercase;">${area.priority}</span></p>
                <p><strong>Affected People:</strong> ${area.affectedPeople}</p>
                <p><strong>Resources Needed:</strong> ${area.resources.join(', ')}</p>
                <p><strong>Description:</strong> ${area.description}</p>
                <p><strong>Last Updated:</strong> ${area.lastUpdated}</p>
            </div>
        `;
    }

    /**
     * Create popup HTML for resource center
     */
    createResourcePopup(center) {
        return `
            <div class="custom-popup">
                <h3>${center.name}</h3>
                <p><strong>Available Resources:</strong> ${center.resources.join(', ')}</p>
                <p><strong>Total Quantity:</strong> ${center.quantity} units</p>
            </div>
        `;
    }

    /**
     * Clear all markers
     */
    clearMarkers(type = 'all') {
        if (type === 'all' || type === 'affected') {
            this.markers.affected.forEach(marker => this.map.removeLayer(marker));
            if (type === 'affected') this.markers.affected = [];
        }
        if (type === 'all' || type === 'resources') {
            this.markers.resources.forEach(marker => this.map.removeLayer(marker));
            if (type === 'resources') this.markers.resources = [];
        }
    }

    /**
     * Filter markers by priority
     */
    filterByPriority(priority) {
        this.markers.affected.forEach(marker => {
            if (marker.areaData.priority === priority) {
                this.map.addLayer(marker);
            } else {
                this.map.removeLayer(marker);
            }
        });
    }

    /**
     * Show all markers
     */
    showAll() {
        this.markers.affected.forEach(marker => this.map.addLayer(marker));
        this.markers.resources.forEach(marker => this.map.addLayer(marker));
    }

    /**
     * Show only resources
     */
    showResourcesOnly() {
        this.markers.affected.forEach(marker => this.map.removeLayer(marker));
        this.markers.resources.forEach(marker => this.map.addLayer(marker));
    }

    /**
     * Focus on specific area
     */
    focusArea(areaId, zoom = 15) {
        const marker = this.markers.affected.find(m => m.areaData.id === areaId);
        if (marker) {
            this.map.setView(marker.getLatLng(), zoom);
            marker.openPopup();
        }
    }

    /**
     * Get statistics
     */
    getStats() {
        const stats = {
            total: this.markers.affected.length,
            critical: 0,
            high: 0,
            medium: 0,
            low: 0,
            resources: this.markers.resources.length,
            totalAffected: 0
        };

        this.markers.affected.forEach(marker => {
            const priority = marker.areaData.priority;
            stats[priority]++;
            stats.totalAffected += marker.areaData.affectedPeople || 0;
        });

        return stats;
    }

    /**
     * Add circle overlay to show affected radius
     */
    addAffectedRadius(coordinates, radius, options = {}) {
        const circle = L.circle(coordinates, {
            color: options.color || '#dc3545',
            fillColor: options.fillColor || '#dc3545',
            fillOpacity: options.fillOpacity || 0.2,
            radius: radius
        }).addTo(this.map);

        return circle;
    }

    /**
     * Draw route between two points
     */
    drawRoute(from, to, options = {}) {
        const polyline = L.polyline([from, to], {
            color: options.color || '#0088FE',
            weight: options.weight || 3,
            opacity: options.opacity || 0.7,
            dashArray: options.dashArray || '10, 10'
        }).addTo(this.map);

        return polyline;
    }

    /**
     * Batch add areas
     */
    addAreas(areas) {
        areas.forEach(area => this.addAffectedArea(area));
        return this;
    }

    /**
     * Batch add resource centers
     */
    addResourceCenters(centers) {
        centers.forEach(center => this.addResourceCenter(center));
        return this;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AffectedAreasMap;
}

// Example usage:
/*
const mapInstance = new AffectedAreasMap('map', {
    center: [40.7589, -73.9751],
    zoom: 13
});

mapInstance.init();

// Add affected areas
const areas = [
    {
        id: 1,
        name: 'Zone A',
        priority: 'critical',
        coordinates: [40.7589, -73.9851],
        affectedPeople: 500,
        resources: ['Medical', 'Food'],
        description: 'Emergency situation',
        lastUpdated: '2025-11-13 10:30'
    }
];

mapInstance.addAreas(areas);

// Add resource centers
const centers = [
    {
        id: 'R1',
        name: 'Main Supply',
        coordinates: [40.7589, -73.9751],
        resources: ['Medical', 'Food'],
        quantity: 1000
    }
];

mapInstance.addResourceCenters(centers);

// Get statistics
const stats = mapInstance.getStats();
console.log(stats);

// Filter by priority
mapInstance.filterByPriority('critical');

// Focus on specific area
mapInstance.focusArea(1);
*/
