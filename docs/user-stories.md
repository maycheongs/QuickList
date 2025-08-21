# User Stories

## Core Features

The user can:
- Create a list (packing list)
- Add items to the list
- Set an optional due date on the list for a reminder to trigger, notifying of unchecked items
- Duplicate lists without per-instance data (co-authors, "checked", "assigned to", due date, reminders)
- Turn off reminder settings on a list (disable all notifications)
- Set items as "last minute"
- Give items a category by adding a new one or existing categories that have been added to other items in the list
- Utilize sort/filter functions (e.g., view all items without the "last minute" items, by category)
- View "last minute" items as a separate list next to the rest of the items (UI only; still part of the same List)
- Check or uncheck items
- All "checked" items are listed at the bottom (like a regular checklist) and can be unchecked. 

Stretch:
- View settings per list are persistent to the user
- Reminders can be optionally sent to assigned users or all co-authors
- Add optional co-authors to the list (by adding an email)
- Set optional reminder date/time on individual items if it is a task list
- Set recurring tasks (task resets / and reminds on a schedule)
- View all recurring tasks and their statuses (like subscriptions)
- Reminders are grouped by reminder time for each user (avoid multiple notifications for items with the same time)

## Reminder Features
- Checked items automatically do not trigger notifications
