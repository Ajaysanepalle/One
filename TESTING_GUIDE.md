# 🎯 Testing Guide - Your Job Portal

## ✅ Step-by-Step Testing

### Phase 1: Verify Backend Running

**Backend is already running on http://localhost:8000**

Check it's working:
```
http://localhost:8000/docs
```

You should see **Swagger UI** with all API endpoints.

If backend shows errors:
```bash
cd c:\Users\spava\OneDrive\Desktop\One\job-portal\backend
python main.py
```

---

### Phase 2: Start Frontend

Open **NEW Terminal/PowerShell**:

```bash
cd c:\Users\spava\OneDrive\Desktop\One\job-portal\frontend
python -m http.server 8080
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8080
```

---

### Phase 3: Open in Browser

Go to: **http://localhost:8080**

You should see:
✅ Beautiful gradient header
✅ Hero section with "Find Your Perfect Job"
✅ Search bar
✅ Filter section
✅ Admin Login button (top right)

---

## 🧪 Admin Testing

### 1. Click "Admin Login"
- Click button in top right
- A modal popup should appear

### 2. Login
- **Username:** admin
- **Password:** admin123
- Click "Login"

Expected: ✅ Popup closes, "Admin Login" button changes to "Admin Panel"

### 3. Click "Admin Panel" Again
- Admin dashboard modal opens with tabs

Expected: ✅ See 3 tabs: Add Job, Manage Jobs, Statistics

---

## 🚀 Test Adding a Job

### 1. Fill Job Form

Go to **"Add Job"** tab and fill:

```
Job Name: Python Developer
Company: TechCorp
Description: We are looking for an experienced Python developer with 2+ years of experience
Eligible Years: 2-5
Qualification: B.Tech, B.Sc
Link: https://techcorp.com/apply
Location: Bangalore
Last Date: 2026-02-28
```

### 2. Click "Post Job"

Expected:
✅ Success message shows
✅ Form clears
✅ Modal stays open

---

## 📋 Test Job Listing

### 1. Refresh Page

Press **F5** or close admin dashboard

Expected:
✅ Your job appears on the homepage as a card
✅ Shows Python Developer title
✅ Shows TechCorp company
✅ Shows Bangalore location
✅ Shows "2-5" years
✅ Last date shows "2026-02-28"

---

## 🔍 Test Search

### 1. Type in Search Box
- Type: "Python"
- Press Enter or click Search

Expected:
✅ Your "Python Developer" job shows up
✅ Only matching jobs display

### 2. Search by Company
- Clear search
- Type: "TechCorp"
- Press Enter

Expected:
✅ Your job shows up

### 3. Search by Description
- Clear search
- Type: "experienced"
- Press Enter

Expected:
✅ Your job shows up (matches description)

---

## 🎯 Test Filters

### 1. Test Experience Filter
- Select "2-5" from dropdown
- Search results update

Expected:
✅ Your job shows (it has 2-5 years)

### 2. Test Location Filter
- Select "Bangalore" from dropdown
- Search results update

Expected:
✅ Your job shows

### 3. Test Both Together
- Years: "2-5"
- Location: "Bangalore"
- Search box: empty

Expected:
✅ Your job shows

### 4. Reset Filters
- Click "Reset Filters" button

Expected:
✅ All filters clear
✅ All jobs show

---

## 📊 Test Tabs

### 1. Experience Level Tabs
At top of jobs list, you should see:
- **All Jobs** (currently selected)
- **2-5** (or your experience level)

### 2. Click Experience Tab
- Click "2-5" tab

Expected:
✅ Only jobs with that experience show
✅ Tab highlights blue

### 3. Click "All Jobs"
- Click "All Jobs" tab

Expected:
✅ All jobs show again

---

## 📌 Test Job Details

### 1. Click Job Card
- Click anywhere on the Python Developer card

Expected:
✅ Modal opens with full job details
✅ Shows all information
✅ Shows "Apply Now" button

### 2. Click "Apply Now" in Modal
- Click the button

Expected:
✅ New tab opens with application link
✅ Link points to https://techcorp.com/apply

### 3. Close Modal
- Click X button or outside modal

Expected:
✅ Modal closes
✅ Back to homepage

---

## 📊 Test Statistics

### 1. Login Again to Admin Panel
- Click "Admin Panel"
- (If logged out, login first)

Expected:
✅ Still logged in (session saved)

### 2. Go to Statistics Tab
- Click "Statistics"

Expected:
✅ See 3 stat cards:
   - Total Visits (should be > 0)
   - Unique Visitors (should be 1 or more)
   - Total Jobs Posted (should show 1)

---

## ✏️ Test Update Job

### 1. Go to "Manage Jobs" Tab
- Click "Manage Jobs"

Expected:
✅ Your "Python Developer" job appears
✅ Shows Edit and Delete buttons

### 2. Click Edit
- Click "Edit" button

Expected:
✅ Form fills with current job data
✅ Can modify fields

### 3. Update Description
- Change description to: "Expert Python developer wanted"
- Click "Post Job" (button text should say Update)

Expected:
✅ Success message
✅ Job description updated on homepage

