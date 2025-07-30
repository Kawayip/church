# Ministry Modal Fix Plan

## Problem Analysis

### Root Cause Identified
The ministry forms in the dashboard grey out and close immediately when clicked because of an event propagation issue in the `MinistryModal.tsx` component.

**Specific Issue:**
- Line 173-174 in `MinistryModal.tsx`: The overlay has `onClick={handleClose}` which closes the modal when the background is clicked
- Line 182: The modal content doesn't prevent event propagation
- When clicking inside the modal form, the click event bubbles up to the overlay, triggering `handleClose`

### Comparison with Working PostModal
The `PostModal.tsx` works correctly because:
- It doesn't have an `onClick` handler on the overlay (line 226)
- It uses a different modal structure that doesn't cause event propagation issues

## Solution Plan

### Fix Required in MinistryModal.tsx

**Location:** `src/components/MinistryModal.tsx` around line 182

**Current Code:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
  className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
>
```

**Fixed Code:**
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95, y: 20 }}
  animate={{ opacity: 1, scale: 1, y: 0 }}
  exit={{ opacity: 0, scale: 0.95, y: 20 }}
  className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full"
  onClick={(e) => e.stopPropagation()}
>
```

### Alternative Solution (More Robust)
Update the overlay click handler to only close when clicking the overlay itself:

**Current Code (Line 173-174):**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
  onClick={handleClose}
/>
```

**Fixed Code:**
```tsx
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
  onClick={(e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }}
/>
```

## Implementation Steps

1. **Fix the event propagation issue** by adding `onClick={(e) => e.stopPropagation()}` to the modal content div
2. **Test the modal functionality** to ensure it opens and stays open when clicked inside
3. **Verify form submission** works correctly
4. **Check PostModal** to ensure it doesn't have similar issues (it appears to be working correctly)

## Expected Outcome

After implementing the fix:
- Clicking "Edit" or "Create Ministry" will open the modal
- The modal will stay open when clicking inside the form
- The modal will only close when:
  - Clicking the X button
  - Clicking outside the modal (on the overlay)
  - Submitting the form successfully
  - Pressing the Cancel button

## Files to Modify

1. `src/components/MinistryModal.tsx` - Add event propagation prevention