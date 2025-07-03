// Create a new file for auth utilities

/**
 * Fetches the user session from the Laravel backend
 */
export async function getUserSession() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/session`, {
      method: 'GET',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch session');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching user session:', error);
    return null;
  }
}

/**
 * Logs out the user by calling the Laravel logout endpoint
 */
export async function logoutUser() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ''}/auth/logout`, {
      method: 'POST',
      credentials: 'include', // Important for cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to logout');
    }
    
    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
}