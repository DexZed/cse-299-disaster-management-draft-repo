# Admin Dashboard - JavaScript/HTML Version

A pure JavaScript, HTML, and CSS admin dashboard for resource management with no framework dependencies.

## 📋 Overview

This dashboard provides a complete resource management system built with vanilla JavaScript, HTML5, and CSS3. It uses Chart.js for beautiful data visualizations and includes all the features needed for emergency resource coordination.

## 🎯 Features

### Statistics Overview
- **5 Key Metrics Cards** displaying:
  - Total Resources Available
  - Available Resources Ready to Dispatch
  - Dispatched Resources in Field
  - Pending Tasks Requiring Attention
  - Task Completion Rate

### 📊 Data Visualizations

#### 1. Resource Usage Trends (Line Chart)
- 7-day historical view of resource usage
- Tracks 6 resource types:
  - 🏥 Medical Supplies
  - 🍲 Food Packages
  - 💧 Water Resources
  - 🏕️ Shelter Materials
  - 🔧 Equipment
  - 👥 Personnel

#### 2. Resource Distribution (Pie Chart)
- Visual breakdown of resource allocation by type
- Shows percentage distribution across all categories

#### 3. Task Completion Status (Pie Chart)
- Displays task progress:
  - ✅ Completed
  - 🔄 In Progress
  - ⏳ Pending
  - ❌ Cancelled

#### 4. Resource Status Overview (Bar Chart)
- Shows count of resources by status:
  - Available
  - Dispatched
  - In Transit
  - Depleted

### 📑 Detailed Reports

#### 1. Dispatched Resources by Location
Interactive table showing:
- Resource ID and Name
- Resource Type with color-coded badges
- Quantity with units
- Current Location
- Last Update Timestamp

#### 2. Pending Volunteer Tasks
Priority-coded task cards displaying:
- Task title and detailed description
- Priority level (Critical, High, Medium, Low)
- Location information
- Creation date and deadline
- Required resources with specific quantities
- Color-coded borders based on priority

#### 3. Resource Availability Summary
Status overview table showing:
- Resource type breakdown
- Available quantity
- Dispatched quantity
- In-transit quantity
- Overall status (Good, Low, Critical)

## 🚀 How to Access

### Method 1: Direct Access
Navigate to: `http://localhost:5173/admin-dashboard.html`

### Method 2: From Landing Page
1. Start the dev server: `npm run dev`
2. Visit: `http://localhost:5173/`
3. Click on "JavaScript Dashboard" option

## 💻 Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with gradients, flexbox, and grid
- **Vanilla JavaScript** - Pure ES6+ JavaScript
- **Chart.js v4.4.0** - Data visualization library (loaded via CDN)

## 📁 File Structure

```
vite-project/
├── admin-dashboard.html          # Main dashboard file (standalone)
├── public/
│   └── index.html               # Landing page with navigation
└── package.json
```

## 🎨 Design Features

### Responsive Design
- ✅ Desktop (1920px+)
- ✅ Tablet (768px - 1024px)
- ✅ Mobile (320px - 767px)

### Color Coding
- **Critical Priority**: Red (#dc3545)
- **High Priority**: Orange (#ff8042)
- **Medium Priority**: Yellow (#ffc107)
- **Low Priority**: Green (#28a745)

### Status Indicators
- **Good**: Green background
- **Low**: Yellow background
- **Critical**: Red background

### Interactive Elements
- Hover effects on cards
- Smooth transitions
- Shadow depth changes
- Responsive charts

## 📊 Data Structure

### Resources
Each resource contains:
```javascript
{
  id: 'R001',
  name: 'Medical Supplies Kit',
  type: 'Medical',
  quantity: 150,
  unit: 'units',
  status: 'Available',
  location: 'Zone A',
  lastUpdated: Date
}
```

### Tasks
Each task contains:
```javascript
{
  id: 'T001',
  title: 'Emergency Medical Support',
  description: 'Provide immediate assistance',
  priority: 'Critical',
  status: 'Pending',
  resourcesNeeded: [
    { resourceType: 'Medical', quantity: 50, unit: 'kits' }
  ],
  location: 'Zone E',
  createdAt: Date,
  deadline: Date
}
```

## 🔧 Customization

### Adding New Resource Types
Edit the mock data in the `<script>` section:

```javascript
mockResources.push({
  id: 'R013',
  name: 'New Resource',
  type: 'NewType',
  quantity: 100,
  unit: 'units',
  status: 'Available',
  lastUpdated: new Date()
});
```

### Modifying Chart Colors
Update the color arrays in the chart initialization:

```javascript
backgroundColor: ['#0088FE', '#00C49F', '#FFBB28', '#FF8042']
```

### Changing Gradient Background
Modify the CSS:

```css
body {
  background: linear-gradient(135deg, #your-color-1 0%, #your-color-2 100%);
}
```

## 🔄 Real-Time Updates

To integrate with real APIs, replace the mock data with fetch calls:

```javascript
async function loadResources() {
  const response = await fetch('/api/resources');
  const data = await response.json();
  mockResources = data;
  initDashboard();
}
```

## 📱 Mobile Optimization

The dashboard automatically adjusts:
- Grid layouts collapse to single columns
- Font sizes scale down
- Charts resize responsively
- Tables become scrollable
- Touch-friendly buttons and interactions

## 🌐 Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Opera (latest)

## 🚀 Performance

- **Lightweight**: Single HTML file (~50KB)
- **Fast Loading**: Chart.js loaded via CDN
- **No Build Step**: Pure HTML/JS/CSS
- **No Dependencies**: Except Chart.js (CDN)

## 📝 Notes

1. **Chart.js CDN**: Uses Chart.js v4.4.0 from jsDelivr CDN
2. **Mock Data**: Currently uses hardcoded data for demonstration
3. **No Backend Required**: Runs entirely in the browser
4. **Standalone**: Can work without Vite if needed

## 🔮 Future Enhancements

- [ ] Real-time data updates via WebSocket
- [ ] Export reports to PDF/Excel
- [ ] Advanced filtering and search
- [ ] User authentication
- [ ] Database integration
- [ ] Dark mode toggle
- [ ] Map integration for location tracking
- [ ] Email notifications
- [ ] Print-friendly views

## 📄 License

Part of the Resource Management System for emergency response coordination.

---

**Last Updated**: November 13, 2025
**Version**: 1.0.0
**Author**: Admin Dashboard Team
