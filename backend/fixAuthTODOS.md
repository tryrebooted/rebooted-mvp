# Authentication System Fix TODO List

## 🔧 Enable Commented Out Components

### Core Authentication Components
- [ ] **SupabaseConfig.java**: Uncomment `@Configuration` annotation (line 7)
- [ ] **JwtTokenValidator.java**: Uncomment `@Component` annotation (line 16)
- [ ] **JwtAuthenticationFilter.java**: Uncomment `@Component` annotation (line 26)  
- [ ] **UserSyncService.java**: Uncomment `@Service` annotation (line 25)

### Security Configuration
- [ ] **SecurityConfig.java**: Uncomment JWT filter autowiring (lines 21-22)
- [ ] **SecurityConfig.java**: Uncomment JWT filter chain addition (lines 36-37)
- [ ] **SecurityConfig.java**: Change from `permitAll()` to `authenticated()` for API endpoints (lines 42-45)

## 🚨 Fix Broken User Synchronization

### UserSyncService Updates
- [ ] **UserSyncService.java**: Uncomment and implement email update logic (lines 302-306)
- [ ] **UserSyncService.java**: Uncomment and implement full name update logic (lines 309-313)
- [ ] **UserSyncService.java**: Add proper change detection for user updates
- [ ] **UserSyncService.java**: Test and verify `extractFullName()` method works correctly

### User Creation Issues
- [ ] **UserProfileImpl.java**: Uncomment email setting in `NewUserDTO` constructor (line 49)
- [ ] **NewUserDTO.java**: Verify email field is properly used in all constructors

## 🔗 Missing API Endpoints

### Current User Management
- [ ] **UserProfileController.java**: Add `GET /api/users/me` endpoint to get current user profile
- [ ] **UserProfileController.java**: Add `PUT /api/users/me` endpoint to update current user profile
- [ ] **UserProfileController.java**: Add `POST /api/users/setup` endpoint for profile completion after Supabase registration

### User Management (Admin)
- [ ] **UserProfileController.java**: Add `PUT /api/users/{id}` endpoint for admin user updates
- [ ] **UserProfileController.java**: Add `PUT /api/users/{id}/role` endpoint for role management
- [ ] **UserProfileController.java**: Fix `DELETE /api/users/{id}` endpoint - currently broken due to UUID/Long conversion

### Authentication Context
- [ ] **UserProfileController.java**: Remove hardcoded `"test-user-id-123"` and use real JWT extraction (line 45)
- [ ] **All Controllers**: Add authentication context to extract current user from JWT tokens

## 🏗️ Fix Broken Data Models

### UserProfileDTO Completeness
- [ ] **UserProfileDTO.java**: Add missing `email` field
- [ ] **UserProfileDTO.java**: Add missing `fullName` field  
- [ ] **UserProfileDTO.java**: Add missing `createdAt` timestamp
- [ ] **UserProfileDTO.java**: Add missing `updatedAt` timestamp
- [ ] **UserProfileService.java**: Update `convertToDTO()` method to include all fields

### User Entity Issues
- [ ] **UserProfileImpl.java**: Implement `getCourseNames()` method (currently throws UnsupportedOperationException)
- [ ] **UserProfileImpl.java**: Implement `hasAccess(String course)` method (currently throws UnsupportedOperationException)
- [ ] **User.java**: Add proper getters/setters for all fields if missing

## 🔒 Security & Authorization Fixes

### Role-Based Access Control
- [ ] **SecurityConfig.java**: Add method-level security annotations
- [ ] **UserProfileController.java**: Add `@PreAuthorize` annotations for admin-only endpoints
- [ ] **JwtAuthenticationFilter.java**: Verify role extraction and assignment works correctly

### User Permissions
- [ ] **UserProfileService.java**: Add validation that users can only update their own profiles
- [ ] **UserProfileController.java**: Add current user context checking for profile updates
- [ ] **CourseMembershipService.java**: Add user permission checks for course enrollment

## 🗃️ Database & Repository Fixes

### User Deletion Logic
- [ ] **UserProfileService.java**: Fix `deleteById()` method to handle Supabase UUIDs properly (lines 185-195)
- [ ] **UserProfileRepository.java**: Add method to delete by Supabase user ID instead of Long ID

### Data Integrity
- [ ] **UserProfileRepository.java**: Add validation for unique email addresses
- [ ] **UserSyncService.java**: Add proper error handling for constraint violations during user updates
- [ ] **Database Schema**: Verify all user fields have proper constraints and indexes

## 🔄 User Registration & Sync Flow

### Registration Workflow
- [ ] **Create RegistrationController.java**: Handle post-Supabase registration flow
- [ ] **UserSyncService.java**: Add method to handle first-time user setup from frontend
- [ ] **UserProfileService.java**: Add method to check if user profile is complete

### Automatic Synchronization
- [ ] **JwtAuthenticationFilter.java**: Ensure user sync happens on every request if user data changed
- [ ] **UserSyncService.java**: Add mechanism to detect and sync profile changes from Supabase
- [ ] **UserSyncService.java**: Add proper transaction handling for user updates

## 🧪 Testing & Validation

### Integration Testing
- [ ] **Create AuthenticationIntegrationTest.java**: Test full JWT authentication flow
- [ ] **Create UserSyncServiceTest.java**: Test user creation and synchronization
- [ ] **Create UserProfileControllerTest.java**: Test all user management endpoints

### Error Handling
- [ ] **JwtTokenValidator.java**: Add comprehensive error handling for malformed tokens
- [ ] **UserSyncService.java**: Add proper error responses for sync failures
- [ ] **UserProfileController.java**: Add proper HTTP status codes and error messages

## 📚 Documentation Updates

### API Documentation
- [ ] **docs/api/users.md**: Add documentation for new user management endpoints
- [ ] **docs/api/README.md**: Update authentication section to reflect enabled features
- [ ] **docs/setup/getting-started.md**: Add instructions for enabling authentication

### Code Documentation
- [ ] **Add JavaDoc comments**: Document all authentication-related classes and methods
- [ ] **Add inline comments**: Explain complex authentication logic
- [ ] **Update README.md**: Document authentication setup and configuration

## ⚙️ Configuration & Environment

### Production Readiness
- [ ] **application.yml**: Move sensitive values to environment variables
- [ ] **SupabaseConfig.java**: Add validation for required configuration properties
- [ ] **SecurityConfig.java**: Add production-appropriate CORS settings

### Logging & Monitoring
- [ ] **JwtAuthenticationFilter.java**: Add appropriate log levels for production
- [ ] **UserSyncService.java**: Add performance monitoring for user sync operations
- [ ] **Add authentication metrics**: Track login success/failure rates

---

## Priority Order for Implementation

### Phase 1: Core Functionality (Critical)
1. Enable all commented authentication components
2. Fix UserSyncService update logic
3. Add missing user management endpoints
4. Fix broken user deletion

### Phase 2: User Experience (Important)
1. Add current user endpoints (/api/users/me)
2. Implement registration completion flow
3. Fix UserProfileDTO completeness
4. Add proper error handling

### Phase 3: Security & Polish (Nice to Have)  
1. Add role-based access control
2. Implement comprehensive testing
3. Add monitoring and logging
4. Update documentation
