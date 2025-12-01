# Google Maps Integration Guide

## 🌍 Real-Time Google Maps for Emergency Response

Your new Google Maps integration includes all the features from the Leaflet map, plus additional Google-specific capabilities like real-time traffic, satellite view, and better geocoding.

## 📍 Access the Google Map

**URL**: `http://localhost:5173/src/GoogleMap.html`

## ⚠️ IMPORTANT: Google Maps API Key Required

Google Maps requires an API key to function. Follow these steps to get one:

### Step 1: Get Your Google Maps API Key

1. **Go to Google Cloud Console**
   ```
   https://console.cloud.google.com/google/maps-apis
   ```

2. **Create a New Project** (or select existing)
   - Click "Select a project" at the top
   - Click "NEW PROJECT"
   - Name it (e.g., "Emergency Response Map")
   - Click "CREATE"

3. **Enable APIs**
   - In the left sidebar, go to "APIs & Services" > "Library"
   - Search for and enable these APIs:
     - ✅ **Maps JavaScript API** (Required)
     - ✅ **Places API** (Optional, for search)
     - ✅ **Geocoding API** (Optional, for address lookup)

4. **Create API Key**
   - Go to "APIs & Services" > "Credentials"
   - Click "+ CREATE CREDENTIALS"
   - Select "API key"
   - Copy your new API key

5. **Secure Your API Key** (Important!)
   - Click "Edit API key"
   - Under "Application restrictions", select "HTTP referrers"
   - Add: `http://localhost:5173/*`
   - Under "API restrictions", select "Restrict key"
   - Choose only the APIs you enabled
   - Click "SAVE"

### Step 2: Add Your API Key to the Code

1. **Open the file**: `src/GoogleMap.html`

2. **Find this line at the bottom** (around line 1000+):
   ```html
   <script async defer
       src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap&libraries=places">
   </script>
   ```

3. **Replace `YOUR_API_KEY` with your actual key**:
   ```html
   <script async defer
       src="https://maps.googleapis.com/maps/api/js?key=<example>&callback=initMap&libraries=places">
   </script>
   ```

4. **Save the file** and refresh the browser

## 🎯 Features

### Real-Time Capabilities

#### 1. Live Traffic Layer 🚦
- Click the **"🚦 Traffic"** button
- Shows real-time traffic conditions
- Color coding:
  - **Green**: Normal traffic
  - **Orange**: Medium traffic
  - **Red**: Heavy traffic
  - **Dark Red**: Traffic jam

#### 2. Satellite View 🛰️
- Click the **"🛰️ Satellite"** button
- Switches between road map and satellite imagery
- Great for assessing terrain and accessibility

#### 3. Real-Time Updates ⏱️
- Live status indicator at the top
- Updates every 10 seconds
- Shows affected people count changes
- Displays last update time

#### 4. Street View (Built-in)
- Drag the yellow person icon onto the map
- Explore affected areas in street-level view
- Useful for assessing actual conditions

### Search Features

Same as Leaflet map, plus:
- **Place autocomplete** (when Places API is enabled)
- **Address geocoding**
- **Reverse geocoding** (click map to get address)

### Interactive Controls

#### Filter Buttons:
- **Show All**: Display all markers
- **Critical Only**: Show only critical priority areas
- **Resources**: Display resource centers only
- **Pause/Resume**: Control real-time updates
- **Traffic**: Toggle real-time traffic layer
- **Satellite**: Switch map view

### Enhanced Info Windows

Click any marker to see:
- Area name and priority
- Affected people count
- Resources needed
- Description
- Last update time

## 📊 Real-Time Data Flow

### Current Implementation (Demo Mode):
```
Browser → Local Data Updates → Map Refresh
Updates every 10 seconds with simulated changes
```

### Production Implementation:
```
Backend API → WebSocket/Server-Sent Events → Browser → Map Update
Real-time bidirectional communication
```

## 🔌 Connecting to Real Backend

### Option 1: WebSocket (Recommended for Real-Time)

```javascript
// Add after initMap() function
const socket = new WebSocket('wss://your-server.com/map-updates');

socket.onopen = () => {
    console.log('✅ Connected to real-time server');
};

socket.onmessage = (event) => {
    const update = JSON.parse(event.data);
    
    switch(update.type) {
        case 'new_area':
            addNewArea(update.data);
            break;
        case 'update_area':
            updateArea(update.data);
            break;
        case 'remove_area':
            removeArea(update.areaId);
            break;
    }
    
    updateCounts();
    populateAreasList();
};

function addNewArea(areaData) {
    affectedAreas.push(areaData);
    const marker = createMarker(
        areaData.coordinates,
        areaData.name,
        areaData.priority
    );
    marker.areaData = areaData;
    markers.affected.push(marker);
}
```

### Option 2: REST API with Polling

