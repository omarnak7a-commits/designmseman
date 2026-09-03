Build a complete, production-quality responsive web application called:

"Test Yourself"

for English teacher:

"Ms Eman Zahy"

IMPORTANT:
Use the uploaded logo image as the PRIMARY BRAND IDENTITY REFERENCE.
Do not redesign, replace, simplify, or invent a different logo.
Use the exact visual identity, typography direction, icon concept, and blue color language from the provided logo throughout the website.

The uploaded logo represents:
- An educational/examination identity
- A large "TY" / checkmark-inspired symbol
- Blue and light-blue colors
- "TEST YOURSELF" wordmark
- "Ms Eman Zahy" as the teacher/brand name

The website must feel like a real premium educational examination platform, not a generic SaaS dashboard and not an AI-generated template.

==================================================
1. PRODUCT OVERVIEW
==================================================

Product:
Test Yourself

Teacher:
Ms Eman Zahy

Purpose:
An online English examination platform where Ms Eman Zahy can create English exams, publish them, generate a unique exam link, send that link to students, automatically grade submissions, and view results/rankings.

The platform has two main experiences:

1. Teacher/Admin Experience
2. Student Examination Experience

The student must NOT need to create an account.

Students access exams directly through a unique exam URL.

Example:

/exam/english-grammar-82K4

==================================================
2. BRANDING & VISUAL DESIGN
==================================================

Use the uploaded logo as the main visual reference.

Color direction:

Primary Blue:
#2563EB

Deep Blue:
#1D4ED8

Baby Blue:
#BFE3FF

White:
#FFFFFF

Light background:
#F8FAFC

Text:
#0F172A

Secondary text:
#64748B

The overall interface should be predominantly white with blue accents.

Design principles:

- Clean
- Minimal
- Modern
- Educational
- Professional
- Friendly
- Trustworthy
- Premium
- Easy to understand
- Highly readable

DO NOT create:

- Excessive gradients
- Neon colors
- Purple-heavy UI
- Dark futuristic AI aesthetics
- Excessive glassmorphism
- Huge decorative illustrations
- Unnecessary animations
- Generic AI dashboard styling
- Overly complicated navigation
- Excessive shadows
- Cluttered layouts

The logo should be visible consistently in the appropriate places.

The teacher name "Ms Eman Zahy" should appear beside or underneath the Test Yourself branding where appropriate.

==================================================
3. RESPONSIVE DESIGN
==================================================

The entire website must be fully responsive.

Support:

- Desktop
- Laptop
- Tablet
- Mobile

The mobile examination experience is extremely important.

On mobile:

- Questions must be easy to read
- Answer controls must be large enough to tap
- Timer must remain visible
- Navigation must remain accessible
- Buttons must be touch-friendly
- No horizontal scrolling
- No broken layouts
- No tiny text
- No unnecessary UI elements

==================================================
4. WEBSITE STRUCTURE
==================================================

Create the following main areas:

PUBLIC / BRAND EXPERIENCE

- Landing / Home
- Exam Entry

TEACHER

- Login
- Dashboard
- Exams
- Create Exam
- Edit Exam
- Exam Details
- Students
- Results
- Student Result Details
- Settings

STUDENT

- Exam Introduction
- Active Exam
- Submission Confirmation
- Result
- Leaderboard
- Answer Review

==================================================
5. LANDING PAGE
==================================================

Create a simple professional landing page for Test Yourself.

Header:

Left:
Test Yourself logo

Next to logo:
Ms Eman Zahy

Right:
Teacher Login

Hero section:

Headline:

"Test Your English. Know Your Level."

Supporting text:

"Take carefully designed English exams, get instant results, and understand your performance."

Primary CTA:

"Take an Exam"

Secondary CTA:

"Teacher Login"

The page should communicate:

- Online English exams
- Easy exam access
- Instant grading
- Clear results
- Professional assessment

Do NOT make the landing page overly marketing-heavy.

Keep it clean and educational.

==================================================
6. TEACHER LOGIN
==================================================

Create a secure teacher login page.

Fields:

Email
Password

Buttons:

Login

Optional:
Remember me

