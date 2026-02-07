# Firebase Setup Checklist

## Step 1: Create Firebase Project

1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name (e.g., "sydney-events")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In Firebase Console, click "Authentication" in left sidebar
2. Click "Get started"
3. Click "Sign-in method" tab
4. Click "Google" provider
5. Enable the toggle
6. Select a support email
7. Click "Save"

## Step 3: Create Firestore Database

1. Click "Firestore Database" in left sidebar
2. Click "Create database"
3. Choose "Start in production mode"
4. Select location (choose closest to Sydney: australia-southeast1)
5. Click "Enable"

## Step 4: Get Web App Config

1. Click gear icon ⚙️ next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>)
5. Register app with nickname (e.g., "sydney-events-web")
6. Copy the firebaseConfig object values:
   ```javascript
   const firebaseConfig = {
     apiKey: "...",              // → NEXT_PUBLIC_FIREBASE_API_KEY
     authDomain: "...",          // → NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
     projectId: "...",           // → NEXT_PUBLIC_FIREBASE_PROJECT_ID
     storageBucket: "...",       // → NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
     messagingSenderId: "...",   // → NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
     appId: "..."                // → NEXT_PUBLIC_FIREBASE_APP_ID
   };
   ```

## Step 5: Generate Service Account Key (for Admin SDK)

1. Still in "Project settings"
2. Click "Service accounts" tab
3. Click "Generate new private key"
4. Click "Generate key"
5. A JSON file will download
6. Open the JSON file and copy these values:
   - `project_id` → FIREBASE_ADMIN_PROJECT_ID
   - `client_email` → FIREBASE_ADMIN_CLIENT_EMAIL
   - `private_key` → FIREBASE_ADMIN_PRIVATE_KEY (keep the entire key with \n characters)

## Step 6: Update .env.local

Open `.env.local` in your project and fill in all values from Steps 4 and 5.

⚠️ **IMPORTANT**: Never commit `.env.local` to git (already in .gitignore)

## Step 7: Set Firestore Security Rules

1. Go to Firestore Database → Rules tab
2. Replace with these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Events - public read, admin write
    match /events/{eventId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Email captures - write only
    match /emails/{emailId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
  }
}
```

3. Click "Publish"

## Verification

Run this in your terminal to verify everything is set up:

```bash
npm run dev
```

Then open http://localhost:3000 - you should see the homepage without errors.

## Next Steps

Once Firebase is configured:
1. ✅ Phase 1 complete
2. ➡️ Move to Phase 2: Build scrapers
