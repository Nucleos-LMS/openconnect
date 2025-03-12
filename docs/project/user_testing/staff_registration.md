# Staff Registration Flow

## Registration Process Overview
- Registration flow begins with user type selection
- Staff option is not directly shown in the user type selection
- Registration appears to be designed for external users (family, legal, educator)

## Registration Steps
1. **User Type Selection**
   - Options: Family Member, Legal Representative, Educator
   - No option for Staff users
   - Clear descriptions for each user type

## Implementation Status
- Staff registration is not available through the standard registration flow
- This suggests staff accounts are likely created through an administrative interface
- This aligns with security requirements for correctional facilities

## Technical Analysis
Based on the code review:
- Registration flow is defined in `src/components/features/registration/types.ts`
- User types include: 'family', 'legal', 'educator' but not 'staff'
- Staff user accounts are likely managed through a separate administrative interface

## Security Considerations
- Staff accounts require higher security and verification
- Administrative creation of staff accounts provides better control
- Prevents unauthorized individuals from attempting to register as staff

## Conclusion
The registration flow for Staff users is intentionally not available through the standard user registration process. This is a security feature that ensures only properly vetted and authorized individuals can be granted staff access to the system. Staff accounts are likely created through an administrative interface by system administrators or facility managers.
