# Incarcerated User Registration Flow

## Registration Process Overview
- Registration flow begins with user type selection
- Incarcerated individuals are not directly shown in the user type selection
- Registration appears to be designed for external users (family, legal, educator)

## Registration Steps
1. **User Type Selection**
   - Options: Family Member, Legal Representative, Educator
   - No option for Incarcerated/Resident users
   - Clear descriptions for each user type

2. **Email Verification**
   - Email input with validation
   - "Continue" button to proceed
   - Message indicating verification link will be sent
   - **Issue**: Clicking Continue doesn't advance to the next step

3. **Expected Next Steps (Not Functional)**
   - Personal Information
   - Identity Verification
   - Relationship Information
   - Contact Approval
   - Completion

## Implementation Status
- User interface for initial steps is implemented
- Backend integration appears incomplete
- Form validation works for email field
- Navigation between steps is not functional

## Technical Analysis
Based on the code review:
- Registration flow is defined in `src/components/features/registration/types.ts`
- Steps include: 'user_type', 'email_verification', 'personal_info', 'identity_verification', 'relationship_info', 'contact_approval', 'complete'
- Components exist for each step but backend integration is incomplete

## Security Considerations
- Email verification is the first security step
- Identity verification is planned but not implemented
- Facility approval process is referenced but not functional

## Conclusion
The registration flow for incarcerated users appears to be designed differently than for external users. It's likely that incarcerated users are registered through an administrative interface rather than self-registration, which aligns with the security requirements of correctional facilities.
