# PathSeeker Database Schema & Data Models Documentation

This document outlines the MongoDB Atlas database structure, collections, indexes, and relationships for the **PathSeeker** Career Guidance Platform.

---

## 1. Entity-Relationship Diagram (Conceptual)

```
[User] 1 <--- 1 [Profile]
[User] 1 <--- * [QuizResult]
[User] 1 <--- * [Bookmark]
[User] 1 <--- * [Feedback]
[User] 1 <--- * [Notification]
[User] 1 <--- 1 [ChatLog]
[Career] 1 <--- * [Multimedia]
```

---

## 2. Collections & Schemas

### 2.1 `User`
- **Purpose:** Stores user accounts across roles (Student, Graduate, Working Professional, Admin).
- **Fields:**
  - `_id`: ObjectId (Primary Key)
  - `name`: String (Required)
  - `email`: String (Unique, Indexed, Lowercase)
  - `passwordHash`: String (bcrypt hashed)
  - `role`: String Enum (`'student'`, `'graduate'`, `'professional'`, `'admin'`)
  - `isVerified`: Boolean (Default: false)
  - `otp`: String (6-digit code)
  - `otpExpiry`: Date
  - `refreshToken`: String
  - `createdAt`, `updatedAt`: Date timestamps

### 2.2 `Profile`
- **Purpose:** Role-based extension profile for resume URL, skills, education, and theme preference.
- **Fields:**
  - `_id`: ObjectId
  - `userId`: ObjectId (Ref: User, Unique, Indexed)
  - `educationLevel`: String (e.g. "Undergraduate Senior")
  - `skills`: Array of Strings
  - `interests`: Array of Strings
  - `workExperience`: Array of `{ title, company, years, description }`
  - `resumeUrl`: String (Uploaded PDF/DOCX path)
  - `profileImage`: String (Avatar image URL)
  - `bio`: String
  - `theme`: String Enum (`'light'`, `'dark'`)
  - `savedFilters`: Object

### 2.3 `Career`
- **Purpose:** Career Bank catalog entries.
- **Fields:**
  - `_id`: ObjectId
  - `title`: String (Indexed)
  - `description`: String
  - `domain`: String (Indexed: Technology, Business, Healthcare, Engineering, Design, etc.)
  - `requiredSkills`: Array of Strings
  - `educationPath`: String
  - `expectedSalaryRange`: `{ min: Number, max: Number, currency: String }`
  - `demandLevel`: String Enum (`'low'`, `'medium'`, `'high'`)
  - `growthRate`: String
  - `tags`: Array of Strings
  - `createdBy`: ObjectId (Ref: User)

### 2.4 `QuizQuestion`
- **Purpose:** Scientific interest quiz questions & domain scoring weights.
- **Fields:**
  - `_id`: ObjectId
  - `questionText`: String
  - `category`: String Enum (`'Interests'`, `'Skills'`, `'Work Style'`, `'Values'`, `'Preferences'`)
  - `type`: String Enum (`'mcq'`, `'slider'`, `'likert'`)
  - `options`: Array of `{ label, value, scoreMap: { technology, business, healthcare, design, engineering, law, education } }`
  - `weightage`: Number
  - `targetRole`: String Enum (`'all'`, `'student'`, `'graduate'`, `'professional'`)

### 2.5 `QuizResult`
- **Purpose:** Evaluated user quiz history & career match scores.
- **Fields:**
  - `_id`: ObjectId
  - `userId`: ObjectId (Ref: User, Indexed)
  - `answers`: Array of `{ questionId, selectedOptions }`
  - `domainScores`: Object
  - `overallScore`: Number
  - `recommendedCareers`: Array of `{ careerId: Ref Career, matchPercentage: Number, reason: String }`
  - `takenAt`: Date

### 2.6 `Multimedia`
- **Purpose:** Video guides & podcasts, linked with YouTube API v3.
- **Fields:**
  - `_id`: ObjectId
  - `title`: String
  - `youtubeVideoId`: String
  - `url`: String
  - `type`: String Enum (`'video'`, `'podcast'`)
  - `category`: String
  - `transcript`: String
  - `ratingAvg`: Number
  - `ratingCount`: Number
  - `careerId`: ObjectId (Ref: Career, Optional)

### 2.7 `Resource`
- **Purpose:** Downloadable PDF guides, cheat sheets, and templates.
- **Fields:**
  - `_id`: ObjectId
  - `title`: String
  - `category`: String
  - `description`: String
  - `fileUrl`: String
  - `fileType`: String
  - `fileSize`: String
  - `downloadCount`: Number (Increments on download)

### 2.8 `SuccessStory`
- **Purpose:** User career transformation stories.
- **Fields:**
  - `_id`: ObjectId
  - `authorName`: String
  - `userId`: ObjectId (Ref: User, Optional)
  - `domain`: String
  - `headline`: String
  - `storyText`: String
  - `imageUrl`: String
  - `timeline`: Array of `{ year, title, description }`
  - `status`: String Enum (`'pending'`, `'approved'`, `'rejected'`)
  - `approvedBy`: ObjectId (Ref: User)

### 2.9 `Bookmark`
- **Purpose:** User saved items with attached personal notes.
- **Fields:**
  - `_id`: ObjectId
  - `userId`: ObjectId (Ref: User, Indexed)
  - `itemType`: String Enum (`'career'`, `'video'`, `'resource'`, `'article'`)
  - `itemId`: String
  - `title`: String
  - `category`: String
  - `note`: String
