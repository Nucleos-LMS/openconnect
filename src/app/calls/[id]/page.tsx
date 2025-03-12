'use client';

import React from 'react';
import { VideoRoomWrapper } from '@/components/communication/VideoRoomWrapper/VideoRoomWrapper';
import { useSearchParams } from 'next/navigation';

export default function CallPage() {
  // Add query parameter support for provider with fallback
  const searchParams = useSearchParams();
  const provider = (searchParams.get('provider') as 'twilio' | 'google-meet') || 
                  (typeof window !== 'undefined' && window.localStorage.getItem('preferred_provider') as 'twilio' | 'google-meet') || 
                  'twilio';
  
  return <VideoRoomWrapper provider={provider} />;
}
