# Family Member Video Calling Experience

## Video Calling Status
- **Implementation Status**: Incomplete/Non-functional
- **Error Encountered**: "Unhandled Runtime Error - Event handlers cannot be passed to Client Component props"
- **Technical Issue**: The error indicates a Next.js client/server component boundary issue with event handlers

## Error Details
- Error occurs when attempting to start a new call
- The error specifically mentions issues with passing event handlers to client components
- Parameters mentioned in error: userId, userRole="family", facilityId, callType, scheduledTime, participants, onJoinCall

## Component Analysis
Based on the VideoRoom.tsx component:
- Uses Twilio integration for video calling
- Designed to handle different user roles (resident, visitor, attorney, staff)
- Includes features for recording calls based on facility settings
- Has UI components for video controls, recording indicators, and error handling
- Implements proper connection and disconnection handling

## Missing Implementation
- Database integration for call participants
- Proper client/server component boundaries
- Call scheduling functionality
- Contact selection interface

## Next Steps for Development
- Refactor the component to properly handle client/server boundaries in Next.js
- Implement proper error handling for video calling
- Complete the contact selection and call scheduling interfaces
- Ensure proper integration with the database for call history
