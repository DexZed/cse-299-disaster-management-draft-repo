# Admin Login System Documentation

## Overview

The Admin Dashboard now includes a complete authentication system with login/logout functionality, session management, and "Remember Me" feature.

## Features

### 🔐 Authentication Features
- **Secure Login Form** with username and password
- **Session Management** using sessionStorage and localStorage
- **Remember Me** functionality for persistent sessions
- **Auto-logout** on session expiration (30 minutes)
- **Multiple User Roles** (Super Admin, Manager, Coordinator)
- **Permission-based Access** control

### 🎨 UI Features
- Modern, responsive login page design
- Real-time form validation
- Error messaging with visual feedback
- Loading states during authentication
- Success/error animations
- Demo credentials display for testing

## Access the System

### URL
```
http://localhost:5173/admin-dashboard.html
```

## Demo Credentials

### Super Admin
- **Username**: `admin`
- **Password**: `admin123`
- **Permissions**: Full access (read, write, delete, manage users)

### Manager
- **Username**: `manager`
- **Password**: `manager123`
- **Permissions**: Read and write access

### Coordinator
- **Username**: `coordinator`
- **Password**: `coord123`
- **Permissions**: Read-only access

## How It Works

### 1. Login Flow
```
User enters credentials
    ↓
Form validation
    ↓
Authentication check
    ↓
Create session
    ↓
Redirect to dashboard
```

### 2. Session Management
- **sessionStorage**: Used for temporary sessions (cleared on browser close)
- **localStorage**: Used for "Remember Me" (persists after browser close)
- **Auto-refresh**: Session extends on user activity
- **Timeout**: Sessions expire after 30 minutes of inactivity

### 3. Security Features
- Passwords are not stored in session data
- Session expiration checks
- Clear session data on logout
- Input validation and sanitization
- Protection against common attacks (in production, add more layers)

## File Structure

```
vite-project/
├── admin-dashboard.html        # Main dashboard with integrated login
├── Adminlogin.js              # Standalone login module (reusable)
└── ADMIN_LOGIN_README.md      # This documentation
```

## Integration Details

### In admin-dashboard.html

The login system is fully integrated:

```javascript
// Check existing session on load
if (!checkExistingSession()) {
    showLoginPage();
} else {
    showDashboard();
}
```

### Standalone Usage (Adminlogin.js)

You can use the login module separately:

```javascript
// Import the module
const { AuthManager, LoginFormHandler } = require('./Adminlogin.js');

// Initialize
const authManager = new AuthManager(AuthConfig);
const loginForm = new LoginFormHandler(authManager);

// Setup
loginForm.init('loginForm');
loginForm.onLoginSuccess = (user) => {
    console.log('Login successful:', user);
    // Your custom logic here
};
```

## API Reference

### AuthManager Class

#### Methods

**`authenticate(username, password)`**
- Validates credentials
- Returns user object or null

**`createSession(user, rememberMe)`**
- Creates new session
- Stores in sessionStorage/localStorage

**`checkSession()`**
- Checks for existing valid session
- Returns session data or null

**`destroySession()`**
- Clears all session data
- Logs user out

**`hasPermission(permission)`**
- Checks if user has specific permission
- Returns boolean

**`refreshSession()`**
- Extends session expiration time

### LoginFormHandler Class

#### Methods

**`init(formId)`**
- Initialize login form with ID
- Attach event listeners

**`handleSubmit(e)`**
- Process form submission
- Authenticate user

**`validateInputs(username, password)`**
- Validate form fields
- Return boolean

**`showError(message)`**
- Display error message
- Add error styling

**`showSuccess(message)`**
- Display success message

**`reset()`**
- Clear form and errors

## Customization

### Adding New Users

Edit the `validCredentials` array in `admin-dashboard.html`:

```javascript
const AUTH_CONFIG = {
    validCredentials: [
        { 
            username: 'newuser', 
            password: 'password123', 
            role: 'Custom Role' 
        },
        // ... existing users
    ]
};
```

