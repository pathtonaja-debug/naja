# NAJA QA Checklist

## Pre-Launch Quality Assurance

### ✅ Authentication & Security

- [ ] **Sign Up Flow**
  - [ ] Email validation works correctly
  - [ ] Password requirements enforced (min 6 chars)
  - [ ] Display name captured and saved
  - [ ] Profile auto-created on signup
  - [ ] User role assigned correctly
  - [ ] Companion profile initialized
  - [ ] Success message shown
  - [ ] Auto-redirect to dashboard

- [ ] **Sign In Flow**
  - [ ] Correct credentials allow access
  - [ ] Wrong password shows error
  - [ ] Non-existent email shows appropriate error
  - [ ] Session persists after page refresh
  - [ ] Auto-redirect if already logged in

- [ ] **Sign Out**
  - [ ] Sign out button works
  - [ ] Session cleared completely
  - [ ] Redirects to auth page
  - [ ] Protected routes inaccessible after signout

- [ ] **RLS Policies**
  - [ ] Users can only see their own data
  - [ ] Users cannot access other users' data
  - [ ] Admin roles work correctly (if applicable)
  - [ ] All tables have proper RLS policies enabled

### ✅ Dashboard

- [ ] **Prayer Times**
  - [ ] Current day prayer times display correctly
  - [ ] Next prayer calculation accurate
  - [ ] Countdown timer updates in real-time
  - [ ] All 5 prayers shown (Fajr, Dhuhr, Asr, Maghrib, Isha)
  - [ ] Times match user's timezone/location
  - [ ] Loading state shown during fetch
  - [ ] Error handling for failed API calls

- [ ] **Dhikr Counter**
  - [ ] Tap increments counter
  - [ ] Reset button works
  - [ ] Count persists when navigating away
  - [ ] Session saved to database
  - [ ] Visual feedback on tap

- [ ] **Navigation**
  - [ ] All bottom nav tabs work
  - [ ] Active tab highlighted
  - [ ] Smooth transitions between tabs

### ✅ Reflection Journal

- [ ] **Create Reflection**
  - [ ] Text input works
  - [ ] Date captured automatically
  - [ ] Save button functional
  - [ ] Success feedback shown
  - [ ] Reflection appears in list immediately

- [ ] **View Reflections**
  - [ ] All user's reflections displayed
  - [ ] Sorted by date (newest first)
  - [ ] Proper formatting
  - [ ] Empty state shown when no reflections

- [ ] **Edit/Delete**
  - [ ] Edit functionality works
  - [ ] Delete removes reflection
  - [ ] Confirmation before delete (if implemented)

### ✅ Habits

- [ ] **View Habits**
  - [ ] All active habits displayed
  - [ ] Completion status accurate
  - [ ] Streak count correct
  - [ ] Progress summary shows correct counts

- [ ] **Toggle Habit**
  - [ ] Checkbox/toggle works
  - [ ] Completion saves to database
  - [ ] Streak updates appropriately
  - [ ] Visual feedback immediate
  - [ ] Habit log created for today

- [ ] **Create Habit** (if implemented)
  - [ ] Form validation works
  - [ ] New habit appears in list
  - [ ] Initial streak = 0

### ✅ Dua Builder

- [ ] **Stepper Flow**
  - [ ] All 6 steps accessible
  - [ ] Next/Back buttons work
  - [ ] Progress indicator accurate
  - [ ] Can't skip required steps

- [ ] **Content Input**
  - [ ] Text input works in each step
  - [ ] Content persists when moving between steps
  - [ ] Character limits enforced (if any)

- [ ] **Save Dua**
  - [ ] Finish button saves dua
  - [ ] Title and category captured
  - [ ] Dua appears in library
  - [ ] Success message shown

- [ ] **Dua Library**
  - [ ] All saved duas displayed
  - [ ] Categorization works
  - [ ] Search functionality (if implemented)

### ✅ AI Companion

