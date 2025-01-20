# Friends and Family Call Flow

## User Journey Map

### 1. Initial Setup (Family Member)
1. Account Creation
   - Register with email/phone
   - Verify identity
   - Accept terms of service
   - Set up profile

2. Contact Setup
   - Add incarcerated loved one
   - Provide facility information
   - Submit for verification
   - Receive approval notification

### 2. Call Scheduling
1. Schedule Visit
   - Select contact
   - View available time slots
   - Choose date/time
   - Receive confirmation
   - Add to calendar

2. Pre-Call Preparation
   - Receive reminder notifications
   - Test device/connection
   - Review guidelines
   - Join waiting room

### 3. During Call
1. Call Management
   - Audio/video controls
   - Connection status
   - Time remaining
   - Chat backup (if video fails)
   
2. Call Features
   - Screen sharing (if allowed)
   - Quality adjustments
   - Volume controls
   - Emergency support access

### 4. Post-Call
1. Call Summary
   - Duration
   - Quality metrics
   - Next scheduled call
   - Support resources

## Required UI Components

### 1. Registration Flow
- `RegistrationForm`
  - Personal information
  - Contact details
  - Identity verification
  - Terms acceptance

- `ContactVerification`
  - Facility search
  - Inmate lookup
  - Relationship declaration
  - Document upload

### 2. Scheduling Interface
- `ScheduleCalendar`
  - Available slots
  - Time zone handling
  - Conflict detection
  - Recurring options

- `ConfirmationDialog`
  - Visit details
  - Guidelines
  - Technical requirements
  - Confirmation button

### 3. Video Call Interface
- `VideoRoom`
  - Main video display
  - Local video preview
  - Audio/video controls
  - Connection status

- `CallControls`
  - Mute/unmute
  - Camera toggle
  - End call
  - Settings access

### 4. Support Features
- `TechnicalCheck`
  - Connection test
  - Device setup
  - Browser compatibility
  - Troubleshooting guide

- `NotificationSystem`
  - Schedule reminders
  - System updates
  - Technical alerts
  - Support messages

## Implementation Notes

### Design System Usage
```typescript
// Example component using Chakra UI
import {
  Box,
  Button,
  Container,
  Heading,
  Stack,
  Text,
  useToast
} from '@chakra-ui/react'

const ScheduleVisit = () => {
  return (
    <Container maxW="container.md">
      <Stack spacing={6}>
        <Heading>Schedule a Visit</Heading>
        <Box 
          p={6} 
          borderRadius="md" 
          bg="white" 
          boxShadow="sm"
        >
          {/* Calendar Component */}
        </Box>
        <Button 
          colorScheme="blue"
          size="lg"
        >
          Confirm Schedule
        </Button>
      </Stack>
    </Container>
  )
}
```

### Accessibility Considerations
1. Color contrast (WCAG 2.1)
2. Keyboard navigation
3. Screen reader support
4. Focus management
5. Error announcements

### Mobile Responsiveness
1. Touch-friendly controls
2. Adaptive layouts
3. Network awareness
4. Battery optimization

## Next Steps
1. Create component prototypes
2. Implement basic routing
3. Add form validation
4. Integrate with Twilio
5. Test accessibility 