### Changing Session Timeout

Edit the timeout value (in milliseconds):

```javascript
sessionTimeout: 30 * 60 * 1000, // 30 minutes
```

### Custom Styling

Modify the CSS classes in the `<style>` section:

```css
.login-box {
    /* Your custom styles */
}

.btn-login {
    /* Your custom button styles */
}
```

### Adding More Fields

Add new form fields in the HTML:

```html
<div class="form-group">
    <label for="email">Email</label>
    <input type="email" id="email" class="form-control" required>
</div>
```

## Security Considerations

### For Development
✅ Demo credentials are fine for testing
✅ Client-side validation is adequate
✅ Session storage is acceptable

### For Production
⚠️ **Never store credentials in frontend code**
⚠️ **Always use HTTPS**
⚠️ **Implement backend authentication API**
⚠️ **Use secure tokens (JWT, OAuth)**
⚠️ **Add CSRF protection**
⚠️ **Implement rate limiting**
⚠️ **Add password hashing (bcrypt)**
⚠️ **Use environment variables**
⚠️ **Add 2FA (Two-Factor Authentication)**
⚠️ **Log security events**

### Recommended Production Setup

```javascript
// Use backend API for authentication
async function authenticate(username, password) {
    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    
    if (response.ok) {
        const { token, user } = await response.json();
        // Store JWT token
        sessionStorage.setItem('authToken', token);
        return user;
    }
    return null;
}
```

## Troubleshooting

### Issue: Can't login
- Check if credentials match exactly (case-sensitive)
- Clear browser cache and cookies
- Check browser console for errors

### Issue: Session not persisting
- Check if "Remember Me" is checked
- Verify localStorage is not disabled
- Check session expiration time

### Issue: Logout not working
- Clear browser storage manually
- Check if logout button event is attached
- Verify session keys match

### Issue: Form not submitting
- Check if form ID is correct
- Verify JavaScript is loaded
- Check browser console for errors

## Browser Support

✅ Chrome/Edge (latest)
✅ Firefox (latest)
✅ Safari (latest)
✅ Opera (latest)

Requires:
- JavaScript enabled
- LocalStorage/SessionStorage support
- ES6+ support

## Future Enhancements

- [ ] Password strength meter
- [ ] "Forgot Password" functionality
- [ ] Email verification
- [ ] Social login (Google, GitHub, etc.)
- [ ] Two-Factor Authentication (2FA)
- [ ] Login attempt limiting
- [ ] Account lockout after failed attempts
- [ ] Password reset via email
- [ ] User profile management
- [ ] Activity logs
- [ ] Session management dashboard
- [ ] Multi-device session tracking

## Testing

### Manual Testing Checklist

- [ ] Login with correct credentials
- [ ] Login with incorrect credentials
- [ ] Test "Remember Me" functionality
- [ ] Test logout functionality
- [ ] Test session expiration
- [ ] Test form validation
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Test keyboard navigation
- [ ] Test with screen reader

### Automated Testing (Recommended)

```javascript
// Example test with Jest
describe('Authentication', () => {
    it('should authenticate valid user', () => {
        const user = authManager.authenticate('admin', 'admin123');
        expect(user).toBeTruthy();
        expect(user.username).toBe('admin');
    });

    it('should reject invalid credentials', () => {
        const user = authManager.authenticate('admin', 'wrongpass');
        expect(user).toBeNull();
    });
});
```

## Support

For issues or questions:
1. Check this documentation
2. Review the code comments
3. Check browser console for errors
4. Contact the development team

## Changelog

### Version 1.0.0 (November 13, 2025)
- ✨ Initial release
- 🔐 Basic authentication system
- 💾 Session management
- 🎨 Modern UI design
- 📝 Demo credentials
- 🚪 Logout functionality
- 📱 Responsive design

---

**Last Updated**: November 13, 2025  
**Version**: 1.0.0  
**Author**: Admin Dashboard Team