- [ ] **Chat Interface**
  - [ ] Modal opens correctly
  - [ ] Close button works
  - [ ] Input field functional
  - [ ] Enter key sends message
  - [ ] Shift+Enter creates new line

- [ ] **AI Responses**
  - [ ] Streaming works (tokens appear gradually)
  - [ ] Responses are faith-aligned
  - [ ] No religious rulings issued
  - [ ] Context-aware based on user history
  - [ ] Error handling for rate limits (429)
  - [ ] Error handling for credits (402)

- [ ] **Companion Profile**
  - [ ] Personalization settings applied
  - [ ] Name displays correctly
  - [ ] Voice tone affects responses
  - [ ] Behavior settings honored

### ✅ Profile & Settings

- [ ] **Display Settings**
  - [ ] Display name editable
  - [ ] Changes save correctly
  - [ ] Updates reflected immediately

- [ ] **Prayer Settings**
  - [ ] Prayer method selection works
  - [ ] Timezone editable
  - [ ] Location coordinates saveable
  - [ ] Changes affect prayer times

- [ ] **Preferences**
  - [ ] Language selection works (if implemented)
  - [ ] Hijri calendar toggle works
  - [ ] Notifications toggle saves

### ✅ Edge Functions

- [ ] **prayer-times**
  - [ ] Returns correct data format
  - [ ] Caching works (subsequent calls faster)
  - [ ] Different locations return different times
  - [ ] Error handling for invalid inputs

- [ ] **ai-chat**
  - [ ] Requires authentication
  - [ ] Streaming works correctly
  - [ ] Rate limiting handled
  - [ ] Credit exhaustion handled
  - [ ] Personalization based on companion profile

- [ ] **weekly-summary**
  - [ ] Returns stats for last 7 days
  - [ ] AI summary generated
  - [ ] Accurate calculation of completions
  - [ ] Handles users with no data

### ✅ Performance

- [ ] **Load Times**
  - [ ] Dashboard loads < 2 seconds
  - [ ] Prayer times cache improves performance
  - [ ] AI responses stream smoothly
  - [ ] No blocking operations

- [ ] **Optimization**
  - [ ] Images optimized
  - [ ] Lazy loading where appropriate
  - [ ] Database queries indexed
  - [ ] No unnecessary re-renders

### ✅ Responsiveness

- [ ] **Mobile (375px)**
  - [ ] All pages render correctly
  - [ ] Bottom nav accessible
  - [ ] Text readable
  - [ ] Buttons easily tappable
  - [ ] No horizontal scroll

- [ ] **Tablet (768px)**
  - [ ] Layout adapts appropriately
  - [ ] Content well-spaced
  - [ ] Images scale correctly

- [ ] **Desktop (1920px)**
  - [ ] Max-width containers prevent stretching
  - [ ] Content centered
  - [ ] Spacing appropriate

### ✅ Accessibility

- [ ] **Keyboard Navigation**
  - [ ] Tab order logical
  - [ ] All interactive elements focusable
  - [ ] Focus visible
  - [ ] Enter/Space activate buttons

- [ ] **Screen Readers**
  - [ ] ARIA labels present
  - [ ] Semantic HTML used
  - [ ] Error messages announced
  - [ ] Loading states announced

- [ ] **Contrast**
  - [ ] Text meets WCAG AA standard
  - [ ] Interactive elements distinguishable
  - [ ] Error states clearly visible

### ✅ Internationalization

- [ ] **Language Switching**
  - [ ] Language selector works
  - [ ] All text translated
  - [ ] RTL layout for Arabic
  - [ ] Date formatting respects locale

- [ ] **Hijri Calendar**
  - [ ] Toggle works
  - [ ] Dates convert accurately
  - [ ] Formatting correct

### ✅ Error Handling

- [ ] **Network Errors**
  - [ ] Offline state handled gracefully
  - [ ] Failed requests show error message
  - [ ] Retry mechanism available