Links:

Forgot Password

The login page should use the Test Yourself logo and Ms Eman Zahy branding.

Teacher authentication must protect all admin routes.

Students must never be able to access teacher dashboard pages.

==================================================
7. TEACHER DASHBOARD
==================================================

Create a professional dashboard.

Sidebar:

Logo

Test Yourself

Ms Eman Zahy

Navigation:

Dashboard
Exams
Students
Results
Settings
Logout

Main dashboard:

Welcome section:

"Welcome back, Ms Eman Zahy"

Statistics cards:

Total Exams
Total Students
Total Attempts
Average Score

Recent Exams section.

Each exam row/card should show:

Exam Name
Number of Questions
Duration
Attempts
Average Score
Status
Created Date

Status badges:

Draft
Published
Active
Closed

Actions:

View
Edit
Results
Copy Link

==================================================
8. EXAMS PAGE
==================================================

Create an Exams management page.

Top:

"Exams"

Primary button:

"+ Create Exam"

Filters:

All
Draft
Published
Active
Closed

Search exams.

Each exam should show:

Exam title
Description
Questions count
Duration
Attempts
Average score
Status

Actions:

Edit
View
Results
Copy Link
Close Exam
Delete

Use confirmation dialogs for destructive actions.

==================================================
9. CREATE EXAM
==================================================

Create a complete exam builder.

Step or section structure:

STEP 1:
Basic Information

Fields:

Exam Title
Description
Instructions

Example:

English Grammar Test

STEP 2:
Exam Settings

Duration:

10 minutes
20 minutes
30 minutes
45 minutes
60 minutes
Custom

Total marks should be calculated automatically from questions.

Settings:

Allow Ranking
Show Ranking to Students
Show Results
Show Answer Review
Exam Start/Close Settings

STEP 3:
Questions

Teacher can add questions.

Question types:

1. Multiple Choice
2. Ordering
3. Correct the Brackets

==================================================
10. MULTIPLE CHOICE QUESTION
==================================================

Teacher interface:

Question text

Option A
Option B
Option C
Option D

Correct Answer

Marks

Example:

She _____ to school every day.

A. go
B. goes
C. going
D. gone

Correct Answer:
B. goes

Marks:
1

==================================================
11. ORDERING QUESTION
==================================================

Teacher enters items.

Example:

Arrange the words to create a correct sentence:

Items:

every
school
to
goes
Ahmed
day

Correct order:

Ahmed
goes
to
school
every
day

Teacher must be able to define the correct order.

Marks:

1

==================================================
12. CORRECT THE BRACKETS QUESTION
==================================================

Example:

She (go) to school every day.

Student must type:

goes

Teacher defines:

Correct Answer:
goes

Marks:

1

Support text input.

The system should normalize answers appropriately when needed.

For example:

- Trim unnecessary spaces
- Handle capitalization appropriately where configured
- Compare normalized text

Do NOT expose correct answers before final submission.

==================================================
13. QUESTION MANAGEMENT
==================================================

Teacher must be able to:

Add Question
Edit Question
Delete Question
Duplicate Question
Reorder Questions

Use drag-and-drop reordering.

Show:

Question 1
Question 2
Question 3
...

Each question card should display:

Question type
Question preview
Marks
Correct answer indicator for teacher
Edit
Delete

==================================================
14. EXAM PREVIEW
==================================================

Before publishing, teacher can click:

"Preview Exam"

Preview the exact student experience.

Teacher should be able to move between questions exactly like a student.

Provide:

Back to Editor
Publish Exam

==================================================
15. PUBLISH EXAM
==================================================

When teacher publishes an exam:

Generate a unique exam link.

Example:

testyourself.com/exam/english-grammar-82K4

Display:

"Your exam is ready!"

Exam link

Buttons:

Copy Link
Open Exam
Share

The teacher can send this link through:

WhatsApp
Messenger
Email
etc.

IMPORTANT:

Students should NOT choose an exam from a list.

The unique link opens the exact exam directly.

==================================================
16. STUDENT EXAM ENTRY
==================================================

When a student opens the exam link:

Show:

Test Yourself logo