```javascript
async function fetchRealTimeData() {
    try {
        const response = await fetch('https://your-api.com/affected-areas');
        const newAreas = await response.json();
        
        // Update affectedAreas array
        affectedAreas.length = 0;
        affectedAreas.push(...newAreas);
        
        // Refresh markers
        markers.affected.forEach(m => m.setMap(null));
        markers.affected = [];
        addAllMarkers();
        
        updateCounts();
        populateAreasList();
    } catch (error) {
        console.error('Failed to fetch data:', error);
    }
}

// Poll every 5 seconds
setInterval(fetchRealTimeData, 5000);
```

### Option 3: Server-Sent Events (SSE)

```javascript
const eventSource = new EventSource('https://your-api.com/stream');

eventSource.addEventListener('update', (event) => {
    const data = JSON.parse(event.data);
    handleUpdate(data);
});

eventSource.addEventListener('error', (event) => {
    console.error('SSE error:', event);
    setTimeout(() => {
        // Reconnect
        location.reload();
    }, 5000);
});
```

## 🎨 Customization

### Change Map Styles

```javascript
// In initMap() function, add custom styles
const mapStyles = [
    {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{ color: '#193341' }]
    },
    {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{ color: '#2c3e50' }]
    }
];

map = new google.maps.Map(document.getElementById('map'), {
    center: { lat: 40.7589, lng: -73.9751 },
    zoom: 13,
    styles: mapStyles
});
```

### Custom Marker Icons

```javascript
function createMarker(position, title, priority, isResource = false) {
    const icon = {
        url: '/path/to/custom-icon.png',
        scaledSize: new google.maps.Size(40, 40),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(20, 40)
    };

    const marker = new google.maps.Marker({
        position: position,
        map: map,
        title: title,
        icon: icon
    });

    return marker;
}
```

## 🆚 Google Maps vs Leaflet

### Google Maps Advantages:
✅ **Real-time traffic data**
✅ **Street View integration**
✅ **Better POI (Points of Interest) data**
✅ **More accurate geocoding**
✅ **Better satellite imagery**
✅ **Transit layer available**
✅ **Better mobile support**
✅ **More familiar to users**

### Leaflet Advantages:
✅ **Completely free** (no API key needed)
✅ **No usage limits**
✅ **Open source**
✅ **Lighter weight**
✅ **More flexible**
✅ **Works offline with cached tiles**

## 💰 Pricing

Google Maps offers a **$200 monthly credit** for free!

### Free Tier Includes:
- **28,000+ map loads per month**
- **40,000 geocoding requests**
- **Up to 25,000 places searches**

For emergency response, this is usually sufficient.

### Cost Example:
- Map loads: $7 per 1,000 loads
- With $200 credit, you get 28,571 free loads/month
- Most emergency systems stay within free tier

## 🔒 Security Best Practices

1. **Restrict API Key**
   - Add HTTP referrer restrictions
   - Limit to specific APIs only
   - Never commit API keys to public repos

2. **Monitor Usage**
   - Set up billing alerts
   - Check API quota regularly
   - Enable API key restrictions

3. **Backend Proxy** (Production)
   ```javascript
   // Instead of direct API calls, use your backend
   fetch('https://your-backend.com/api/map-data')
       .then(res => res.json())
       .then(data => updateMap(data));
   ```

## 🐛 Troubleshooting

### Map Not Loading?
1. Check browser console for errors
2. Verify API key is correct
3. Ensure APIs are enabled in Google Cloud Console
4. Check if page is loaded over HTTPS (required for some features)
5. Clear browser cache

### "For development purposes only" watermark?
- Your API key needs billing enabled
- Add a credit card to Google Cloud Console
- You won't be charged within free tier

### Map is gray?
- API key is missing or invalid
- Check console for specific error message
- Verify API restrictions match your domain

### Traffic layer not showing?
- Traffic data may not be available in all areas
- Try major cities for testing
- Ensure internet connection is stable

## 📱 Mobile Considerations

The Google Map is fully responsive:
- Touch gestures for zoom/pan
- Geolocation API for "current location"
- Optimized markers for mobile
- Responsive info windows

## 🚀 Quick Start Checklist

- [ ] Get Google Maps API key
- [ ] Enable Maps JavaScript API
- [ ] Add API key to GoogleMap.html
- [ ] Save and refresh browser
- [ ] Test basic map functionality
- [ ] Enable traffic layer
- [ ] Test search feature
- [ ] Set up API restrictions
- [ ] Configure billing alerts
- [ ] Connect to backend (production)

## 📞 Support

**Google Maps Documentation**:
- https://developers.google.com/maps/documentation/javascript

**API Console**:
- https://console.cloud.google.com/

**Pricing Calculator**:
- https://mapsplatform.google.com/pricing/

---

**Status**: ✅ Ready (API Key Required)
**Access**: http://localhost:5173/src/GoogleMap.html
**Alternative**: Use Leaflet map (no API key needed) at http://localhost:5173/src/Map.html

