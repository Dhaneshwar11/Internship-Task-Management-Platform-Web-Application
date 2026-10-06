# Heloix WorkHub

Heloix WorkHub is an internship and task management platform for coordinating candidate hiring, onboarding, mentor-led work, attendance, leave, performance follow-up, and internship completion. The repository currently contains a browser-based React application and a separate Android Jetpack Compose starter project.

## Web Application

The web app includes these modules:

- **Dashboard:** operational summary and navigation to platform workflows.
- **Hiring & Candidates:** candidate pipeline, offer letters, electronic signatures, document collection, verification, and approval.
- **Onboarding & Training:** onboarding checklist and training progress.
- **Internship Directory:** active and historical internship records.
- **Task Management:** task assignment, intern submissions, attachments, mentor feedback, and review status.
- **Attendance & Reports:** clock-in, clock-out, and daily work reports.
- **Leave & Extensions:** leave requests, review, and internship extensions.
- **Performance & Warnings:** performance escalation and warning records.
- **Evaluation & Certificates:** internship evaluations, completion approval, certificates, and letters of recommendation.
- **Reports & Analytics:** available in the navigation for `super_admin`, `hr_admin`, and `dept_admin` roles.
- **Audit Trail** and **System Settings:** available in the navigation for `super_admin` and `hr_admin` roles.
- **Notifications:** in-app updates for workflow events.

The application defines five user roles: `super_admin`, `hr_admin`, `dept_admin`, `mentor`, and `intern`. Sample users and workflow records are loaded from `src/data/initialData.ts`.

## Repository Layout

```text
src/
	components/       Web app screens grouped by workflow
	context/          Shared application state and workflow actions
	data/             Sample users, candidates, tasks, and settings
	types/            TypeScript domain models
	App.tsx           Authentication gate and main module navigation
	main.tsx          React application entry point
server/db/
	schema.sql        PostgreSQL schema reference
app/
	src/main/         Android Jetpack Compose starter application
	src/test/         Android unit test scaffold
	src/androidTest/  Android instrumented test scaffold
```

## Tech Stack

- **Web:** React 19, TypeScript, Vite 8, Tailwind CSS 4
- **UI:** Lucide React icons and Motion animations
- **Archive handling:** JSZip
- **Android starter:** Kotlin, Jetpack Compose, and Gradle
- **Database reference:** PostgreSQL DDL in `server/db/schema.sql`

## Run the Web App

Requirements: Windows, Node.js 20.19+ or 22.12+, and npm. The current `dev` script invokes `node.exe` directly.

```bash
npm install
npm run dev
```

Open [http://localhost:8080](http://localhost:8080).

### Web Commands

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server on port 8080 |
| `npm run build` | Create a production build in `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run the TypeScript check (`tsc --noEmit`) |

There is no web test command currently defined in `package.json`.

### Demo Login and Data

The login page provides sample accounts for the built-in roles. The demo password shown there is `Heloix@11`. This is not production authentication: account data and the password are in frontend code, and the login flow permits an unlisted email when the demo password is supplied. Do not use real credentials.

Application records are seeded from `src/data/initialData.ts` and saved to the current browser's `localStorage`. Records do not synchronize between browsers or devices. The cloud-sync status indicator is simulated. Use the application's reset option or clear this site's browser storage to return to the seeded state.

The PostgreSQL schema in `server/db/schema.sql` describes departments, positions, users, candidates, offers, candidate documents, onboarding progress, tasks, submissions, reviews, attendance, leave requests, warnings, evaluations, certificates, and audit logs. It is a schema reference only; the current web app does not connect to a database or backend API.

## Android Starter

The Gradle `:app` module is a standalone Jetpack Compose starter. Its current screen displays a placeholder greeting and is not connected to the WorkHub web app or its data. Open the repository in Android Studio with an Android SDK installed to build or run it. The module targets API 37 and has a minimum SDK of API 28.

## Security and Scope

This repository is a demo/prototype, not a production-ready HR system. Authentication and business data are client-side, there is no server-side authorization or persistence, and the cloud-sync indicator does not represent a real cloud connection. Avoid entering sensitive personal or employment data until a secured backend and real identity system are implemented.