Ms Eman Zahy

Exam title

Description

Number of Questions

Duration

Instructions

Student Name

The student name can contain:

Arabic
English
Arabic + English

Button:

"Start Exam"

Before starting, clearly explain:

- The timer starts immediately
- The exam cannot be paused
- Answers are automatically saved
- The exam will automatically submit when time expires
- After submission, answers cannot be changed

==================================================
17. START EXAM
==================================================

When the student clicks:

Start Exam

Create an independent exam attempt.

Start the server-side timer.

Store:

Attempt ID
Student Name
Exam ID
Start Time
Deadline
Current Question
Answers

Do not expose correct answers to the browser.

==================================================
18. ACTIVE EXAM SCREEN
==================================================

Main layout:

Header:

Test Yourself logo
Exam title
Timer

Show:

Question 1 of 20

Time Remaining:

29:42

Question content.

Answer controls.

Navigation:

Previous
Next

Question navigator:

1
2
3
4
5
...

States:

Current
Answered
Unanswered

The student should always know:

- Current question
- Answered questions
- Remaining questions
- Remaining time

==================================================
19. IMMEDIATE FEEDBACK
==================================================

After submitting an answer for a question:

Immediately display:

Correct

OR

Incorrect

IMPORTANT:

If the answer is incorrect:

DO NOT SHOW THE CORRECT ANSWER.

Example:

Incorrect

Continue to the next question.

The student must only learn the correct answer after the entire exam is finished.

For correct answers:

Show:

Correct

Do not reveal additional answer information unnecessarily.

==================================================
20. TIMER
==================================================

The timer is critical.

Teacher controls the duration.

The timer must be server-authoritative.

Do NOT rely only on JavaScript/client-side time.

Server stores:

start_time
deadline

Client displays countdown based on the server deadline.

At:

00:00

Automatically submit the exam.

The student cannot:

Pause
Reset timer
Extend time
Resume after intentional completion

==================================================
21. AUTO-SAVE
==================================================

Automatically save student answers continuously.

Every answer change should be persisted.

If the student temporarily loses connection:

- Preserve saved answers
- Reconnect and synchronize when possible

The server remains the source of truth.

==================================================
22. LEAVING THE EXAM
==================================================

The student should not be able to intentionally leave and resume later.

If the browser/tab closes and the platform can detect it:

Handle the attempt according to the configured submission policy.

If the browser/device closes unexpectedly and no exit event is received:

The server-side deadline remains authoritative.

The student cannot bypass the deadline by closing the browser.

Expired attempts are automatically submitted.

Submitted attempts cannot be reopened.

==================================================
23. SUBMIT EXAM
==================================================

Show button:

"Submit Exam"

Before submitting:

Confirmation modal:

"Are you sure you want to submit your exam?"

Buttons:

Cancel
Submit Exam

After confirmation:

Finalize attempt.

Prevent duplicate submissions.

Calculate score server-side.

Lock the attempt.

The student cannot edit answers anymore.

==================================================
24. AUTOMATIC GRADING
==================================================

Grade automatically on the server.

Support:

Multiple Choice
Ordering
Correct the Brackets

Calculate:

Total Score
Maximum Score
Percentage
Correct Count
Incorrect Count
Time Used

Example:

17 / 20

85%

17 Correct
3 Incorrect

==================================================
25. RESULT PAGE
==================================================

After submission show a clean result page.

Header:

Test Yourself

Ms Eman Zahy

Main result card:

"Your Result"

17 / 20

85%

Then:

Correct Answers:
17

Incorrect Answers:
3

Time Used:
24:18

If ranking is enabled:

Rank:
#4

Use visual hierarchy to make the score the main focus.

==================================================
26. LEADERBOARD
==================================================

If enabled by teacher, show:

Leaderboard

Columns:

Rank
Student Name
Score
Percentage
Time

Example:

1 | Ahmed Mohamed | 20/20 | 100% | 18:22
2 | Youssef Ali | 19/20 | 95% | 20:10
3 | Omar Khaled | 18/20 | 90% | 21:04

Tie-breaker:

If two students have the same score:

The student with the faster completion time ranks higher.

