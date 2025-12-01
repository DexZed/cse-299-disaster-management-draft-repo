# Affected Areas Map Documentation

## Overview

An interactive map system for visualizing affected areas, resource centers, and emergency response zones. Both volunteers and administrators can use this tool to track and manage emergency situations in real-time.

## Features

### 🗺️ Interactive Map
- **Real-time Visualization** of affected areas
- **Priority-based Color Coding** (Critical, High, Medium, Low)
- **Resource Center Markers** showing supply locations
- **Clickable Markers** with detailed information popups
- **Zoom and Pan** capabilities
- **Responsive Design** for mobile and desktop

### 📍 Area Markers
- **Critical** (Red) - Immediate action required
- **High** (Orange) - Urgent attention needed
- **Medium** (Yellow) - Moderate priority
- **Low** (Green) - Stable situation
- **Resource Centers** (Blue) - Supply depots

### 🎛️ Control Features
- **Show All** - Display all markers
- **Critical Only** - Filter critical areas
- **Resources** - Show resource centers only
- **Sidebar Toggle** - Show/hide information panel

### 📊 Statistics Dashboard
- Total affected areas
- Critical areas count
- Active resource centers
- Priority breakdown

## Access the Map

### Direct URL
```
http://localhost:5173/src/Map.html
```

### From Admin Dashboard
Click the **"🗺️ View Affected Areas Map"** button in the dashboard header.

## Map Data Structure

### Affected Area Object
```javascript
{
    id: 1,
    name: 'Zone A - Downtown Emergency',
    priority: 'critical',  // critical, high, medium, low
    coordinates: [latitude, longitude],
    affectedPeople: 500,
    resources: ['Medical', 'Food', 'Water'],
    description: 'Detailed description of the situation',
    lastUpdated: '2025-11-13 10:30'
}
```

### Resource Center Object
```javascript
{
    id: 'R1',
    name: 'Main Supply Depot',
    coordinates: [latitude, longitude],
    resources: ['Medical', 'Food', 'Water'],
    quantity: 1000  // total units available
}
```

## Usage Guide

### For Volunteers

#### Viewing Affected Areas
1. Open the map (`src/Map.html`)
2. Browse the sidebar to see all affected areas
3. Click on any area in the list to zoom to that location
4. Click markers on the map to see details

#### Finding Resources
1. Click the **"Resources"** button in the top-right
2. Blue markers show resource center locations
3. Click markers to see available supplies

#### Filtering by Priority
1. Use the control buttons to filter:
   - **Show All** - See everything
   - **Critical Only** - Focus on urgent areas
   - **Resources** - Find supply centers

### For Administrators

#### Adding New Affected Areas
Edit the `affectedAreas` array in Map.html:

```javascript
const newArea = {
    id: 9,
    name: 'New Zone',
    priority: 'high',
    coordinates: [40.7589, -73.9851],
    affectedPeople: 200,
    resources: ['Medical', 'Food'],
    description: 'New emergency situation',
    lastUpdated: new Date().toISOString()
};

affectedAreas.push(newArea);
```

#### Adding Resource Centers
Edit the `resourceCenters` array:

```javascript
const newCenter = {
    id: 'R4',
    name: 'New Supply Center',
    coordinates: [40.7689, -73.9685],
    resources: ['Water', 'Equipment'],
    quantity: 500
};

resourceCenters.push(newCenter);
```

#### Updating Area Status
Change the priority level:

```javascript
// Find the area
const area = affectedAreas.find(a => a.id === 1);
// Update priority
area.priority = 'medium';  // critical → medium
area.lastUpdated = new Date().toISOString();
```

## Using the Map.js Module

### Basic Setup
```javascript
// Initialize map
const mapInstance = new AffectedAreasMap('map', {
    center: [40.7589, -73.9751],
    zoom: 13
});

mapInstance.init();
```

### Adding Areas
```javascript
// Add single area
mapInstance.addAffectedArea({
    id: 1,
    name: 'Emergency Zone',
    priority: 'critical',
    coordinates: [40.7589, -73.9851],
    affectedPeople: 500,
    resources: ['Medical'],
    description: 'Emergency',
    lastUpdated: '2025-11-13'
});

// Add multiple areas
mapInstance.addAreas(affectedAreas);
```

### Adding Resource Centers
```javascript
// Add single center
mapInstance.addResourceCenter({
    id: 'R1',
    name: 'Supply Depot',
    coordinates: [40.7589, -73.9751],
    resources: ['Medical', 'Food'],
    quantity: 1000
});

// Add multiple centers
mapInstance.addResourceCenters(resourceCenters);
```

