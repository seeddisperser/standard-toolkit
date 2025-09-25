---
"@accelint/design-toolkit": minor
---

This release introduces a complete Notice component that provides developers with a comprehensive solution for displaying notifications, alerts, and messages to users within their applications.

The new Notice component includes two primary components: the individual Notice component for displaying single notifications, and the Notice.List component for managing and displaying multiple notifications in a queue-based system.

The Notice component supports five color variants to convey different types of messages: info for general information, advisory for helpful tips, normal for standard messages, critical for urgent issues, and serious for severe warnings. Each notice can be display a message along with optional action buttons (primary, secondary) that can be customized with different colors and variants to match the application's design system.

The Notice.List component provides queue management functionality that allows developers to programmatically add and remove notices from the display. Notices can be automatically removed after a specified timeout period, or they can be manually dismissed by users. The system supports flexible dequeuing options, allowing notices to be removed based on their unique identifiers, target list, color, or metadata.

For enhanced user experience, the component includes a "shouldCloseOnAction" feature that automatically dismisses notices when users interact with action buttons, and a "hideClearAll" option that allows developers to hide the clear all button when managing notice visibility.

The components include styling flexibility through classNames props, portal-based rendering for proper positioning, and integration with the existing design system's button components for consistent visual appearance across the application.
