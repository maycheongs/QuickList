# User Stories

## Core Features

The user can:
- Create a list (packing list)
- Add items to the list
- Set an optional due date on the list for a reminder to trigger, notifying of unchecked items
- Duplicate lists without per-instance data ("users" will be just the active user, "checked", "assigned to", due date, reminders)
- Turn off reminder settings on a list (disable all notifications)
- Set items as "last minute"
- Give items a category by adding a new one or existing categories that have been added to other items in the list
- On a category, duplicate just that category and the items into a different or new list from a dropdown.


UI/UX for main panel
- Default: Uncategorized, unchecked items by Category (if any), then last minute, then checked, then add Item panel
- Toggle to include checked items in their respective category (last minute AND checked are treated as checked, not last minute)
- Checked items are crossed out and can be unchecked
- Categories have their own hue and category header

## Reminder Features
- Checked items automatically do not trigger notifications

Stretch:
- View settings per list and active list are persistent to the user
- Reminders can be optionally sent to assigned users or all co-authors
- Add optional co-authors to the list (by adding an email)
- Users can filter by items assigned to them if there is more than 1 co-author
- Reminders sent to mobile (either mobile app with push notifications, or sms with link to open web app)

