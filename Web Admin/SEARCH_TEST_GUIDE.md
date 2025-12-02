# Search Function Testing Guide

## How to Test the Search

### Step 1: Open the Map
```
http://localhost:5173/src/Map.html
```

### Step 2: Open Browser Console
Press **F12** to open Developer Tools and click on the **Console** tab.

### Step 3: Check Initialization
You should see these logs when the page loads:
```
🔍 Search elements: {searchInput: true, clearSearchBtn: true, searchResultsDiv: true}
🔧 Setting up search event listeners...
✅ Search input listeners attached
✅ Clear button listener attached
```

### Step 4: Test a Search
Type in the search box. For example, type: **downtown**

You should see:
```
⌨️ Input event triggered: downtown
🔍 Searching for: downtown
📊 Total areas to search: 8
📦 Total resources to search: 3
✅ Found: 1 areas, 0 resources
🗺️ Highlighting results on map...
📍 Added 1 area markers to map
📦 Added 0 resource markers to map
```

**Expected Result:**
- Map zooms to "Zone A - Downtown Emergency"
- Popup opens automatically
- Marker pulses 3 times
- Search results shows "✅ Found 1 result (1 areas, 0 resources)"
- Area appears in sidebar with 🔍 icon

### Step 5: Test Multiple Results
Clear the search and type: **high**

You should see:
```
⌨️ Input event triggered: high
🔍 Searching for: high
📊 Total areas to search: 8
📦 Total resources to search: 3
✅ Found: 3 areas, 0 resources (or similar)
🗺️ Highlighting results on map...
📍 Added 3 area markers to map
📦 Added 0 resource markers to map
```

**Expected Result:**
- Map fits bounds to show all high priority areas
- Multiple markers pulse
- All high priority areas listed in sidebar with 🔍 icons

### Step 6: Test Clear Button
Click the **✕** button in the search box.

You should see:
```
🗑️ Clear search clicked
```

**Expected Result:**
- Search box clears
- All markers reappear
- Map returns to default view
- Sidebar shows all areas

## Common Test Searches

### By Area Name:
- `downtown` → Should find Zone A
- `relief` → Should find Zone B
- `water` → Should find Zone C and resource centers
- `shelter` → Should find Zone D

### By Priority:
- `critical` → Should find critical priority areas
- `high` → Should find high priority areas
- `medium` → Should find medium priority areas
- `low` → Should find low priority areas

### By Resource:
- `medical` → Should find areas needing medical supplies
- `food` → Should find areas needing food
- `water` → Should find water-related locations
- `shelter` → Should find shelter locations

## Troubleshooting

### If Nothing Appears in Console:
1. Make sure Developer Tools Console is open (F12)
2. Refresh the page (Ctrl+R or F5)
3. Check if JavaScript is enabled

### If Search Doesn't Work:
1. Check console for error messages (red text)
2. Verify you see the initialization logs
3. Make sure the search input is focused (click it)
4. Try typing slowly

### If Markers Don't Show:
1. Check console for "Added X markers to map" message
2. Zoom out to see if markers are outside view
3. Click "Show All" button to reset
4. Refresh the page

### If Console Shows Errors:
Look for these specific errors and solutions:
- **"Search input element not found!"** → The HTML elements are missing
- **"Marker element not yet available"** → This is normal, markers loading
- **"Cannot read property 'id'"** → Area data is missing or corrupted

## Expected Console Output (Complete Flow)

### On Page Load:
```
🔍 Search elements: {searchInput: true, clearSearchBtn: true, searchResultsDiv: true}
🔧 Setting up search event listeners...
✅ Search input listeners attached
✅ Clear button listener attached
🔴 Real-time updates started
```

### When Typing "downtown":
```
⌨️ Input event triggered: d
⌨️ Input event triggered: do
⌨️ Input event triggered: dow
⌨️ Input event triggered: down
⌨️ Input event triggered: downt
⌨️ Input event triggered: downto
⌨️ Input event triggered: downtow
⌨️ Input event triggered: downtown
🔍 Searching for: downtown
📊 Total areas to search: 8
📦 Total resources to search: 3
✅ Found: 1 areas, 0 resources
🗺️ Highlighting results on map...
📍 Added 1 area markers to map
📦 Added 0 resource markers to map
```

### When Clicking Clear:
```
🗑️ Clear search clicked
```

## Success Criteria

✅ Console shows all initialization logs
✅ Typing triggers input events
✅ Search finds correct results
✅ Map zooms to results
✅ Markers appear on map
✅ Sidebar updates with results
✅ Clear button works
✅ No error messages in console

## Quick Video Recording (Optional)

If search still doesn't work, record these steps:
1. Open http://localhost:5173/src/Map.html
2. Open Console (F12)
3. Type "downtown" in search box
4. Take screenshot of console
5. Take screenshot of map

This will help identify the exact issue!

---

**Test URL**: http://localhost:5173/src/Map.html
**Console**: Press F12
**Status**: Ready for testing
