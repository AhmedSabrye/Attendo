# Attendo - Attendance Tracking System

<div align="center">
  <img src="public/AttendoLogo.svg" alt="Attendo Logo" width="120" height="120">
  <h3>Streamline Student Attendance Management</h3>
  <p><em>"Do it once, we handle it forever"</em></p>
</div>

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [📹 Video Tutorial](#-video-tutorial)
- [📸 Screenshots](#-screenshots)
- [Usage](#usage)
- [Architecture](#architecture)
- [API Reference](#api-reference)
- [Contributing](#contributing)

## 🎯 Overview

Attendo is a modern web-based attendance tracking application designed to streamline the process of recording and managing student attendance through intelligent CSV file processing. The system provides automated attendance processing with smart student matching, comprehensive reporting, and group-based organization.

### Key Benefits

- ⚡ **Time-Saving**: Automated CSV processing eliminates manual data entry
- 🎯 **Intelligent Matching**: Smart student identification using phone numbers and aliases
- 📊 **Comprehensive Reporting**: Detailed attendance analytics and statistics
- 👥 **Group Management**: Organize students into manageable groups
- 🔄 **Bulk Operations**: Process entire classes at once
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## ✨ Features

### Core Functionality

- **CSV Upload & Processing**: Upload attendance sheets from Zoom, Teams, or other platforms
- **Smart Student Matching**: Automatic student identification using phone numbers and attendance aliases
- **Attendance Validation**: Real-time validation with conflict resolution
- **Bulk Attendance Updates**: Process entire sessions with one click
- **Duration Tracking**: Track attendance duration with configurable thresholds

### Group Management

- **Create & Manage Groups**: Organize students into classes or sections
- **Student Templates**: Import student lists via CSV templates
- **Group Settings**: Configure attendance thresholds and group preferences
- **Student Management**: Add, edit, and organize students within groups

### Reporting & Analytics

- **Overview Dashboard**: Visual attendance matrix with session history
- **Detailed Reports**: Session-specific attendance reports with statistics
- **Attendance Statistics**: Track attendance rates, trends, and patterns
- **Export Capabilities**: Copy attendance data to clipboard for external use

### User Experience

- **Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **Real-time Updates**: Live data updates with optimistic UI
- **Toast Notifications**: User-friendly feedback for all operations
- **Loading States**: Smooth loading indicators and skeleton screens

## 📹 Video Tutorial

<div align="center">
  <a href="" target="_blank">
    <img src="https://drive.google.com/drive/u/2/folders/19gnQlTyZMjUjc4NpoX76Is3ymf0ThTcA" alt="Watch Demo Video" style="width: 300px;">
  </a>
  <p><em>Click to watch the complete walkthrough of Attendo features and usage</em></p>
</div>

### What You'll Learn

- 🎯 **Complete Walkthrough**: Step-by-step guide from signup to generating reports
- 📊 **CSV Processing**: How to upload and process attendance sheets
- 👥 **Group Management**: Creating groups and managing student lists
- 🔍 **Validation Process**: Handling unmatched students and conflicts
- 📈 **Reporting Features**: Understanding attendance analytics and exports

## 📸 Screenshots

### 1. Overview Dashboard

<div align="center">
  <img src="/Overview.png" alt="Overview Dashboard" width="800" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <p><em>Visual attendance matrix showing student attendance across all sessions</em></p>
</div>

### 2. Reports List

<div align="center">
  <img src="/Reports List.png" alt="Reports List" width="800" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <p><em>List of all attendance reports with session details and statistics</em></p>
</div>

### 3. Report Details

<div align="center">
  <img src="/Report Details.png" alt="Report Details" width="800" style="border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
  <p><em>Detailed session report with individual student attendance and export options</em></p>
</div>

## 📖 Usage

### 1. Authentication

- **Sign Up**: Create a new account with email and password
- **Sign In**: Access your existing account
- **Profile Management**: Update your account information

### 2. Group Management

1. **Create a Group**

   - Click "Create Group" button
   - Enter group name and description
   - Group is automatically created and ready for use

2. **Add Students**
   - Navigate to group settings
   - Upload student template CSV or add manually
   - Configure student attendance aliases

### 3. Attendance Processing

1. **Upload Attendance Sheet**

   - Navigate to your group
   - Click "Upload Attendance Sheet"
   - Select your CSV file from Zoom/Teams export

2. **Review & Validate**

   - System automatically matches students
   - Review unmatched or conflicting records
   - Fix any issues using the validation interface

3. **Submit Attendance**
   - Set attendance date
   - Review final summary
   - Submit to save attendance records

### 4. View Reports

- **Overview Tab**: See attendance matrix for all sessions
- **Reports Tab**: Access detailed session reports and copy to google sheets

## 🏗️ Architecture

### Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Redux Toolkit with RTK Query
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router v7
- **UI Components**: React Icons, React Spinners, React Toastify

### Project Structure

```
src/
├── components/          # React components
│   ├── modals/         # Modal components
│   ├── overview tab/    # Overview dashboard
│   ├── Reports/        # Reporting components
│   └── GroupSettings/  # Group management
├── pages/              # Page components
├── stores/             # Redux store and slices
├── utils/              # Utility functions
├── types/              # TypeScript type definitions
└── lib/                # External library configurations
```

### Data Flow

1. **CSV Upload** → Parse attendance data
2. **Student Matching** → Match with group students
3. **Validation** → Review and fix conflicts
4. **Bulk Update** → Save to database
5. **Report Generation** → Display results

## 🔧 API Reference

### Core Data Types

| Type                    | Location                   | Purpose                                  |
| ----------------------- | -------------------------- | ---------------------------------------- |
| `AttendanceRecord`      | `src/utils/parse.ts:2-6`   | Raw parsed data from CSV uploads         |
| `ComparisonRecord`      | `src/utils/parse.ts:7-10`  | Matched records with student IDs         |
| `FinalComparisonRecord` | `src/utils/parse.ts:11-14` | Records with attendance status flags     |
| `SessionReport`         | `src/utils/parse.ts:15-19` | Complete session analysis                |
| `ValidationReport`      | `src/utils/parse.ts:20-32` | Summary statistics and validation status |

### State Management

The application uses Redux Toolkit with RTK Query for centralized state management:

| Slice         | File                        | Responsibility            |
| ------------- | --------------------------- | ------------------------- |
| `auth`        | `auth.slice.ts`             | User authentication state |
| `modals`      | `src/stores/modals.ts:3-17` | UI modal visibility state |
| API endpoints | `api.ts`                    | Data fetching and caching |

### Key API Endpoints

- **Authentication**: User signup, login, and session management
- **Groups**: CRUD operations for student groups
- **Students**: Student management within groups
- **Attendance**: Bulk attendance updates and individual records
- **Reports**: Session reports and analytics

## 🤝 Contributing

### Development Guidelines

1. **Code Style**: Follow TypeScript best practices
2. **Component Structure**: Use functional components with hooks
3. **State Management**: Use Redux Toolkit for global state
4. **API Integration**: Use RTK Query for data fetching
5. **Testing**: Write tests for critical functionality

## 🆘 Support

For support and questions:

- 📧 Email: [support@attendo.com](mailto:ahmedsabry.fr@gmail.com)
- 🐛 Issues: [GitHub Issues](https://github.com/attendo/issues)

---

<div align="center">
  <p>Built with ❤️ by Sabry </p>
  <p><small>Version 1.0.0</small></p>
</div>
