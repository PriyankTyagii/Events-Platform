# Deployment Guide - Vercel

## Prerequisites
- GitHub account
- Vercel account (free)
- Firebase project configured

## Step-by-Step Deployment

### 1. Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add gitignore (already created)
# Ensure .env.local is in .gitignore

# Add all files
git add .

# Commit
git commit -m "Initial commit: Sydney Events Platform"

# Create GitHub repository
# Then push:
git remote add origin https://github.com/YOUR_USERNAME/sydney-events.git
git branch -M main
git push -u origin main
```

### 2. Import to Vercel

1. Go to https://vercel.com
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Configure:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 3. Add Environment Variables

In Vercel project settings → Environment Variables, add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_value
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_value
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_value
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_value
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_value
NEXT_PUBLIC_FIREBASE_APP_ID=your_value

FIREBASE_ADMIN_PROJECT_ID=your_value
FIREBASE_ADMIN_CLIENT_EMAIL=your_value
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"

CRON_SECRET=your_random_secret
```

**Important for Private Key:**
- Click "Edit" on FIREBASE_ADMIN_PRIVATE_KEY
- Select "Plaintext" tab
- Paste entire key INCLUDING quotes and \n characters
- Should look like: `"-----BEGIN PRIVATE KEY-----\nMIIE...\n-----END PRIVATE KEY-----\n"`

### 4. Configure Firebase for Production

1. **Add Vercel Domain to Firebase**
   - Go to Firebase Console
   - Authentication → Settings → Authorized domains
   - Click "Add domain"
   - Add your Vercel domain: `your-app.vercel.app`
   - Also add any custom domains

2. **Update Firestore Security Rules** (if needed)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /events/{eventId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
       
       match /emails/{emailId} {
         allow create: if true;
         allow read, update, delete: if request.auth != null;
       }
     }
   }
   ```

### 5. Deploy

1. Click "Deploy"
2. Wait for build to complete (2-5 minutes)
3. Visit your deployed site: `https://your-app.vercel.app`

### 6. Test Production Site

**Test Public Site:**
- Visit homepage
- Check events display
- Test GET TICKETS flow
- Verify email capture works

**Test Authentication:**
- Click "Sign In"
- Sign in with Google
- Should work (if authorized domain added)

**Test Dashboard:**
- Access `/dashboard`
- Test all filters
- Run scraper
- Import events

### 7. Verify Cron Job

1. In Vercel Dashboard → Your Project
2. Go to "Cron Jobs" tab
3. Should see: `/api/scrape/cron` scheduled for `0 */6 * * *`
4. Click "Trigger" to test manually
5. Check logs for execution

### 8. Monitor

**Check Logs:**
- Vercel Dashboard → Your Project → Logs
- Filter by "Cron" to see scheduled runs
- Check for errors

**Check Firestore:**
- Firebase Console → Firestore Database
- Monitor `events` collection
- Should see new events appearing every 6 hours

## Custom Domain (Optional)

1. **Purchase Domain** (e.g., from Namecheap, Google Domains)

2. **Add to Vercel:**
   - Project Settings → Domains
   - Add your domain
   - Follow DNS instructions

3. **Add to Firebase:**
   - Authentication → Authorized domains
   - Add custom domain

## Environment-Specific Settings

### Development (.env.local)
```env
# All your Firebase credentials
NEXT_PUBLIC_FIREBASE_API_KEY=...
# etc.
```

### Production (Vercel)
Same variables, but set in Vercel dashboard

## Troubleshooting

### Build Fails

**Error: Missing environment variables**
- Check all env vars are added in Vercel
- Verify spelling matches exactly

**Error: Firebase Admin**
- Check FIREBASE_ADMIN_PRIVATE_KEY format
- Should include quotes and \n characters
- Use "Plaintext" mode in Vercel

### Authentication Not Working

**Error: Unauthorized domain**
- Add Vercel domain to Firebase authorized domains
- Wait 1-2 minutes for propagation

**Error: Sign in popup blocked**
- Check browser popup blocker
- Try in incognito mode

### Cron Not Running

**Check Configuration:**
- Verify `vercel.json` exists in root
- Check CRON_SECRET is set
- Logs should show cron executions

**Manual Test:**
```bash
curl https://your-app.vercel.app/api/scrape/cron \
  -H "Authorization: Bearer YOUR_CRON_SECRET"
```

### Scraper Not Working

**Network Issues:**
- Vercel has network restrictions
- Some scrapers might fail
- Check logs for specific errors

**Alternative:**
- Use manual scraper trigger from dashboard
- Set up external cron (e.g., cron-job.org) to hit `/api/scrape`

## Performance Optimization

### Enable Analytics
- Vercel → Analytics tab
- Monitor page loads, errors

### Optimize Images
- Consider using Vercel Image Optimization
- Update `next.config.mjs` if needed

### Database Optimization
- Index frequently queried fields in Firestore
- Consider pagination for large datasets

## Backup Strategy

**Firestore Backup:**
- Firebase Console → Firestore → Import/Export
- Schedule regular exports
- Store in Cloud Storage

**Code Backup:**
- GitHub repository (already done)
- Consider multiple remotes

## Cost Monitoring

### Vercel (Free Tier)
- 100 GB bandwidth/month
- Unlimited projects
- Automatic SSL

### Firebase (Free Tier)
- 50K reads/day
- 20K writes/day
- 1 GB storage
- Monitor usage in Firebase Console

## Update Process

**Deploy Updates:**
```bash
git add .
git commit -m "Description of changes"
git push origin main
```

Vercel automatically deploys on push to `main` branch.

## Success Checklist ✅

Before marking deployment complete:

- [ ] Site loads at Vercel URL
- [ ] Events display on homepage
- [ ] GET TICKETS modal works
- [ ] Emails saved to Firestore
- [ ] Google sign-in works
- [ ] Dashboard accessible
- [ ] All filters work
- [ ] Import functionality works
- [ ] Cron job scheduled
- [ ] Manual scraper works
- [ ] No console errors
- [ ] Mobile responsive
- [ ] SSL certificate active

## Support

**Vercel Issues:**
- https://vercel.com/support

**Firebase Issues:**
- https://firebase.google.com/support

**Next.js Issues:**
- https://github.com/vercel/next.js/discussions

---

🎉 **Congratulations!** Your Sydney Events Platform is now live!