Teacher can disable student-visible ranking.

==================================================
27. FINAL ANSWER REVIEW
==================================================

This is VERY IMPORTANT.

Only after the exam is completely finished:

Show ALL questions.

Do not show only incorrect questions.

For every question show:

Question
Student Answer
Status

For correct answers:

Q1

Your Answer:
goes

Correct

Do NOT need to reveal the correct answer separately.

For incorrect answers:

Q2

Your Answer:
is

Incorrect

Correct Answer:
are

Example:

Q1
Your Answer: goes
Correct

Q2
Your Answer: is
Incorrect
Correct Answer: are

Q3
Your Answer: goes
Correct

Q4
Your Answer: go
Incorrect
Correct Answer: goes

Correct answers must NEVER be accessible to the student before final submission.

==================================================
28. TEACHER RESULTS PAGE
==================================================

Teacher can open any exam and view results.

Show:

Total Students
Completed
Average Score
Highest Score
Lowest Score

Results table:

Student Name
Score
Percentage
Time Used
Rank
Submission Time
Status

Actions:

View Result

Search student.

Filter:

All
Completed
Expired
Submitted

==================================================
29. STUDENT RESULT DETAILS FOR TEACHER
==================================================

When teacher opens a student:

Show:

Student Name
Exam
Score
Percentage
Rank
Start Time
Submission Time
Time Used

Then:

All Questions

For each:

Question
Student Answer
Correct Answer
Correct/Incorrect
Marks

Teacher can see all answers.

==================================================
30. STUDENTS PAGE
==================================================

Teacher dashboard section:

Students

Show:

Student Name
Number of Exams
Average Score
Highest Score
Last Exam

Search supports:

Arabic names
English names

Example:

محمد أحمد

Mohamed Ahmed

Both should be searchable.

==================================================
31. SETTINGS
==================================================

Teacher settings should include:

Profile

Teacher Name:
Ms Eman Zahy

Email

Password

Exam Defaults

Default Duration

Default Ranking Visibility

Default Result Visibility

Default Review Visibility

==================================================
32. ERROR & EMPTY STATES
==================================================

Create polished empty states.

Examples:

No Exams Yet

"You haven't created any exams yet."

Button:

Create Your First Exam

No Results Yet

"No students have completed this exam yet."

Invalid Exam Link

"This exam link is invalid or no longer available."

Closed Exam

"This exam is currently closed."

Expired Attempt

"Your exam time has expired and your attempt has been submitted."

==================================================
33. LOADING STATES
==================================================

Use clean skeleton loaders/spinners.

Never leave blank screens while data loads.

==================================================
34. SECURITY
==================================================

Implement proper authorization.

Teacher:

Can access teacher dashboard.

Student:

Can only access the specific exam and their own attempt/result.

Never send correct answers to the student before submission.

Correct answers must be protected on the server.

Scoring must happen on the server.

Timer/deadline must be server authoritative.

Prevent:

Duplicate submission
Score manipulation
Correct answer exposure
Unauthorized teacher dashboard access
Unauthorized result access
Editing submitted attempts

==================================================
35. DATABASE / DATA MODEL
==================================================

Design the backend around entities such as:

User
Teacher
Exam
Question
QuestionOption
ExamAttempt
Student
StudentAnswer
ExamResult

Suggested relationships:

Teacher
  ↓
Exams
  ↓
Questions
  ↓
ExamAttempts
  ↓
StudentAnswers
  ↓
Result

Each exam must have a unique public identifier/link token.

Each student attempt must have a unique attempt ID.

==================================================
36. USER EXPERIENCE
==================================================

Prioritize usability over visual effects.

Every action should have clear feedback.

Examples:

Exam published successfully.

Exam link copied.

Answer saved.

Exam submitted successfully.

Question deleted.

Exam closed.

Use toast notifications where appropriate.

Use confirmation modals for destructive actions.

==================================================
37. ANIMATIONS
==================================================

Animations should be subtle.

Use:

- Smooth page transitions
- Button hover states
- Card hover states
- Modal transitions
- Progress transitions
- Question transitions

Avoid:

