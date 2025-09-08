# Zustand Stores

This directory contains Zustand stores for state management in the money management app.

## Available Stores

### AuthStore (`authStore.ts`)
Manages user authentication state and operations.

**State:**
- `user`: Current logged-in user data
- `isAuthenticated`: Boolean indicating if user is logged in
- `isLoading`: Loading state for async operations
- `error`: Error message from last operation

**Actions:**
- `signIn(email, password)`: Authenticate user with email/password
- `signUp(userData)`: Create new user account
- `signOut()`: Log out current user
- `checkAuthStatus()`: Verify current authentication status
- `updateUser(updates)`: Update user profile information
- `clearError()`: Clear current error message

**Usage:**
```tsx
import { useAuthStore } from '../stores/authStore';

function MyComponent() {
  const { user, isAuthenticated, signIn, signOut } = useAuthStore();
  
  // Component logic here
}
```

## Features

### Persistent Storage
- Uses Expo SecureStore for secure credential storage
- Automatically restores authentication state on app restart
- Only persists essential data (user info and auth status)

### Error Handling
- Centralized error management
- Automatic error clearing after successful operations
- User-friendly error messages

### Loading States
- Built-in loading indicators for async operations
- Prevents duplicate requests during loading

## Best Practices

1. **Import from store directly**: `import { useAuthStore } from '../stores/authStore'`
2. **Check authentication status**: Always verify `isAuthenticated` before accessing protected features
3. **Handle errors**: Display `error` messages to users and call `clearError()` after handling
4. **Use loading states**: Show loading indicators based on `isLoading` state

## Adding New Stores

When creating new stores, follow this pattern:

```tsx
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MyState {
  // State properties
}

interface MyActions {
  // Action functions
}

export const useMyStore = create<MyState & MyActions>()(
  persist(
    (set, get) => ({
      // Implementation
    }),
    {
      name: 'my-store',
      // Configure persistence options
    }
  )
);
```

Don't forget to add the export to `index.ts`!
