

# Add "Request Permit Assistance" Feature

## What will happen
When a user selects "No" for the permit status (either when adding a new cycad or editing an existing one), a "Request Permit Assistance" button will appear. Clicking it sends an email to **permits@investmentgardens.co.za** with the user's name, surname, and email address, along with details about the cycad they need help with.

## How it works

1. **Backend function** -- A new backend function (`request-permit-assistance`) will be created to send the email using Resend. This keeps the email-sending logic secure and server-side.

2. **UI changes in three places:**
   - **AddCycadForm** -- When permit is set to "No", show a "Request Permit Assistance" button below the permit selector.
   - **EditCycadDialog** -- Same behavior when permit is changed to "No".
   - **CycadCard** -- Show a small "Request Assistance" link on cards where permit is "No".

3. **Email content** -- The email sent to `permits@investmentgardens.co.za` will include:
   - User's first name and last name
   - User's email address
   - The cycad genus and species they need a permit for

4. **User feedback** -- A success toast will confirm the request was sent, or an error toast if something goes wrong.

## Prerequisites

A **Resend API key** is required to send emails. You will need to:
1. Sign up at [resend.com](https://resend.com) if you don't have an account
2. Verify your sending domain at [resend.com/domains](https://resend.com/domains) (so emails come from your domain, not a generic one)
3. Create an API key at [resend.com/api-keys](https://resend.com/api-keys)
4. Provide the API key when prompted so it can be securely stored

---

## Technical Details

### 1. Edge Function: `supabase/functions/request-permit-assistance/index.ts`
- Accepts POST with JSON body: `{ firstName, lastName, email, genus, species }`
- Uses Resend SDK to send an email to `permits@investmentgardens.co.za`
- Includes CORS headers for browser access
- Validates required fields before sending

### 2. UI Components Modified
- **`src/components/AddCycadForm.tsx`** -- Add a conditional "Request Permit Assistance" button that appears when `permit === "No"`. On click, it calls the edge function with the collector's details and the current genus/species.
- **`src/components/EditCycadDialog.tsx`** -- Same conditional button in the edit dialog.
- **`src/components/CycadCard.tsx`** -- Add a small "Request Assistance" button on cards where `item.permit === "No"`.

### 3. Data Flow
- The collector's name and email are passed from `Index.tsx` down to `AddCycadForm` and `CycadCard` (they already have access to genus/species).
- The edge function composes and sends the email, then returns success/failure.

### 4. Props Changes
- `AddCycadForm` will receive an additional `collector` prop to access the user's name and email.
- `CycadCard` will receive an additional `collector` prop for the same reason.