- Large cinematic animations
- Excessive parallax
- Distracting movement during exams
- Heavy 3D effects

The exam itself should remain distraction-free.

==================================================
38. ACCESSIBILITY
==================================================

Use:

- High contrast text
- Clear focus states
- Keyboard navigation
- Accessible form labels
- Large touch targets
- Semantic HTML
- Proper error messages

==================================================
39. UI COMPONENT SYSTEM
==================================================

Create a consistent reusable component system.

Components:

Button
Input
Select
Textarea
Card
Modal
Toast
Badge
Table
Tabs
Dropdown
Sidebar
Header
Timer
Question Card
Progress Indicator
Pagination
Empty State
Loading State
Confirmation Dialog

Use consistent:

Border radius
Spacing
Typography
Button sizes
Icon sizes
Colors

==================================================
40. LOGO USAGE
==================================================

Use the uploaded Test Yourself logo prominently but professionally.

Header:
Logo + Ms Eman Zahy

Login:
Large centered logo

Student exam:
Compact logo

Dashboard:
Sidebar logo

Result page:
Logo

Do not stretch or distort the logo.

Maintain proper spacing around the logo.

Create an icon-only version where needed if the uploaded asset supports it.

==================================================
41. IMPORTANT PRODUCT RULES
==================================================

RULE 1:
Students access exams using unique direct links.

RULE 2:
Students do NOT choose exams from a list.

RULE 3:
Students do NOT need accounts.

RULE 4:
Teacher authentication is required.

RULE 5:
Correct answers are never exposed during an active exam.

RULE 6:
Student receives only Correct/Incorrect feedback during the exam.

RULE 7:
Correct answers are revealed only after the exam is completely finished.

RULE 8:
Final review contains ALL questions.

RULE 9:
For correct questions:
Show student answer + Correct.

RULE 10:
For wrong questions:
Show student answer + Incorrect + Correct Answer.

RULE 11:
Timer is server-side authoritative.

RULE 12:
When timer reaches zero, automatically submit.

RULE 13:
Answers are continuously auto-saved.

RULE 14:
Submitted exams cannot be edited.

RULE 15:
Scoring happens server-side.

RULE 16:
Teacher controls ranking visibility.

==================================================
42. COMPLETE USER JOURNEY
==================================================

TEACHER:

Login
↓
Dashboard
↓
Create Exam
↓
Add Questions
↓
Set Marks
↓
Set Timer
↓
Preview
↓
Publish
↓
Generate Unique Link
↓
Copy Link
↓
Send Link to Students
↓
Students Take Exam
↓
View Results
↓
View Ranking
↓
Open Individual Student Result

STUDENT:

Receive Link
↓
Open Exam
↓
Read Exam Information
↓
Enter Name
↓
Start Exam
↓
Timer Starts
↓
Answer Question
↓
See Correct / Incorrect
↓
Continue
↓
Answer All Questions
↓
Submit Exam
OR
Timer Reaches 00:00
↓
Auto Submit
↓
Automatic Grading
↓
Result
↓
Leaderboard (if enabled)
↓
Review ALL Answers
↓
Correct Answers Revealed Only Where Appropriate

==================================================
43. FINAL DESIGN GOAL
==================================================

The final website should feel like:

"A professional English examination platform built specifically for Ms Eman Zahy."

It should be:

Clean
Fast
Reliable
Modern
Educational
Professional
Easy to use
Responsive
Secure

The uploaded logo must be the visual foundation of the entire interface.

Do not create a generic template.

Do not add unrelated features.

Do not add unnecessary AI features.

Do not change the product concept.

Focus on delivering a complete, polished examination platform with a seamless teacher and student experience.

==================================================
44. QUALITY BAR
==================================================

The final result must look production-ready.

No:

- Placeholder screens
- Fake buttons
- Broken links
- Empty unfinished sections
- Inconsistent spacing
- Random colors
- Generic stock illustrations
- Unfinished responsive layouts
- Exposed correct answers
- Client-only grading
- Client-only timer

Every major button must perform its intended action.

Every page must connect logically to the next page.

The application should feel like one coherent product.

Build the complete experience, not just a landing page.