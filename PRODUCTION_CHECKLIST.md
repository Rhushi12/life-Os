# Production Readiness Checklist for LifeOS

This document outlines the tasks required to make LifeOS production-ready for beta testing with real users.

## 1. Critical Functionality & Stability
- [ ] **Firebase Domain Whitelisting**: Ensure `liifeos.online` and `www.liifeos.online` are added to Firebase Console > Authentication > Settings > Authorized Domains.
- [ ] **Error Boundaries**: Implement global error boundaries to catch crashes and show a friendly "Something went wrong" UI instead of a white screen.
- [ ] **Loading States**: Audit all async actions (login, plan generation, saving) to ensure they have visible loading indicators (spinners/skeletons) so users know something is happening.
- [ ] **Empty States**: Ensure all lists (Dashboard goals, Planner tasks) have helpful "empty states" guiding users on what to do next if they have no data.
- [ ] **Mobile Responsiveness Audit**:
    - [ ] Check Navigation bar on mobile (hamburger menu working?).
    - [ ] Check Goal Creation form on small screens.
    - [ ] Check Dashboard charts/grids on mobile.
- [ ] **404 Page**: Create a custom 404 Not Found page for invalid URLs.

## 2. Security & Data Integrity
- [ ] **Firestore Security Rules**: Update Firestore rules to ensure users can ONLY read/write their own data. (Currently, rules might be in "Test Mode" allowing public access).
- [ ] **API Key Restrictions**: In Google Cloud Console, restrict the API keys to only allow requests from `liifeos.online` and `localhost`.
- [ ] **Input Validation**: Ensure goal titles and descriptions have character limits to prevent UI breaking or abuse.

## 3. User Experience (UX) Polish
- [ ] **Favicon & Metadata**: Update `index.html` with a proper title, description, and favicon (currently likely the default Vite logo).
- [ ] **Open Graph Tags**: Add social preview tags (og:image, og:title) so links look good when shared on Twitter/WhatsApp/LinkedIn.
- [ ] **Toast Notifications**: Add success/error toasts for actions like "Plan Saved", "Goal Deleted", "Settings Updated".
- [ ] **Onboarding Flow**: Verify the onboarding modal appears for new users and successfully saves their preferences.

## 4. Analytics & Feedback
- [ ] **Analytics**: Integrate a privacy-friendly analytics tool (like PostHog or Google Analytics) to track:
    - Sign-ups
    - Goals Created
    - Plans Activated
- [ ] **Feedback Mechanism**: Ensure the "Feedback" button in the app actually sends data somewhere (e.g., to a Firestore collection or email) so beta testers can report bugs.

## 5. Performance
- [ ] **Image Optimization**: Ensure any static images are optimized/compressed.
- [ ] **Code Splitting**: Verify Vite is chunking the build correctly (usually automatic, but good to check build output size).

## 6. Legal (Optional but Recommended)
- [ ] **Privacy Policy / Terms**: Add a simple footer link to a Privacy Policy (even a generic one) since you are using Google Auth.

---

## Recommended "Next Immediate Steps" for Beta
1.  **Fix Firebase Domains**: This is the blocker for mobile users.
2.  **Firestore Rules**: Critical to prevent users from seeing each other's data.
3.  **Favicon/Title**: Low effort, high impact for "professionalism".
4.  **Feedback Form**: Essential for gathering beta tester input.