---

## 🗑️ Test Delete Job

### 1. Go to "Manage Jobs" Tab
- Click "Manage Jobs"

### 2. Click Delete
- Click "Delete" button

Expected:
✅ Confirmation dialog appears
✅ "Are you sure?" message

### 3. Click OK
- Confirm deletion

Expected:
✅ Job removed from list
✅ Job disappears from homepage
✅ Success message shows

---

## 🔓 Test Logout

### 1. Click "Logout" Button
- In admin dashboard, click "Logout" tab

Expected:
✅ Dashboard closes
✅ "Admin Login" button reappears
✅ Logged out message shows

### 2. Try to Login Again
- Click "Admin Login"
- Enter credentials
- Login

Expected:
✅ Can login again successfully

---

## 📱 Test Responsive Design

### 1. Desktop (already tested)

### 2. Tablet View
- Press F12 (Developer Tools)
- Click device icon
- Select "iPad" or tablet
- Resize browser

Expected:
✅ Layout adjusts
✅ Still looks good
✅ Buttons work

### 3. Mobile View
- Select "iPhone" in device tools
- Resize to mobile

Expected:
✅ Stacks vertically
✅ Search bar full width
✅ Cards are single column
✅ All buttons work
✅ No horizontal scroll

---

## 🎨 Visual Verification

Check these visual elements:

- [ ] Header has gradient (blue to pink)
- [ ] Hero section has gradient background
- [ ] Buttons have hover effects
- [ ] Job cards have shadows
- [ ] Cards lift up on hover
- [ ] Colors are consistent
- [ ] Text is readable
- [ ] Spacing looks good
- [ ] Icons display correctly
- [ ] Modals are centered
- [ ] Forms look professional

---

## ⚡ Performance Check

Open Developer Tools (F12):

### 1. Check Console
- Should show NO red errors
- May show some blue info messages (ok)

### 2. Check Network Tab
- All requests should be ✅ (green 200s)
- No red ❌ errors

### 3. Check Response Time
- API calls should respond < 100ms
- Frontend should load < 1s

---

## 🐛 Common Issues

### Issue: Can't see job after posting
**Solution:**
- Refresh page (F5)
- Check browser console for errors (F12)
- Verify backend is still running

### Issue: Can't login
**Solution:**
- Check credentials: admin / admin123
- Verify backend is running on 8000
- Clear browser cache (Ctrl+Shift+Del)

### Issue: Search doesn't work
**Solution:**
- Type exact job name (case-insensitive)
- Try different search terms
- Check browser console for errors

### Issue: Job card won't click
**Solution:**
- Click on the text area (not buttons)
- Check no JavaScript errors (F12 console)
- Refresh page

### Issue: Statistics show 0
**Solution:**
- Refresh page a few times (counts as visits)
- Load job details (each view counts)
- Wait a moment and refresh stats

---

## ✅ Full Test Checklist

### Basic Functionality
- [ ] Backend running on 8000
- [ ] Frontend running on 8080
- [ ] Homepage loads
- [ ] Header displays correctly

### Admin Features
- [ ] Admin login works
- [ ] Admin dashboard opens
- [ ] Can post a job
- [ ] Job appears on homepage
- [ ] Can update job
- [ ] Can delete job
- [ ] Can see statistics
- [ ] Can logout

### User Features
- [ ] Can search jobs
- [ ] Can filter by experience
- [ ] Can filter by location
- [ ] Can click job details
- [ ] Can see full info
- [ ] Can apply (link works)
- [ ] Can view by tabs
- [ ] Reset filters works

### Design
- [ ] Looks professional
- [ ] Colors are nice
- [ ] Mobile responsive
- [ ] No layout issues
- [ ] Buttons have hover effects
- [ ] Modals work smoothly

### Performance
- [ ] No console errors
- [ ] API responses fast
- [ ] Page loads quickly
- [ ] No network errors

---

## 🎉 Success Indicators

When you see all of these, your job portal is working perfectly:

✅ Beautiful homepage with gradient
✅ Search bar functional
✅ Admin login works
✅ Jobs post successfully
✅ Jobs appear on homepage
✅ Search filters work
✅ Experience tabs work
✅ Location filter works
✅ Job details modal works
✅ Statistics update
✅ Update job works
✅ Delete job works
✅ Mobile responsive
✅ No console errors
✅ Logout works

---

## 🚀 Ready for Next Steps?

Once all tests pass:

1. **Create GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial job portal"
   git remote add origin https://github.com/Ajaysanepalle/job-portal.git
   git push -u origin main
   ```

2. **Deploy to Production**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Choose Railway, Render, or Heroku

3. **Connect Domain**
   - Connect manaworks.online
   - Set up SSL/HTTPS

4. **Share with Users**
   - Announce the platform
   - Start posting jobs

---

## 📞 Need Help?

If something doesn't work:

1. **Check Console** (F12) for errors
2. **Check Backend** is running
3. **Read Documentation** (README.md)
4. **Try Troubleshooting** above
5. **Create GitHub Issue**

---

**Your job portal is ready! Start testing now! 🎊**
