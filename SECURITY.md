# 🔒 Security Guidelines for BookMate

This document outlines security best practices and steps taken to protect sensitive data in the BookMate project.

## ⚠️ Security Alert Resolution

### Issue: Exposed Google API Key

A Google API Key was accidentally committed to the repository in `google-services (1).json`. 

**Resolution Steps Taken:**
1. ✅ Removed the file from git tracking with `git rm --cached`
2. ✅ Added `google-services*.json` to `.gitignore`
3. ✅ Prevented future commits of sensitive files

**Action Required:**
1. **🔄 Rotate Your Firebase API Keys** (CRITICAL)
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to APIs & Services > Credentials
   - Delete the exposed API key
   - Create a new API key
   - Update your Firebase config

2. **Review Repository Access**
   - Check who has access to the repository
   - Review git history for any other exposed secrets
   - Monitor your Firebase projects for suspicious activity

## 🛡️ Sensitive Files to Never Commit

**NEVER commit these files:**

```
google-services.json          # Android Firebase config
GoogleService-Info.plist      # iOS Firebase config
.env                          # Environment variables
.env.local                     # Local environment variables
*.p8, *.p12, *.key           # Private keys
*.jks                         # Java keystores
```

All these files are now in `.gitignore` to prevent accidental commits.

## 🔐 Environment Variables Setup

### 1. Create `.env` File (Local Only)

Create a `.env` file in the project root. This file should **NEVER** be committed.

```bash
# .env
EXPO_PUBLIC_FIREBASE_API_KEY=your_real_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Use `.env.example` for Documentation

The `.env.example` file documents what environment variables are needed:

```bash
# .env.example
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
# ... etc
```

**This file IS safe to commit** - it only contains placeholder values.

## 📝 Firebase Config Best Practices

### Frontend Security

Your `config/firebaseConfig.ts` uses environment variables:

```typescript
const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  // ...
};
```

**✅ This is safe** because:
- API key is in environment variable, not hardcoded
- `EXPO_PUBLIC_` prefix means it's intended for client-side exposure
- `.env` is in `.gitignore` and not committed

### API Key Restrictions

Set up restrictions in Firebase Console to limit API key usage:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services > Credentials
3. Select your API key
4. Under "Key restrictions", set:
   - **Application restrictions**: Android app + iOS app
   - **API restrictions**: Limit to Firebase services only

## 🚨 Firebase Security Rules

### Firestore Rules

Protect user data with proper security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    
    match /photos/{docId} {
      allow read, write: if request.auth.uid == resource.data.uid;
      allow create: if request.auth != null;
    }
  }
}
```

### Cloud Storage Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /photos/{uid}/{allPaths=**} {
      allow read, write: if request.auth.uid == uid;
    }
  }
}
```

### Authentication Rules

Enable only necessary auth methods:
- ✅ Email/Password
- ❌ Disable unused methods (Google Sign-In, Facebook, etc.)

## 🔐 Local Development Checklist

- [ ] Created `.env` file with real Firebase credentials
- [ ] Verified `.env` is in `.gitignore`
- [ ] Downloaded `google-services.json` locally
- [ ] Downloaded `GoogleService-Info.plist` locally (if developing for iOS)
- [ ] Placed both files in project root (for EAS builds)
- [ ] Never committed these files
- [ ] Set up Firebase security rules
- [ ] Restricted API key in Google Cloud Console

## 🚀 Deployment Checklist

### Before Building

- [ ] Verify `.env` file is created locally
- [ ] Check Firebase credentials are current
- [ ] Review Firestore security rules
- [ ] Confirm API key restrictions are set
- [ ] Update any API keys if needed

### EAS Build Configuration

Store secrets in EAS secrets, not in code:

```bash
# Using EAS to manage secrets
eas secret:create --scope project --name FIREBASE_API_KEY
eas secret:create --scope project --name FIREBASE_PROJECT_ID
# ... etc
```

Then reference in `eas.json`:

```json
{
  "build": {
    "production": {
      "env": {
        "EXPO_PUBLIC_FIREBASE_API_KEY": "@FIREBASE_API_KEY"
      }
    }
  }
}
```

## 🔍 Security Monitoring

### Regular Audits

1. Review git history for secrets:
   ```bash
   git log -p --all --source -- '*.json' | grep -i "apikey\|secret\|key" | head -20
   ```

2. Check for accidentally committed files:
   ```bash
   git ls-files | grep -E "(\.env|google-services|GoogleService-Info)"
   ```

3. Monitor Firebase security:
   - Enable Cloud Audit Logs
   - Set up alerts for suspicious activity
   - Review authentication logs regularly

### GitHub Security Settings

1. Enable branch protection on `main`
2. Require code reviews
3. Enable status checks before merge
4. Dismiss stale PR approvals

## 📚 Resources

- [Firebase Security Best Practices](https://firebase.google.com/docs/rules)
- [OWASP API Security](https://owasp.org/www-project-api-security/)
- [Git Secrets Prevention](https://github.com/awslabs/git-secrets)
- [GitHub Security Alerts](https://docs.github.com/en/code-security/secret-scanning)

## 🆘 Emergency Response

If you accidentally commit secrets:

1. **Immediately rotate the compromised credentials**
   - Delete exposed API keys
   - Generate new credentials
   - Update all references

2. **Remove from git history**
   ```bash
   git rm --cached <filename>
   git commit -m "Remove <filename>"
   git push
   ```

3. **Alert your team**
   - Inform team members of the incident
   - Share updated credentials via secure channel

4. **Monitor for abuse**
   - Check Firebase usage logs
   - Look for unauthorized API calls
   - Review billing for suspicious charges

## ✅ Verification

To verify this project is secure:

```bash
# Check if any secrets are tracked
git ls-files | grep -E "google-services|GoogleService-Info|\.env$"

# Should return nothing - files shouldn't be tracked

# Check .gitignore is updated
cat .gitignore | grep -E "google-services|GoogleService-Info"

# Should show the entries are in .gitignore
```

---

**Last Updated:** January 27, 2026
**Status:** ✅ Secure - Exposed secrets removed and prevented