### Filtering and Controls
```javascript
// Show all markers
mapInstance.showAll();

// Filter by priority
mapInstance.filterByPriority('critical');

// Show resources only
mapInstance.showResourcesOnly();

// Focus on specific area
mapInstance.focusArea(areaId, zoomLevel);
```

### Getting Statistics
```javascript
const stats = mapInstance.getStats();
console.log(stats);
// Output: { total: 8, critical: 2, high: 3, medium: 2, low: 1, resources: 3 }
```

### Advanced Features
```javascript
// Add affected radius circle
mapInstance.addAffectedRadius(
    [40.7589, -73.9851],  // coordinates
    1000,                  // radius in meters
    { color: '#dc3545', fillOpacity: 0.2 }
);

// Draw route between points
mapInstance.drawRoute(
    [40.7589, -73.9851],  // from
    [40.7489, -73.9685],  // to
    { color: '#0088FE', weight: 3 }
);
```

## Customization

### Changing Map Tiles
Replace the OpenStreetMap tiles with your preferred provider:

```javascript
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
}).addTo(map);
```

Popular alternatives:
- **Mapbox**: `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={token}`
- **CartoDB**: `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png`
- **Stamen**: `https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg`

### Custom Marker Icons
Modify the `createCustomIcon` function:

```javascript
const customIcon = L.divIcon({
    className: 'custom-marker',
    html: `<div style="your-custom-styles">🔴</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20]
});
```

### Styling Sidebar
Edit the CSS in the `<style>` section:

```css
.sidebar {
    width: 400px;  /* Change width */
    background: #f0f0f0;  /* Change background */
}
```

## Integration with Backend

### Fetching Data from API
```javascript
// Fetch affected areas
async function loadAffectedAreas() {
    const response = await fetch('/api/affected-areas');
    const areas = await response.json();
    
    mapInstance.clearMarkers('affected');
    mapInstance.addAreas(areas);
}

// Fetch resource centers
async function loadResourceCenters() {
    const response = await fetch('/api/resource-centers');
    const centers = await response.json();
    
    mapInstance.clearMarkers('resources');
    mapInstance.addResourceCenters(centers);
}
```

### Real-time Updates with WebSocket
```javascript
const socket = new WebSocket('ws://your-server.com/map-updates');

socket.onmessage = (event) => {
    const update = JSON.parse(event.data);
    
    if (update.type === 'new_area') {
        mapInstance.addAffectedArea(update.data);
    } else if (update.type === 'update_area') {
        // Update existing marker
        updateAreaMarker(update.data);
    }
};
```

## Mobile Responsiveness

The map automatically adapts to mobile devices:

### Features on Mobile
- Collapsible sidebar
- Touch-friendly markers
- Responsive controls
- Optimized popups

### Mobile-specific Styles
```css
@media (max-width: 768px) {
    .sidebar {
        position: absolute;
        transform: translateX(-350px);
    }
    
    .sidebar.open {
        transform: translateX(0);
    }
}
```

## Keyboard Shortcuts

- **Arrow Keys** - Pan the map
- **+/-** - Zoom in/out
- **Esc** - Close popup

## Performance Tips

### For Large Datasets
1. **Use Marker Clustering**
```javascript
const markers = L.markerClusterGroup();
// Add markers to cluster group
markers.addLayer(marker);
map.addLayer(markers);
```

2. **Lazy Loading**
```javascript
// Load markers when map moves
map.on('moveend', () => {
    loadVisibleMarkers();
});
```

3. **Limit Visible Markers**
```javascript
// Show only top 50 priority areas
const topAreas = affectedAreas
    .sort((a, b) => priorityValue[a.priority] - priorityValue[b.priority])
    .slice(0, 50);
```

## Troubleshooting

### Map Not Loading
- Check internet connection (tiles require internet)
- Verify Leaflet.js is loaded
- Check browser console for errors

### Markers Not Appearing
- Verify coordinates format: `[latitude, longitude]`
- Check if coordinates are within valid range
- Ensure `addTo(map)` is called

### Popup Not Opening
- Check if `.bindPopup()` is called
- Verify HTML in popup is valid
- Test with `.openPopup()` method

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Opera (latest)
✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Dependencies

- **Leaflet.js** v1.9.4 - Mapping library
- **OpenStreetMap** - Tile provider

## Future Enhancements

- [ ] Real-time tracking of resources
- [ ] Heat maps for density visualization
- [ ] Drawing tools for marking areas
- [ ] Route optimization for resource delivery
- [ ] Offline map support
- [ ] Export map as image/PDF
- [ ] Time-based replay of events
- [ ] Integration with GPS tracking
- [ ] Multi-language support
- [ ] Dark mode

## License

Part of the Resource Management System for emergency response coordination.

---

**Last Updated**: November 13, 2025  
**Version**: 1.0.0  
**Technology**: Leaflet.js + OpenStreetMap
