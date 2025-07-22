# **App Name**: Zenith QA Tracker

## Core Features:

- Secure Authentication: User authentication with email/password and Google Sign-In, restricted to the @sunnetwork.in domain.
- Platform Selection: Platform selection form (Android TV, Apple TV, etc.) to collect testing environment details before starting a session.
- Test Case Import: Excel file upload and parsing to extract test cases using xlsx.full.min.js.  Each test case will have columns for Test Bed, Test Case, Test Steps, Expected Result, Actual Results and Notes.
- Interactive Test Tracking: Clear UI for displaying individual test cases with Pass/Fail/N/A status marking buttons and saving. Use modals to request Bug ID/Description for 'Fail' and reason for 'N/A'.
- Progress Visualization: Visual representation of session progress with rocket progress indicator.
- Test Result Analytics: Comprehensive dashboard displaying overall summary (Pass/Fail/N/A), session history, and test case details with ability to view and edit past tests.
- Export Report: Comprehensive dashboard with button to export all test session data in Excel format.

## Style Guidelines:

- Primary color: Vibrant violet (#A059F5), evoking quality.
- Background color: Dark gray (#282A3A), providing a sleek, modern feel.
- Accent color: Soft lavender (#D0BFFF), complementing the primary color.
- Body and headline font: 'Inter' sans-serif font for all text, as per the user request. Note: currently only Google Fonts are supported.
- Use clean, minimalistic icons for actions and status indicators.
- Employ a dark theme with a clear, consistent layout using Tailwind CSS for responsive design.
- Subtle animations on button interactions, loading states, and transitions between sections.