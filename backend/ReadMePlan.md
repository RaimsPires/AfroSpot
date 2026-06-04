Plan: Email Verification for Business Registration
TL;DR: Integrate auth_kit's email verification into the business registration flow. After successful business creation:

New users → sent verification email → shown BusinessEmailVerificationScreen → locked out until verified → redirected to AppFlow after verification
Existing users → shown success message → redirected to login screen → must login again to access new business
Steps
PHASE 1: Backend - Integrate Email Verification (depends on nothing)
Modify register_all_serializer.py in the save() method:

When creating a new user (Mode A), call auth_kit's send_verify_email function instead of leaving email unverified
Set is_active=False for new users so they cannot login until email is verified (auth_kit's standard approach)
After successful business creation, return metadata about registration mode: { "created_new_user": bool, "requires_email_verification": bool }
Modify register_all.py RegisterAllView.post() response:

Include registration scenario flags in response: "is_new_user": bool, "is_existing_user": bool
This tells frontend which screen to show next
PHASE 2: Backend - Create Email Verification Endpoint (depends on Phase 1)
Create a new endpoint /api/spots/verify-business-registration-email/ that:
Accepts email verification key from auth_kit (same as client app uses)
Verifies the key, activates the user account
Returns success/failure status
This allows mobile apps to verify via API instead of web link
PHASE 3: Frontend - Create Business Email Verification Screen (parallel with Phase 1 & 2)
Create new screen shop/src/screens/auth/BusinessEmailVerificationScreen.tsx:

Show masked email address (reuse maskEmail() logic from client app's EmailVerificationPendingScreen.tsx)
Display "Check Your Inbox" message with business details confirmed
Implement polling loop to check verification status every 8 seconds (reuse timing from client app)
Show "Resend Verification Email" button (manual request only)
On verification success → navigate to AppFlow
On app suspend/resume → immediately check verification status
Create Business Registration Success Screen shop/src/screens/auth/BusinessRegistrationSuccessScreen.tsx:

For existing users (Mode B)
Show "Business Created Successfully" message
Display business name and slug
Show "Navigate to Login" button that routes to LoginScreen
Message: "Your new business has been created. Log in again to access your business dashboard."
PHASE 4: Frontend - Update Navigation Logic in Shop App (depends on Phase 1 & Phase 3)
Modify AuthStackNavigator.tsx:

Add new screens: BusinessEmailVerification and BusinessRegistrationSuccess
Update screen ordering
Modify BusinessKYCScreen.tsx in submitFullRegistration():

After POST to /spots/register-all/, check response flags
If is_new_user === true → navigate to BusinessEmailVerification (pass email)
If is_existing_user === true → navigate to BusinessRegistrationSuccess (pass business details)
Update useRegistrationStore.ts:

Add state to track: registrationMode (new_user | existing_user), businessCreated, userEmail
Store business details from successful registration response
PHASE 5: Frontend - Implement Email Verification Polling (depends on Phase 2 & Phase 3)
In BusinessEmailVerificationScreen.tsx:
Create checkBusinessEmailVerified() function that:
Calls POST /api/spots/verify-business-registration-email/ with email + current password (from route params)
Returns boolean: email verified or not
Implement polling interval (8 seconds while screen mounted)
Check on app resume (AppState listener)
Show resend button that calls POST /api/auth/registration/resend-email/ (auth_kit's existing endpoint)
PHASE 6: Frontend - Update App Flow Navigation (depends on Phase 4)
Modify AppStackNavigator.tsx or root navigation:
After email verification → AppFlow should check which business to show in dashboard
The newly created business should be accessible
Relevant Files
Backend Serializer: register_all_serializer.py — Where user creation happens (lines 40-70)
Backend View: register_all.py — Response format
Backend User Model: user.py — Has is_active field
Frontend Current Flow: BusinessKYCScreen.tsx — Navigate to success screen
Frontend Reference (Client App): EmailVerificationPendingScreen.tsx — Reuse polling & masking logic
Frontend Store: useRegistrationStore.ts — Track registration state
Frontend Navigation: AuthStackNavigator.tsx — Add new screens
Verification
Backend Tests:

New user registration → is_active=False, email verification email sent
Existing user registration → is_active=True (unchanged), no email verification
Response includes correct flags (is_new_user, is_existing_user)
Manual Testing - New User Flow:

Register new account + business → see "Check Your Inbox" screen
Verify email link in inbox → screen auto-navigates to AppFlow
Resend button works → email resent
Manual Testing - Existing User Flow:

Login with existing user
Create new business → see "Business Created" success screen
Click "Navigate to Login" → redirected to login screen
Login with same credentials → can access new business
Decisions
Email Lock: New users set is_active=False so auth fails until verified (auth_kit standard)
Existing Users: Must re-authenticate to access new business (security best practice, reduces account takeover risk)
Polling: Reuse 8-second interval from client app for consistency
Endpoint Reuse: Use auth_kit's existing /auth/registration/resend-email/ endpoint
Further Considerations
Backward Compatibility - The /spots/register-all/ endpoint should continue to work with client app (which doesn't expect verification yet). Add a query param like ?skip_email_verification=true for legacy clients if needed, or handle gracefully on frontend.

Admin Approval - Note that businesses are created with is_verified=False (pending KYC). Should email verification happen before or after business KYC approval? Current plan: email verification for user account, separate from business verification.

Multi-Business UX - After email verification, existing users who created a new business should see a business switcher or selector to choose which business to access. Ensure the app shows newly created business in the dashboard.

