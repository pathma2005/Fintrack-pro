# TODO List for Google Login Fix

## Completed Tasks
- [x] Update firebase.js to prompt for account selection (added provider.setCustomParameters({ prompt: 'select_account' }))
- [x] Modify SignupSignin/index.js to check for existing users before creating a new account (added getDoc check and "Email already exists" error)

## Followup Steps
- [ ] Test the changes by running the app and attempting Google signup with an existing email
- [ ] Verify that the account selection prompt appears instead of 2FA
- [ ] Ensure login functionality still works correctly
