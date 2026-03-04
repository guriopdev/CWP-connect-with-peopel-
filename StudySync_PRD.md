# StudySync -- Product Requirements Document (PRD)

## 1. Product Overview

### Product Vision

StudySync is a virtual co-study platform where students can: - Join
public or private study rooms - Study together on video call - Chat in
rooms and via private DMs - Track productivity using Pomodoro and To-Do
lists - Build trusted study circles through friend requests - Use an AI
Study Assistant (coming soon)

### Target Audience

-   College students
-   Competitive exam aspirants
-   Remote learners
-   Coding students

------------------------------------------------------------------------

## 2. Core Problem

Students struggle with: - Studying alone - Distractions - Lack of
accountability - No structured study groups - No integrated productivity
tools

------------------------------------------------------------------------

## 3. Core Features

### 3.1 Study Rooms

Users can: - Create room - Set room name - Add description - Add
subject/tag - Set max participants - Set public or private - Add
optional password

Users can: - View public rooms - Join public rooms directly - Join
private rooms using password - See participants list

------------------------------------------------------------------------

### 3.2 Video Study Room

Features: - Grid video layout - Mic mute/unmute - Camera on/off - Leave
room - Optional inactivity auto-removal

------------------------------------------------------------------------

### 3.3 Room Chat (Group Chat)

-   Real-time messaging
-   Timestamp
-   Sender name
-   Message history stored
-   Optional delete own message

------------------------------------------------------------------------

### 3.4 Friend System

-   Send friend request
-   Accept or reject request
-   View friend list
-   Only friends can send DMs

------------------------------------------------------------------------

### 3.5 Direct Messaging (DM)

-   Real-time messaging
-   Seen indicator
-   Message history stored
-   Only available after friend acceptance

------------------------------------------------------------------------

### 3.6 Personal To-Do List

-   Add task
-   Mark complete
-   Delete task
-   Optional due date
-   Optional priority

------------------------------------------------------------------------

### 3.7 Pomodoro Timer

-   25 min focus
-   5 min break
-   Custom time option
-   Sound notification
-   Optional shared room sync (future)

------------------------------------------------------------------------

### 3.8 AI Study Assistant (Future)

-   Answer study doubts
-   Generate summaries
-   Explain concepts
-   Study analytics
-   Personalized recommendations

------------------------------------------------------------------------

## 4. System Architecture

### Frontend

-   React or Next.js
-   Tailwind CSS
-   WebRTC for video

### Backend

-   Node.js + Express
-   Socket.io
-   MongoDB or PostgreSQL

### Authentication

-   JWT
-   Email/Password
-   Optional Google login

------------------------------------------------------------------------

## 5. Database Design (Basic Schema)

### Users

-   id
-   name
-   email
-   password_hash
-   created_at

### Rooms

-   id
-   name
-   created_by
-   password_hash (nullable)
-   is_public
-   max_users
-   created_at

### RoomMembers

-   room_id
-   user_id

### Messages

-   id
-   sender_id
-   room_id or dm_id
-   content
-   timestamp

### FriendRequests

-   id
-   sender_id
-   receiver_id
-   status (pending/accepted/rejected)

### Friends

-   user_id
-   friend_id

### Todos

-   id
-   user_id
-   task
-   is_completed
-   due_date

------------------------------------------------------------------------

## 6. MVP Scope (Version 1)

Include: - Authentication - Public room creation and joining - Basic
video call - Room chat - Basic Pomodoro - Basic To-Do

Later Phases: - Friend system - DMs - AI assistant - Room analytics -
Shared timer sync

------------------------------------------------------------------------

## 7. Security Considerations

-   Hash passwords (bcrypt)
-   Hash room passwords
-   Validate WebSocket events
-   Rate limit messages
-   Prevent unauthorized room access

------------------------------------------------------------------------

## 8. Development Plan

### Phase 1

-   Authentication
-   Room creation
-   Chat system

### Phase 2

-   WebRTC integration
-   Pomodoro timer
-   To-Do feature

### Phase 3

-   Friend system
-   Direct messaging

### Phase 4

-   AI assistant integration

------------------------------------------------------------------------

## 9. Future Monetization

-   Premium rooms
-   Study analytics subscription
-   AI tutor subscription
-   Custom themes
-   Larger room capacity
