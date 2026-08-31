# MyBrain Project

MyBrain is a calm, mobile-first personal productivity application built with Next.js, TypeScript, Tailwind CSS, and Supabase.

## Current completed phases

1. **Foundation**
   - Next.js App Router project
   - TypeScript and Tailwind CSS
   - Responsive application structure

2. **Supabase / Auth / Database**
   - Supabase authentication
   - Protected routes and session refresh
   - Existing database schema and Row Level Security
   - Login, signup, password recovery, and logout flows

3. **Tasks + Reminders**
   - Authenticated task CRUD
   - Task filters and status updates
   - Due dates and optional linked reminders
   - Dashboard Today tasks and seven-day Upcoming reminders
   - Quick Add
   - Real reminders page with upcoming and overdue states

4. **Design system**
   - MyBrain visual identity and reusable design tokens
   - Mobile bottom navigation and desktop sidebar
   - Reusable page, card, status, reminder, settings, and notes patterns
   - Refined dashboard, tasks, reminders, notes, chat placeholder, More, login, and signup surfaces
   - Responsive and accessibility rules documented in `DESIGN.md`

## Current routes

### Public and authentication

- `/`
- `/auth/login`
- `/auth/sign-up`
- `/auth/sign-up-success`
- `/auth/forgot-password`
- `/auth/update-password`
- `/auth/error`
- `/auth/confirm`

### Authenticated

- `/protected`
- `/protected/tasks`
- `/protected/chat`
- `/protected/notes`
- `/protected/documents`
- `/protected/voice-notes`
- `/protected/reminders`
- `/protected/more`
- `/protected/account`

## Technical guardrails

- Preserve Supabase authentication and the existing protected-route flow.
- Preserve database tables, relationships, environment variables, and RLS policies.
- Access user data only through authenticated clients and existing ownership rules.
- Keep server-side data access separate from visual components.
- Prefer existing dependencies and CSS/Tailwind transitions over large UI or animation libraries.
- Treat `DESIGN.md` as the visual source of truth.

## Future planned phases

- Documents
- PDF extraction
- AI summaries
- Voice Notes
- AI Chat
- Permissions
- Notifications
- PWA
- Performance
- Deployment

These future capabilities remain intentionally unimplemented until their dedicated phases.
