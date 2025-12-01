# Real-Time Map Updates Documentation

## Overview

The Affected Areas Map now features **Live Real-Time Updates** that simulate dynamic emergency situations with automatic data refreshes, providing a realistic view of how emergency response scenarios evolve over time.

## 🔴 Live Features

### Real-Time Status Indicator
- **Location**: Top of sidebar
- **Green Pulsing Dot**: System is actively updating
- **Yellow Dot**: Update in progress
- **Red Dot**: Updates paused
- **Last Update Timer**: Shows time since last update (e.g., "Just now", "45s ago", "2m ago")

### Update Types

The system simulates 4 types of real-time updates:

#### 1. 📊 Affected People Count Updates (30% probability)
- Random changes in the number of affected people
- Increases or decreases by ±50 people
- Popup shows "↻ UPDATED" badge
- **Example**: Zone A affected people: 500 → 550

#### 2. 🚨 Priority Level Changes (30% probability)
- Priority can escalate or de-escalate
- Marker color changes automatically
- Popup shows "↻ CHANGED" badge
- **Priority Levels**: Low → Medium → High → Critical
- **Example**: Zone B priority: High → Critical (marker turns red)

#### 3. 📦 Resource Needs Updates (20% probability)
- Resources can be added or removed
- Reflects changing emergency requirements
- Popup shows "↻ UPDATED" badge
- **Example**: Zone C resources: [Food, Water] → [Food, Water, Medical]

#### 4. 🆕 New Affected Areas (20% probability)
- New emergency zones appear on the map
- Automatically zooms to show new area
- Popup shows "🆕 NEW" badge
- Random location near map center
- **Example**: "East District - Emergency 9" appears with 250 affected people

## Update Frequency

- **Random Interval**: 8-15 seconds between updates
- **Variable Timing**: Prevents predictable patterns
- **Continuous**: Updates run 24/7 unless paused
- **Time Display**: Updates every second

## Control Panel

### Pause/Resume Button
**Location**: Bottom right control panel (green/red button)

#### Active State (Green)
- Button shows: "⏸️ Pause Updates"
- Status indicator: Green pulsing dot
- Updates are running
- Click to pause

#### Paused State (Red)
- Button shows: "▶️ Resume Updates"
- Status indicator: Red dot
- Updates are stopped
- Click to resume

### Keyboard Shortcut
- Click the button to toggle updates on/off

## Visual Feedback

### Marker Updates
- **Color Change**: When priority changes, marker color updates instantly
- **Icon Change**: Emoji changes based on priority
  - ⚠️ Critical (Red)
  - ⚡ High (Orange)
  - ⚠️ Medium (Yellow)
  - ✓ Low (Green)

### Popup Indicators
Updates are marked with badges:
- **↻ UPDATED**: Data refreshed (green)
- **↻ CHANGED**: Priority modified (orange)
- **🆕 NEW**: New area added (green)

### Statistics Updates
- Sidebar legend counts update automatically
- Stats bar at bottom refreshes
- Area list re-renders with new data

## Console Logging

Real-time updates are logged to the browser console:

```
🔴 Real-time updates started
📊 Updated: Zone A - Downtown Emergency - 550 people
🚨 Priority changed: Zone B - Relief Camp - high → critical
📦 Resources updated: Zone C - Water Supply Point - Water, Equipment, Medical
🆕 New area added: South District - Emergency 9 - medium priority
⏸️ Real-time updates paused
✅ Real-time updates resumed
```

## Technical Details

### Update Algorithm
```javascript
Random Selection:
- 30% chance: Update affected people count
- 30% chance: Change priority level
- 20% chance: Update resource needs
- 20% chance: Add new affected area
```

### Data Persistence
- Updates modify the global `affectedAreas` array
- Marker objects are updated with new data
- Popup content is regenerated with fresh information
- Search functionality works with updated data

### Performance
- **Efficient Updates**: Only modified markers are refreshed
- **No Memory Leaks**: Proper timeout cleanup
- **Smooth Animations**: CSS transitions for visual changes
- **Low CPU Usage**: Updates run on-demand, not continuously

## Integration with Other Features

### Search Compatibility
- Real-time updates work during active searches
- New areas appear in search results immediately
- Updated data is instantly searchable

### Filter Compatibility
- Updates respect active filters (Show All, Critical Only, Resources)
- New critical areas appear when "Critical Only" is active
- Priority changes update filter visibility automatically

### Map Navigation
- New areas briefly zoom to show location
- Popup opens automatically for new areas
- Users can interact during updates

## Use Cases

### Training & Demonstrations
✅ Simulate live emergency response scenarios
✅ Train volunteers on dynamic situations
✅ Demonstrate system capabilities to stakeholders
✅ Test response procedures

### Testing & Development
✅ Verify UI updates correctly
✅ Test data flow and state management
✅ Validate filter and search behavior
✅ Check performance under load

