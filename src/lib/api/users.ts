import { fetchWithAuth } from './fetch';

/**
 * Interface for user profile data returned from the API
 */
export interface UserProfile {
  id: string;
  name?: string | null;
  email: string;
  role: string;
  contacts?: string[];
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Get the current user's profile
 */
export async function getCurrentUser(): Promise<UserProfile> {
  console.log('[API] Getting current user profile');
  
  return fetchWithAuth('/api/users/me');
}

/**
 * Update the current user's profile
 */
export async function updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
  console.log('[API] Updating user profile', updates);
  
  return fetchWithAuth('/api/users/me', {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Get the current user's contacts
 */
export async function getUserContacts(): Promise<UserProfile[]> {
  console.log('[API] Getting user contacts');
  
  return fetchWithAuth('/api/users/contacts');
}

/**
 * Add a contact to the current user's contacts
 */
export async function addUserContact(contactId: string): Promise<UserProfile> {
  console.log('[API] Adding user contact', { contactId });
  
  return fetchWithAuth('/api/users/contacts', {
    method: 'POST',
    body: JSON.stringify({ contactId }),
  });
}

/**
 * Remove a contact from the current user's contacts
 */
export async function removeUserContact(contactId: string): Promise<UserProfile> {
  console.log('[API] Removing user contact', { contactId });
  
  return fetchWithAuth(`/api/users/contacts/${contactId}`, {
    method: 'DELETE',
  });
}

/**
 * Get the current user's settings
 */
export async function getUserSettings(): Promise<Record<string, any>> {
  console.log('[API] Getting user settings');
  
  return fetchWithAuth('/api/users/settings');
}

/**
 * Update the current user's settings
 */
export async function updateUserSettings(settings: Record<string, any>): Promise<Record<string, any>> {
  console.log('[API] Updating user settings', settings);
  
  return fetchWithAuth('/api/users/settings', {
    method: 'PATCH',
    body: JSON.stringify(settings),
  });
}

/**
 * Get a user by ID
 */
export async function getUserById(userId: string): Promise<UserProfile> {
  console.log('[API] Getting user by ID', { userId });
  
  return fetchWithAuth(`/api/users/${userId}`);
}

/**
 * Search for users
 */
export async function searchUsers(query: string): Promise<UserProfile[]> {
  console.log('[API] Searching users', { query });
  
  return fetchWithAuth(`/api/users/search?q=${encodeURIComponent(query)}`);
}
