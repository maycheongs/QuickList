# User Stories

## Core Features

The user can:
(Single User App)

- Create a (Packing) list
- Add items to the list, in quick succession
- Set an optional due date on the list 
- Turn off reminder settings on a list (disable all notifications)
- Set items as "last minute"
- Give items a category by adding a new one or existing categories that have been added to other items in the list
- Duplicate lists without per-instance data ("users" will be just the active user, while all item props will be reset to default)
- Come back to the last selected list on reload/refresh

UI/UX for main panel
- Default: Uncategorized, unchecked items by Category (if any), then last minute, then checked, then add Item panel
- Collapsible category sections
- Checked items are crossed out and can be unchecked
- Categories have their own hue and category header

Stretch:
(Multi-user Co-op App)
- Log in/out
- Stay logged in on a device
- Assign items to a user
- Reminder triggers to email and/or mobile to list user or assigned users with unchecked items
- Drag and drop between categories
- View-settings per list are persistent to the user (1. Collapsed sections 2.List order 3. Items order )
- Reminders can be sent to assigned users or all co-authors (for items not assigned)
- Add optional co-authors to the list (by sending an email invitation)
- Users can filter by items assigned to them if there is more than 1 co-author
- Reminders sent to mobile (either mobile app with push notifications, or sms with link to open web app)
- On a category, duplicate just that category and the items into a different or new list from a dropdown.