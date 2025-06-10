
# RizzPay Stable UI & Content Restoration Guide

## Quick Restoration Steps

When the app crashes after major backend updates, follow these steps:

### 1. Restore Core Routing (CRITICAL - Do this first)
```bash
cp rp-stable-backup/routing/App.tsx src/App.tsx
```

### 2. Restore Essential Components
```bash
cp -r rp-stable-backup/components/* src/components/
```

### 3. Restore All Pages
```bash
cp -r rp-stable-backup/pages/* src/pages/
```

### 4. Restore Utilities
```bash
cp -r rp-stable-backup/utils/* src/utils/
```

### 5. Restore Styles & Assets
```bash
cp -r rp-stable-backup/styles/* src/
```

## Verification Checklist

After restoration, verify these features work:

- [ ] Landing page loads correctly
- [ ] Authentication flow works
- [ ] Dashboard shows analytics and QR generator
- [ ] Admin escrow page with all tabs
- [ ] Navigation sidebar works
- [ ] All protected routes function
- [ ] UPI payment links generate
- [ ] Settings pages accessible

## Common Issues After Backend Updates

### Issue: "Failed to resolve import" errors
**Solution**: Check if all imported files exist in backup and restore missing ones

### Issue: App shows blank screen
**Solution**: Restore App.tsx first, then components, then pages

### Issue: Authentication not working
**Solution**: Restore auth-related stores and components from backup

### Issue: Admin routes not accessible
**Solution**: Restore AdminLayout and admin page components

## Critical Files to Always Backup

1. `src/App.tsx` - Main routing
2. `src/components/Layout.tsx` - Main layout wrapper
3. `src/components/dashboard/DashboardSidebar.tsx` - Navigation
4. `src/pages/Dashboard.tsx` - Main dashboard
5. `src/pages/AdminEscrow.tsx` - Admin escrow management
6. `src/stores/merchantAuthStore.ts` - Authentication state
7. `src/utils/` - All utility functions

## Emergency Recovery Command

If everything is broken, run this to restore all stable content:
```bash
cp -r rp-stable-backup/routing/* src/
cp -r rp-stable-backup/components/* src/components/
cp -r rp-stable-backup/pages/* src/pages/
cp -r rp-stable-backup/utils/* src/utils/
cp -r rp-stable-backup/styles/* src/
```

## Notes

- Always backup before major backend changes
- Update this backup after successful UI improvements
- Keep this file updated with new critical components