### Real-World Simulation
✅ Mimic actual emergency evolution
✅ Show resource allocation needs
✅ Demonstrate priority escalation
✅ Track multiple concurrent incidents

## Configuration

### Customizing Update Intervals
Edit the `startRealTimeUpdates()` function:

```javascript
// Change from 8-15 seconds to 5-10 seconds
const getRandomInterval = () => Math.floor(Math.random() * 5000) + 5000;
```

### Adjusting Update Probabilities
Modify the `simulateRealTimeUpdate()` function:

```javascript
if (updateType < 0.5) {  // 50% chance instead of 30%
    updateAffectedPeople();
} else if (updateType < 0.8) {  // 30% chance instead of 30%
    updatePriority();
}
// ... and so on
```

### Changing New Area Generation
Edit `addNewArea()` function:

```javascript
// Customize location names
const locations = ['North', 'South', 'East', 'West', 'Custom Area'];

// Adjust affected people range
affectedPeople: Math.floor(Math.random() * 1000) + 200,  // 200-1200 people
```

## Connecting to Real Backend

### WebSocket Integration
Replace the simulation with actual WebSocket connection:

```javascript
// Replace startRealTimeUpdates() with:
const socket = new WebSocket('ws://your-server.com/updates');

socket.onmessage = (event) => {
    const update = JSON.parse(event.data);
    
    switch(update.type) {
        case 'update_people':
            updateAffectedPeople(update.areaId, update.count);
            break;
        case 'update_priority':
            updatePriority(update.areaId, update.priority);
            break;
        case 'update_resources':
            updateResources(update.areaId, update.resources);
            break;
        case 'new_area':
            addNewArea(update.data);
            break;
    }
    
    lastUpdateTime = new Date();
    updateTimeDisplay();
    updateCounts();
    populateAreasList();
};
```

### REST API Polling
Alternative approach using periodic API calls:

```javascript
async function fetchUpdates() {
    const response = await fetch('/api/affected-areas');
    const newData = await response.json();
    
    // Compare with existing data and update differences
    affectedAreas = newData;
    
    // Refresh markers
    markers.affected.forEach(m => map.removeLayer(m));
    markers.affected = [];
    addAllMarkers();
    
    lastUpdateTime = new Date();
    updateTimeDisplay();
    updateCounts();
    populateAreasList();
}

// Poll every 10 seconds
setInterval(fetchUpdates, 10000);
```

### Server-Sent Events (SSE)
One-way streaming from server:

```javascript
const eventSource = new EventSource('/api/updates');

eventSource.onmessage = (event) => {
    const update = JSON.parse(event.data);
    handleUpdate(update);
};

eventSource.onerror = () => {
    console.error('Connection lost. Reconnecting...');
};
```

## Best Practices

### For Administrators
1. **Monitor Updates**: Watch the console for update logs
2. **Pause When Needed**: Stop updates during manual data entry
3. **Verify Changes**: Check that updates make logical sense
4. **Document Patterns**: Note unusual update frequencies

### For Developers
1. **Test Thoroughly**: Verify all update types work correctly
2. **Handle Errors**: Add try-catch blocks for production
3. **Rate Limiting**: Prevent update flooding
4. **Data Validation**: Ensure updates don't create invalid states

### For Users
1. **Check Status**: Green dot = active, Red dot = paused
2. **Read Badges**: Look for ↻ UPDATED or 🆕 NEW indicators
3. **Use Pause**: Stop updates to analyze static data
4. **Monitor Time**: Keep track of last update timestamp

## Troubleshooting

### Updates Not Appearing?
1. Check if green dot is pulsing
2. Look for "Real-time updates started" in console
3. Click "Resume Updates" if paused
4. Refresh the page

### Too Many/Too Few Updates?
1. Adjust update interval in code
2. Modify probability thresholds
3. Check console for error messages

### Performance Issues?
1. Pause updates when not needed
2. Reduce update frequency
3. Limit number of visible markers
4. Clear old areas periodically

## Future Enhancements

Planned features:
- [ ] Update history timeline
- [ ] Undo/redo functionality
- [ ] Update notifications with sound
- [ ] Export update logs
- [ ] Custom update rules
- [ ] Manual update triggers
- [ ] Update analytics dashboard
- [ ] Collaborative real-time editing

## Browser Requirements

✅ Modern JavaScript (ES6+)
✅ WebSocket support (for real backend)
✅ CSS animations
✅ LocalStorage (optional for settings)

## Security Considerations

For production use:
- Validate all incoming updates
- Sanitize HTML in popups
- Rate limit update frequency
- Authenticate WebSocket connections
- Encrypt sensitive data
- Log all changes for audit trail

---

**Version**: 1.0.0  
**Last Updated**: November 13, 2025  
**Status**: ✅ Active and Operational  
**Update Mode**: Simulated Real-Time (Ready for backend integration)
