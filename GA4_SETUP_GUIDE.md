# Google Analytics 4 Setup Guide for A/B Testing

Complete step-by-step guide to set up Google Analytics 4 for tracking your
Fresha vs Contact Form A/B test.

## Overview

This guide will help you:

- Create custom dimensions to track A/B test variants
- Configure custom events for booking tracking
- Set up conversion goals
- Test your implementation
- Create reports to analyze results

---

## Prerequisites

Before starting, you need:

- Google Analytics 4 property created for your site
- GA4 Measurement ID: `G-8VBMYR59N3` (already configured in your code)
- Access to Google Analytics dashboard with admin permissions
- Your website live or accessible for testing

---

## Part 1: Create Custom Dimensions

Custom dimensions allow you to track custom data about users and events (like
which A/B variant they're in).

### Step 1.1: Navigate to Custom Definitions

1. Go to [Google Analytics](https://analytics.google.com)
2. Select your property (Heavenly Treatments)
3. Click **Admin** (gear icon at bottom left)
4. In the **Data collection and modification** column on the left, click
   **Custom definitions**

### Step 1.2: Create First Custom Dimension (`ab_test_variant`)

1. Click **Create custom dimension** button (top right)
2. Fill in the form:
   - **Dimension name**: `ab_test_variant`
   - **Description**: Which A/B test variant the user is in (fresha or form)
   - **Scope**: Event
   - **Event parameter / User property name**: `ab_test_variant`
3. Click **Save**

### Step 1.3: Create Second Custom Dimension (`ab_test_cohort`)

1. Click **Create custom dimension** button again
2. Fill in the form:
   - **Dimension name**: `ab_test_cohort`
   - **Description**: User cohort assignment for A/B test tracking
   - **Scope**: Event
   - **Event parameter / User property name**: `ab_test_cohort`
3. Click **Save**

### Step 1.4: Create Third Custom Dimension (`booking_context`)

1. Click **Create custom dimension** button again
2. Fill in the form:
   - **Dimension name**: `booking_context`
   - **Description**: Where booking button was clicked (navbar, card, detail,
     location)
   - **Scope**: Event
   - **Event parameter / User property name**: `booking_context`
3. Click **Save**

**Result**: You should now see three custom dimensions listed. They will be
available in reports after 24 hours.

---

## Part 2: Create Conversion Events

Conversion events track important user actions (like booking redirects or form submissions).

### Step 2.1: Navigate to Conversions

1. In **Admin** panel, go to **Data collection and modification** section
2. Click **Events**
3. Look for custom events already being sent from your code:
   - `ab_test_variant_assigned`
   - `booking_button_clicked`
   - `booking_redirect`
   - `booking_form_submitted`

These events should already appear in the list if your code is running.

### Step 2.2: Mark Events as Conversions

Convert the important events into trackable goals:

**For Fresha Redirects:**

1. In the **Events** section, find `booking_redirect`
2. Click the event
3. Toggle **Mark as conversion** to ON
4. Save

**For Form Submissions:**

1. In the **Events** section, find `booking_form_submitted`
2. Click the event
3. Toggle **Mark as conversion** to ON
4. Save

**For Button Clicks (optional):**

1. In the **Events** section, find `booking_button_clicked`
2. Click the event
3. Toggle **Mark as conversion** to ON
4. Save

---

## Part 3: Test Your Implementation

### Step 3.1: Use DebugView to Monitor Events

DebugView shows real-time events being sent to GA4:

1. In Google Analytics, go to **Admin**
2. In the **Data collection and modification** column, click **DebugView**
3. You should see a list of users and their events
4. Open your website in a new tab
5. Click a "Book Now" button
6. Return to DebugView - you should see your event appear within seconds

### Step 3.2: Check Event Details

When you see an event in DebugView:

1. Click on the event to expand details
2. Look for these parameters:
   - `ab_test_variant`: Should show "fresha" or "form"
   - `ab_test_cohort`: Should show "test" or "control"
   - `booking_context`: Should show where button was clicked (navbar, treatment-card, etc.)

### Step 3.3: Verify Events Are Being Sent

In your browser console:

1. Open your site: `http://localhost:3000` or your production site
2. Press `F12` to open Developer Tools
3. Go to **Console** tab
4. Click a "Book Now" button
5. Check the console for any errors
6. Network tab should show requests to `www.google-analytics.com`

---

## Part 4: Create Reports

### Step 4.1: Create a Comparison Report

Compare conversion rates between Fresha and Form variants:

1. Go to **Reports** (left sidebar)
2. Click **Exploration** or **Create new report**
3. Click **+ Blank Exploration**
4. Set up the report:
   - **Tab name**: "A/B Test Comparison"
   - **Visualize**: Table
   - **Dimensions** (Rows): Add `ab_test_variant` (custom dimension)
   - **Metrics** (Values): Add:
     - Event count
     - Users
     - Conversion rate
   - **Filters**: Optional - filter by date range or segment

5. Click **Run Report**

This will show:

- How many users got Fresha variant vs Form variant
- Conversion rates for each
- Total event counts

### Step 4.2: Create Context Breakdown Report

See which locations have highest conversion:

1. Click **Exploration** again
2. **Dimensions**: `booking_context` and `ab_test_variant`
3. **Metrics**: Event count, Conversion rate
4. This shows performance by button location

---

## Part 5: Monitor Results Over Time

### Step 5.1: Check Realtime Dashboard

See events happening in real-time:

1. Go to **Reports** → **Realtime**
2. Watch as users visit your site and click buttons
3. See which events are firing

### Step 5.2: Daily Monitoring

After deployment:

1. Check **Analytics** → **Overview** daily for first week
2. Look for:
   - Event count increasing
   - Conversion events showing up
   - No errors in DebugView

### Step 5.3: Weekly Reports

Create a weekly comparison:

1. Go to your A/B Test Comparison report (Step 4.1)
2. Set date range to current week
3. Export as PDF or screenshot
4. Compare against previous week

---

## Part 6: Analyze Results

### What to Look For

After 1-2 weeks of data:

1. **Variant Distribution**
   - Should be approximately 50/50 split between Fresha and Form
   - If not, check your `variantAssignment.ts` code

2. **Conversion Rates**
   - Compare `booking_redirect` conversion rate for each variant
   - Which converts better: Fresha or Form?
   - Statistical significance: need ~100+ conversions per variant for reliable results

3. **User Flow**
   - Where are users clicking most? (navbar, cards, detail, location?)
   - Which context has highest conversion rate?

4. **Drop-off Points**
   - If conversion rates are low, check:
     - Are users clicking buttons? (check `booking_button_clicked` events)
     - Are users being redirected? (check `booking_redirect` events)
     - Is form being submitted? (check `booking_form_submitted` events)

---

## Part 7: Troubleshooting

### Events Not Appearing

**Problem**: Events not showing in DebugView or reports

**Solutions**:

1. Verify Measurement ID is correct: `G-8VBMYR59N3`
2. Check that GA4 script is loaded:
   - Open DevTools → Network tab
   - Look for `gtag/js` script loading
   - Should see successful requests to `google-analytics.com`

3. Verify custom code is running:
   - Open DevTools → Console
   - Type: `window.gtag` should show function exists
   - Click button and check for errors in console

4. Wait 24-48 hours:
   - GA4 takes time to process and display custom dimensions
   - Initial data may not appear for a few hours

### Custom Dimensions Not Showing

**Problem**: Custom dimensions created but not appearing in reports

**Solutions**:

1. Check that events include the dimension parameters
2. Wait 24 hours after creating dimensions
3. Verify parameter names match exactly:
   - Code sends: `ab_test_variant`
   - GA4 expects: `ab_test_variant`

### Low Event Count

**Problem**: Very few events being recorded

**Solutions**:

1. Check that site is live and users are visiting
2. Verify BookingButton component is being rendered
3. Check browser console for JavaScript errors
4. Confirm GA4 property is active (not paused)

---

## Checklist

Complete these items in order:

- [ ] Create 3 custom dimensions in GA4
- [ ] Mark conversion events (booking_redirect, booking_form_submitted)
- [ ] Test using DebugView - click button and see event appear
- [ ] Verify parameters appear in DebugView event details
- [ ] Deploy code to production
- [ ] Monitor Realtime dashboard for first 24 hours
- [ ] Wait 48 hours for GA4 to process
- [ ] Create A/B Test Comparison report
- [ ] Run report and verify 50/50 split between variants
- [ ] Compare conversion rates after 1-2 weeks of data
- [ ] Make decision based on results

---

## Custom Dimensions Summary

| Dimension Name | Purpose | Expected Values |
|---|---|---|
| `ab_test_variant` | Which variant user is assigned | `fresha` or `form` |
| `ab_test_cohort` | Cohort assignment | `test` or `control` |
| `booking_context` | Where button was clicked | `navbar`, `treatment-card`, `treatment-detail`, `location-section` |

---

## Events Summary

| Event Name | Purpose | Fires When |
|---|---|---|
| `ab_test_variant_assigned` | User assigned to variant | User first visits and gets variant assigned (cookie created) |
| `booking_button_clicked` | User clicks booking button | Any "Book Now" button clicked |
| `booking_redirect` | User redirected to booking | User redirected to Fresha or contact form |
| `booking_form_submitted` | Contact form submitted | User successfully submits contact form |

---

## Additional Resources

- [Google Analytics 4 Documentation](https://support.google.com/analytics)
- [GA4 Custom Dimensions Guide](https://support.google.com/analytics/answer/10075209)
- [GA4 Events Guide](https://support.google.com/analytics/answer/9322688)
- [GA4 Conversion Tracking](https://support.google.com/analytics/answer/9267568)

---

## Support

If you encounter issues:

1. Check troubleshooting section above
2. Verify all 3 custom dimensions are created
3. Check DebugView for event details
4. Wait 24-48 hours for GA4 to process
5. Contact Google Analytics support if still having issues

---

**Last Updated**: November 2025
**For**: Heavenly Treatments A/B Test
**Measurement ID**: G-8VBMYR59N3
