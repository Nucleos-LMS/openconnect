import { fetchWithAuth } from './fetch';

/**
 * Interface for call data returned from the API
 */
export interface CallData {
  id: string;
  participants: string[];
  startTime: string;
  endTime?: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  type?: 'video' | 'audio' | 'legal' | 'educational';
  metadata?: Record<string, any>;
}

/**
 * Interface for creating a new call
 */
export interface CreateCallParams {
  participantIds: string[];
  scheduledTime?: string;
  type?: 'video' | 'audio' | 'legal' | 'educational';
  metadata?: Record<string, any>;
}

/**
 * Create a new call with the specified participants
 */
export async function createCall(params: CreateCallParams): Promise<CallData> {
  console.log('[API] Creating new call', params);
  
  return fetchWithAuth('/api/calls', {
    method: 'POST',
    body: JSON.stringify(params),
  });
}

/**
 * Get a call by its ID
 */
export async function getCallById(callId: string): Promise<CallData> {
  console.log('[API] Getting call by ID', { callId });
  
  return fetchWithAuth(`/api/calls/${callId}`);
}

/**
 * Get all calls for the current user
 */
export async function getUserCalls(): Promise<CallData[]> {
  console.log('[API] Getting user calls');
  
  return fetchWithAuth('/api/calls');
}

/**
 * Update an existing call
 */
export async function updateCall(callId: string, updates: Partial<CallData>): Promise<CallData> {
  console.log('[API] Updating call', { callId, updates });
  
  return fetchWithAuth(`/api/calls/${callId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
}

/**
 * Cancel a call
 */
export async function cancelCall(callId: string, reason?: string): Promise<CallData> {
  console.log('[API] Cancelling call', { callId, reason });
  
  return fetchWithAuth(`/api/calls/${callId}/cancel`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
}

/**
 * Join an active call
 */
export async function joinCall(callId: string): Promise<CallData> {
  console.log('[API] Joining call', { callId });
  
  return fetchWithAuth(`/api/calls/${callId}/join`, {
    method: 'POST',
  });
}

/**
 * Leave an active call
 */
export async function leaveCall(callId: string): Promise<CallData> {
  console.log('[API] Leaving call', { callId });
  
  return fetchWithAuth(`/api/calls/${callId}/leave`, {
    method: 'POST',
  });
}

/**
 * Get scheduled calls for the current user
 */
export async function getScheduledCalls(): Promise<CallData[]> {
  console.log('[API] Getting scheduled calls');
  
  return fetchWithAuth('/api/calls?status=scheduled');
}

/**
 * Get active calls for the current user
 */
export async function getActiveCalls(): Promise<CallData[]> {
  console.log('[API] Getting active calls');
  
  return fetchWithAuth('/api/calls?status=active');
}

/**
 * Get completed calls for the current user
 */
export async function getCompletedCalls(): Promise<CallData[]> {
  console.log('[API] Getting completed calls');
  
  return fetchWithAuth('/api/calls?status=completed');
}
