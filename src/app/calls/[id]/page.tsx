'use client';

import React from 'react';
import { VideoRoomWrapper } from '@/components/communication/VideoRoomWrapper/VideoRoomWrapper';

export default function CallPage() {
  // Use config-based provider selection
  return <VideoRoomWrapper />;
}
