# StudySync -- Product Design & UX Specification

## 1. Design System

### Color Palette

#### Light Mode

-   Primary Background: White (#FFFFFF)
-   Primary Accent: Purple (#7C3AED or similar modern purple)
-   Secondary Accent: Light Purple shades
-   Text: Dark Gray / Black

#### Dark Mode

-   Primary Background: Black (#000000 or #0F0F0F)
-   Primary Accent: Purple (#7C3AED)
-   Cards: Dark Gray (#1A1A1A)
-   Text: White

### Design Style

-   Modern UI
-   Rounded corners (12px--16px radius)
-   Soft shadows
-   Glassmorphism elements (optional)
-   Smooth animations
-   Gradient purple buttons
-   Clean typography (Inter / Poppins)

------------------------------------------------------------------------

## 2. Homepage (Landing Page)

### Purpose

Explain why StudySync is helpful for students.

### Sections

#### Hero Section

-   Big headline: "Study Together. Stay Accountable."
-   Subtext explaining benefits
-   Call-to-action buttons:
    -   Join Lobby
    -   Get Started

#### Parallax Effect

-   Background scroll animation
-   Floating study-themed illustrations
-   Smooth scrolling animations

#### Why This Website Helps Students

-   Reduces loneliness
-   Increases accountability
-   Built-in Pomodoro
-   Real-time study rooms
-   Productivity tools in one place

#### Modern Components

-   Animated cards
-   Hover effects
-   Smooth transitions
-   Scroll-trigger animations

------------------------------------------------------------------------

## 3. Authentication Flow

### Lobby Button Behavior

-   If user is NOT logged in:
    -   Redirect to Signup page
-   If user IS logged in:
    -   Redirect directly to Lobby

### Session Handling

-   Use JWT + Refresh Token
-   Store token securely
-   Auto-login on revisit
-   No need to login every time

------------------------------------------------------------------------

## 4. Signup Page

### Features

#### Login with Google

-   OAuth integration
-   One-click signup

#### Unique Username

-   After signup:
    -   User must choose a unique username
    -   Validate uniqueness in real-time

#### Optional Profile Details (Skippable)

-   Profile picture (optional)
-   Bio (optional)
-   Pronouns (optional)
-   Country (optional)
-   Education (optional)

User can complete later in profile settings.

------------------------------------------------------------------------

## 5. Lobby Page

### Top Navigation Bar

Navbar Items: - Lobby - Chat - To-Do List - Pomodoro Timer - AI Bot
(Coming Soon)

Right Side: - Profile icon - Settings - Logout

------------------------------------------------------------------------

## 6. Room Listing (Lobby)

### Room Display Card

Each room shows: - Room name - Subject/tag - Number of participants -
Lock icon if password protected - Created by (username)

### Lock Indicator

-   If room has password:
    -   Show lock icon
-   On click:
    -   Ask for password

------------------------------------------------------------------------

## 7. Video Call Interface

### Design Style

Inspired by Discord layout.

### Layout Structure

Left Side: - Participant video grid

Right Side Panel: - List of participants

### Participant List Features

On clicking participant: - View profile picture - View bio - Send friend
request - See username

------------------------------------------------------------------------

## 8. Room Admin Controls

Room creator becomes Admin.

Admin Powers: - Mute participant - Kick participant - Disable camera
(optional future) - Remove from room

Admin badge visible beside username.

------------------------------------------------------------------------

## 9. Chat Section

### Separate From Room Chat

Global Chat Page: - Shows friend DMs - Real-time messaging - Only
available if friend request accepted

------------------------------------------------------------------------

## 10. To-Do List Page

-   Add task
-   Mark complete
-   Delete task
-   Clean minimal UI
-   Purple accent highlights

------------------------------------------------------------------------

## 11. Pomodoro Timer Page

-   25 min focus
-   5 min break
-   Custom timer
-   Circular animated progress indicator
-   Sound notification

------------------------------------------------------------------------

## 12. AI Bot Page

Display: "AI Study Assistant -- Coming Soon"

Future: - Ask doubts - Study suggestions - Summaries - Productivity
insights

------------------------------------------------------------------------

## 13. UX Principles

-   Minimal distractions
-   Fast loading
-   Responsive (Mobile + Desktop)
-   Smooth animations
-   Clean interface
-   Purple accent consistency

------------------------------------------------------------------------

## 14. Accessibility

-   Dark mode toggle
-   High contrast text
-   Keyboard navigation
-   Clear visual hierarchy

------------------------------------------------------------------------

## 15. Future Enhancements

-   Study streak tracking
-   Room analytics
-   Shared synced Pomodoro
-   Achievement badges
-   Custom themes
