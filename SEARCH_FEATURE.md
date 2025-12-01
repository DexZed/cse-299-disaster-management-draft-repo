# Map Search Feature

## Overview
A powerful search functionality has been added to the Affected Areas Map, allowing users to quickly find specific locations, resources, or priority areas.

## Features

### 🔍 Smart Search
- **Real-time Search** - Results update as you type
- **Multi-field Search** - Searches across multiple data points:
  - Area names
  - Descriptions
  - Priority levels (Critical, High, Medium, Low)
  - Resource types (Medical, Food, Water, etc.)
  - Affected people count
  - Resource center names

### 🎯 Search Capabilities

#### What You Can Search For:
1. **Area Names**: "Downtown", "Zone A", "Industrial"
2. **Priority Levels**: "critical", "high", "medium", "low"
3. **Resources**: "medical", "food", "water", "shelter"
4. **Locations**: Any part of the location name
5. **Numbers**: Affected people count

#### Example Searches:
- `critical` - Shows all critical priority areas
- `food` - Shows areas needing food and resource centers with food
- `downtown` - Shows Downtown Emergency areas
- `500` - Shows areas with 500 affected people
- `medical` - Shows all locations with medical resources

### 📊 Search Results

#### Results Display:
- **Result Count**: Shows total matches (areas + resources)
- **Visual Highlighting**: 
  - Search input turns green when active
  - Only matching markers appear on map
  - Non-matching items are hidden

#### Map Behavior:
- **Single Result**: Zooms to that location at zoom level 15
- **Multiple Results**: Automatically fits bounds to show all matches
- **No Results**: Displays "No results found" message

### 🎮 User Interface

#### Search Box Location:
- Top of sidebar
- Always visible and accessible
- Icon: 🔍 search icon on the left

#### Interactive Elements:
1. **Search Input**
   - Placeholder: "Search areas, resources, or locations..."
   - Auto-focus ready
   - Enter key to search

2. **Clear Button (✕)**
   - Appears when text is entered
   - Clears search and resets map
   - Returns all markers to view

3. **Results Counter**
   - Shows number of matches found
   - Breaks down by areas and resources
   - Updates in real-time

## How to Use

### Basic Search
1. Click the search box at the top of the sidebar
2. Start typing your search term
3. Results appear automatically as you type
4. Map updates to show only matching locations

### Clear Search
1. Click the **✕** button in the search box, OR
2. Delete all text manually, OR
3. Click any filter button (Show All, Critical Only, Resources)

### Navigate Results
1. After searching, click any item in the filtered list
2. Map will zoom to that location
3. Marker popup opens automatically

## Technical Details

### Search Algorithm
```javascript
// Searches multiple fields simultaneously
- area.name
- area.description
- area.priority
- area.resources[]
- area.affectedPeople
- center.name
- center.resources[]
```

### Performance
- **Instant Search**: Results appear immediately
- **Debounce**: No delay, real-time updates
- **Efficient Filtering**: Only visible markers are rendered
- **Smart Bounds**: Auto-adjusts map view to fit results

### Integration with Filters
- Clearing search resets to "Show All" view
- Filter buttons clear active searches
- Search and filters work independently

## Use Cases

### For Volunteers:
✅ Find areas needing specific resources (e.g., "medical")
✅ Locate critical priority zones quickly
✅ Search by area name to check status
✅ Find resource centers near affected areas

### For Administrators:
✅ Quick access to specific zones for updates
✅ Filter areas by priority level
✅ Locate resource distribution centers
✅ Assess affected population counts

### For Emergency Response:
✅ Rapidly identify critical areas
✅ Find locations with specific needs
✅ Coordinate resource allocation
✅ Track multiple incidents simultaneously

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Type** | Auto-search as you type |
| **Enter** | Execute search |
| **Esc** | Clear search (focus input first) |
| **Tab** | Navigate through results |

## Search Tips

### 💡 Pro Tips:
1. **Be Specific**: Use exact resource names for better results
2. **Use Priorities**: Search "critical" to find urgent areas
3. **Partial Match**: Works with partial words (e.g., "down" matches "Downtown")
4. **Case Insensitive**: Search works regardless of capitalization
5. **Clear Often**: Use the ✕ button to reset and start fresh

### Common Searches:
```
critical          → All critical priority areas
medical supplies  → Areas/centers with medical resources
downtown         → Downtown locations
water            → Water resource needs
high priority    → High priority areas
shelter          → Shelter requirements
```

## Accessibility

- **Keyboard Friendly**: Full keyboard navigation support
- **Screen Reader Compatible**: Proper ARIA labels
- **Clear Visual Feedback**: Active states clearly indicated
- **High Contrast**: Search results easily readable

## Browser Compatibility

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Mobile browsers

## Troubleshooting

### Search Not Working?
1. Check if JavaScript is enabled
2. Ensure map has loaded completely
3. Refresh the page
4. Clear browser cache

### No Results Found?
1. Check spelling
2. Try broader search terms
3. Use partial words
4. Clear search and try again

### Map Not Updating?
1. Click "Show All" button to reset
2. Clear the search
3. Refresh the page

## Future Enhancements

Possible improvements:
- [ ] Search history/suggestions
- [ ] Advanced filters (date range, multiple resources)
- [ ] Autocomplete suggestions
- [ ] Save favorite searches
- [ ] Search within radius
- [ ] Export search results
- [ ] Share search links

---

**Version**: 1.0.0  
**Last Updated**: November 13, 2025  
**Feature Status**: ✅ Active and Operational
