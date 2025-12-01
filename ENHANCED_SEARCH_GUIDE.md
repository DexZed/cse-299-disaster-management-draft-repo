# Enhanced Map Search Guide

## 🔍 Search Features - Now with Visual Highlighting!

The map search has been enhanced to provide clear visual feedback when you search for areas.

## How to Search

### 1. Type in the Search Box
Located at the top of the sidebar, type any of the following:
- **Area Name**: "Downtown", "Zone A", "Relief Camp"
- **Priority**: "critical", "high", "medium", "low"  
- **Resources**: "medical", "food", "water", "shelter"
- **Location**: Any part of the location name

### 2. Instant Visual Feedback

#### When 1 Result Found:
✅ **Map automatically zooms** to the area (zoom level 16)
✅ **Popup opens automatically** showing area details
✅ **Marker pulses** 3 times with blue highlight effect
✅ **Search icon** 🔍 appears next to area name in list
✅ **Result counter** shows "✅ Found 1 result"

#### When Multiple Results Found:
✅ **Map fits bounds** to show all matching locations
✅ **All matching markers pulse** 3 times with blue glow
✅ **Only matched areas** appear in the sidebar list
✅ **Search icon** 🔍 appears next to each area name
✅ **Result counter** shows total (e.g., "✅ Found 3 results (2 areas, 1 resources)")
✅ **List items highlighted** with light blue background

#### When No Results:
❌ **Message displays**: "❌ No results found"
❌ **Map stays at current view**

## Example Searches

### Search by Area Name
```
Type: "downtown"
Result: Zooms to "Zone A - Downtown Emergency"
Effect: Marker pulses, popup opens automatically
```

### Search by Priority
```
Type: "critical"
Result: Shows all critical priority areas
Effect: Multiple markers pulse, map fits to show all
```

### Search by Resource
```
Type: "medical"
Result: Shows areas needing medical supplies + medical centers
Effect: Areas and resource centers both highlighted
```

### Search by Location
```
Type: "relief"
Result: Finds "Zone B - Relief Camp"
Effect: Single result zooms and opens popup
```

## Visual Indicators

### 🔍 Search Icon
Appears next to area names when search is active

### 💙 Blue Background
Matched areas in sidebar have light blue background

### 🌟 Pulsing Animation
Matched markers on map pulse with blue glow (3 times)

### ✅ Success Message
Green checkmark with result count

### ❌ No Results
Red X when nothing matches

## Clear Search

Click the **✕** button to:
- Clear the search text
- Show all areas again
- Reset map to default view
- Remove all highlights

## Tips for Best Results

### 🎯 Be Specific
- Type exact area names for single results
- Use partial words for broader searches

### 🔄 Search While Updates Active
- Real-time updates continue during search
- New areas appear if they match your search
- Results update automatically

### 📍 Click to Focus
After search, click any area in the list to:
- Zoom to that specific location
- Open its information popup
- Center it on the map

### 🎨 Visual Cues
Watch for:
- **Pulsing markers** = Search results
- **Blue backgrounds** = Matched areas
- **🔍 icons** = Currently searching
- **Green input box** = Active search

## Keyboard Shortcuts

| Action | Keys |
|--------|------|
| Focus search | Click search box |
| Search | Type + Auto-search |
| Execute search | Enter |
| Clear search | Click ✕ button |

## Real-World Examples

### Emergency Response Scenario

**Scenario**: Find all critical medical emergencies

1. Type: `critical medical`
2. **Result**: Shows critical areas needing medical supplies
3. **Map**: Zooms to fit all critical medical areas
4. **Effect**: All matching markers pulse
5. **Action**: Click any area to see details and dispatch resources

**Scenario**: Locate specific shelter

1. Type: `shelter point`
2. **Result**: "Zone D - Shelter Point" found
3. **Map**: Zooms directly to location
4. **Effect**: Marker pulses, popup opens
5. **Action**: See affected people count and needed resources

**Scenario**: Find all food distribution centers

1. Type: `food`
2. **Result**: Shows areas needing food + resource centers with food
3. **Map**: Shows all food-related locations
4. **Effect**: Both areas and centers pulse
5. **Action**: Coordinate food distribution

## Search + Real-Time Updates

The search works seamlessly with real-time updates:

- ✅ Search results update when data changes
- ✅ New areas appear if they match your search
- ✅ Priority changes update search results
- ✅ Resource updates refresh matches

**Example**:
1. Search for "critical"
2. Watch as areas escalate to critical and appear
3. See de-escalated areas disappear from results
4. All automatic, no need to re-search

## Troubleshooting

### Search Not Working?
- ✅ Check spelling
- ✅ Try partial words ("down" instead of "downtown")
- ✅ Clear search and try again
- ✅ Refresh page if needed

### Area Not Showing?
- ✅ Make sure it matches your search term
- ✅ Check if real-time updates changed the data
- ✅ Try broader search terms
- ✅ Clear filters and search again

### Map Not Zooming?
- ✅ Wait for search to complete
- ✅ Check if multiple results (map fits bounds)
- ✅ Try clicking area in the list
- ✅ Manually zoom if needed

## Access the Enhanced Search

**URL**: `http://localhost:5173/src/Map.html`

Start searching and watch the visual magic! ✨

---

**Feature**: Enhanced Visual Search  
**Status**: ✅ Active  
**Highlights**: Auto-zoom, Popup, Pulsing markers, Blue backgrounds  
**Last Updated**: November 13, 2025