- [ ] **Form Validation**
  - [ ] Required fields enforced
  - [ ] Format validation (email, etc.)
  - [ ] Clear error messages
  - [ ] Errors clear on correction

- [ ] **API Errors**
  - [ ] 4xx errors handled
  - [ ] 5xx errors handled
  - [ ] Timeout errors handled
  - [ ] User-friendly messages shown

### ✅ Cross-Browser Testing

- [ ] **Chrome**
  - [ ] All features work
  - [ ] Styling correct
  - [ ] No console errors

- [ ] **Firefox**
  - [ ] All features work
  - [ ] Styling correct
  - [ ] No console errors

- [ ] **Safari**
  - [ ] All features work
  - [ ] Styling correct
  - [ ] No console errors
  - [ ] iOS Safari tested

- [ ] **Edge**
  - [ ] All features work
  - [ ] Styling correct
  - [ ] No console errors

### ✅ Data Integrity

- [ ] **CRUD Operations**
  - [ ] Create operations save correctly
  - [ ] Read operations fetch correct data
  - [ ] Update operations modify correctly
  - [ ] Delete operations remove correctly
  - [ ] No orphaned records

- [ ] **Relationships**
  - [ ] Foreign keys enforced
  - [ ] Cascade deletes work
  - [ ] Referential integrity maintained

### ✅ Security Audit

- [ ] **Secrets**
  - [ ] No secrets in client code
  - [ ] API keys in environment variables
  - [ ] LOVABLE_API_KEY not exposed

- [ ] **Injection**
  - [ ] No SQL injection vulnerabilities
  - [ ] XSS protection in place
  - [ ] Input sanitization

- [ ] **Authentication**
  - [ ] JWT validation working
  - [ ] Session hijacking protected
  - [ ] Password storage secure (handled by Supabase)

### ✅ Documentation

- [ ] **README**
  - [ ] Installation instructions clear
  - [ ] All features documented
  - [ ] Examples provided
  - [ ] Troubleshooting section complete

- [ ] **CHANGELOG**
  - [ ] All changes documented
  - [ ] Version numbered
  - [ ] Breaking changes highlighted

- [ ] **Code Comments**
  - [ ] Complex logic explained
  - [ ] Edge cases documented
  - [ ] TODOs marked clearly

### ✅ Testing

- [ ] **Unit Tests**
  - [ ] All services have tests
  - [ ] Utilities have tests
  - [ ] Tests pass
  - [ ] Coverage > 70%

- [ ] **E2E Tests**
  - [ ] Critical paths tested
  - [ ] All user flows covered
  - [ ] Tests pass consistently
  - [ ] Flaky tests fixed

- [ ] **CI/CD**
  - [ ] Tests run on PR
  - [ ] Builds successful
  - [ ] Linting passes
  - [ ] Type checking passes

### ✅ Production Readiness

- [ ] **Environment**
  - [ ] Production environment variables set
  - [ ] Auto-confirm email disabled for production
  - [ ] CORS configured correctly
  - [ ] Rate limiting in place

- [ ] **Monitoring**
  - [ ] Error tracking set up (if applicable)
  - [ ] Analytics configured
  - [ ] Logs accessible

- [ ] **Backup**
  - [ ] Database backup strategy in place
  - [ ] Regular backups scheduled (via Supabase)

- [ ] **Scalability**
  - [ ] Database queries optimized
  - [ ] Caching strategy implemented
  - [ ] API rate limits considered

---

## Sign-Off

- [ ] **Development Team**: All features implemented and tested
- [ ] **QA Team**: All tests passed
- [ ] **Product Owner**: All requirements met
- [ ] **Security Review**: No critical vulnerabilities
- [ ] **Performance Review**: Meets performance benchmarks
- [ ] **Accessibility Review**: WCAG AA compliant

## Launch Approval

**Ready for Production**: [ ] Yes [ ] No

**Approved By**: ___________________

**Date**: ___________________

**Notes**: 
```
[Add any notes about known issues, workarounds, or post-launch tasks]
```