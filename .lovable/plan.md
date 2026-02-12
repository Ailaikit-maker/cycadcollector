

# Plan: Permit Assistance, Blurred Background, and Green/Orange Theme

## Overview

Three changes are being made:

1. **Implement the "Request Permit Assistance" feature** (it was previously planned but never built)
2. **Add the uploaded cycad image as a blurred background** across the app
3. **Update the color theme** to a more vibrant green and orange palette

---

## 1. Request Permit Assistance

Since no email-sending service is currently configured, the feature will be implemented using a backend function with Resend for email delivery. A Resend API key will be required before this can work.

**What gets built:**

- **Backend function** (`request-permit-assistance`) that sends an email to `permits@investmentgardens.co.za` containing the user's name, email, and the cycad's genus/species
- **"Request Assistance" button** appears in three places:
  - In the **Add Cycad form** when permit is set to "No"
  - In the **Edit Cycad dialog** when permit is set to "No"
  - In the **Collection Summary table** next to each row where permit is "No"
- **User feedback**: A success/error toast is shown after the request

**Prerequisite:** You will be prompted to enter a Resend API key so emails can be sent.

---

## 2. Blurred Background Image

The uploaded cycad photo will be saved as a project asset and used as a fixed, blurred background behind the entire app. The content will remain readable with a semi-transparent overlay.

- Save the uploaded image to `src/assets/bg-cycad.jpeg`
- Add a fixed full-screen background element in `Index.tsx` (and optionally `Auth.tsx`) with CSS blur and a color overlay
- Content sits on top and remains fully readable

---

## 3. Green and Orange Theme

Update the CSS custom properties in `src/index.css` to use a more vibrant green and orange palette:

- **Primary color**: Richer, deeper green (forest green tones)
- **Accent color**: Warm orange (amber/burnt orange tones)
- **Buttons, links, badges**: Will automatically pick up the new colors
- **Cards and backgrounds**: Slightly adjusted to complement the new palette
- Dark mode variables will also be updated accordingly

---

## Technical Details

### New Files
- `supabase/functions/request-permit-assistance/index.ts` -- Edge function using Resend SDK to send emails
- `src/assets/bg-cycad.jpeg` -- Uploaded background image

### Modified Files
- `src/index.css` -- Updated CSS custom properties for green/orange theme
- `src/pages/Index.tsx` -- Add blurred background element; pass `collector` prop to `AddCycadForm` and `CycadCard`
- `src/pages/Auth.tsx` -- Add blurred background element
- `src/components/AddCycadForm.tsx` -- Accept `collector` prop; show "Request Permit Assistance" button when permit is "No"
- `src/components/EditCycadDialog.tsx` -- Show "Request Permit Assistance" button when permit is "No"; accept collector info
- `src/components/CycadCard.tsx` -- Accept `collector` prop; show "Request Assistance" button when permit is "No"
- `src/components/CollectionSummary.tsx` -- Add "Request Assistance" button/link in each table row where permit is "No"; accept `collector` prop

### Secret Required
- `RESEND_API_KEY` -- Needed by the backend function to send emails via Resend

