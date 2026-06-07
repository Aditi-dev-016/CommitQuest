# Requirements Document

## Introduction

ContribQuest is a gamified, AI-powered web platform designed to help beginner and intermediate developers discover, understand, and contribute to open-source projects. The platform combines GitHub-style workflows with RPG-inspired progression mechanics — quests, XP, levels, achievements, guilds, and a world map — to lower the barrier to open-source contribution and sustain long-term engagement through intrinsic motivation loops.

The system provides AI-powered repository intelligence (complexity scoring, architecture mapping, issue explanation), structured learning paths, a community guild layer, and a contribution pipeline from issue discovery through PR submission. The platform is desktop-first, targeting developers who work on a laptop or desktop machine.

---

## Glossary

- **Contributor**: A registered user of the ContribQuest platform
- **Quest**: A structured task with defined objectives, XP reward, and completion criteria
- **XP**: Experience Points — the primary progression currency earned by completing activities
- **Level**: A numeric rank derived from cumulative XP, displayed on the Contributor's profile
- **Guild**: A community group of Contributors organized around a shared technology or interest
- **Repository Intelligence Report**: An AI-generated analysis document for a given GitHub repository
- **Architecture Map**: A visual, interactive graph of a repository's file and module structure
- **Streak**: A count of consecutive days on which the Contributor completed at least one activity
- **Achievement**: A badge unlocked upon meeting a specific milestone or behavioral condition
- **Learning Path**: An ordered sequence of lessons and quizzes organized around a topic
- **Mission Board**: The page listing all available quests, bounties, and daily challenges
- **World Map**: A visual region-based progress overview representing the Contributor's skill journey
- **Beginner Friendliness Score**: A 0–100 composite score rating how accessible a repository is to new contributors
- **System**: The ContribQuest web application and its backend services

---

## Requirements

### Requirement 1: User Onboarding and Authentication

**User Story:** As a new user, I want to sign in with my GitHub account and complete a skill assessment, so that the platform can personalize my experience from the start.

#### Acceptance Criteria

1. WHEN a user visits the platform for the first time, THE System SHALL display a landing page with a "Sign in with GitHub" call-to-action
2. WHEN a user initiates GitHub OAuth, THE System SHALL redirect to GitHub's authorization endpoint and request read access to public profile and repository data
3. WHEN GitHub returns a successful authorization code, THE System SHALL exchange the code for a JWT session token and create a Contributor record
4. IF the GitHub OAuth flow fails or is cancelled, THEN THE System SHALL display an error message and return the user to the landing page without creating a session
5. WHEN a new Contributor completes OAuth, THE System SHALL present a multi-step onboarding wizard covering: (a) skill self-assessment, (b) technology interests, (c) contribution goals
6. WHEN the Contributor completes the onboarding wizard, THE System SHALL initialize the Contributor's XP at 0, Level at 1, and pre-populate recommended repositories and quests based on the assessment answers
7. THE System SHALL persist the JWT in an HttpOnly cookie with a 30-day expiry
8. WHEN a returning Contributor visits the platform with a valid JWT, THE System SHALL bypass the onboarding wizard and route directly to the Dashboard
9. IF a Contributor's JWT is expired or invalid, THEN THE System SHALL clear the cookie and redirect to the landing page

---

### Requirement 2: Dashboard

**User Story:** As a Contributor, I want a personalized dashboard that shows my progress, active quests, and recommendations, so that I always know what to work on next.

#### Acceptance Criteria

1. WHEN the Contributor loads the Dashboard, THE System SHALL display a Hero Card containing: GitHub avatar, display name, current Level, cumulative XP, and current streak count
2. WHEN the Contributor loads the Dashboard, THE System SHALL display an XP progress bar showing the XP required to reach the next level
3. THE System SHALL display up to 3 Active Quests on the Dashboard, each showing: quest title, difficulty badge, XP reward, and a "Continue" action
4. WHEN there are no Active Quests, THE System SHALL display a prompt linking the Contributor to the Mission Board
5. THE System SHALL display a World Map section with at least 7 named regions, each indicating the Contributor's progress or locked state
6. WHEN the Contributor clicks a World Map region, THE System SHALL navigate to the corresponding Learning Path within the Learning Academy
7. THE System SHALL display up to 4 Recommended Repositories on the Dashboard, each showing: repo name, beginner friendliness rating (0–100), primary language tag, and difficulty score (1–5)
8. THE System SHALL display the Contributor's 3 most recently unlocked Achievements on the Dashboard
9. WHEN a new Achievement is unlocked while the Contributor is on the Dashboard, THE System SHALL display an animated toast notification containing the Achievement name and icon
10. THE System SHALL display a streak counter; WHEN the streak is 0, THE System SHALL display a motivational prompt to start a streak

---

### Requirement 3: Repository Analyzer

**User Story:** As a Contributor, I want to analyze any public GitHub repository, so that I can understand how beginner-friendly it is before investing time in it.

#### Acceptance Criteria

1. WHEN the Contributor submits a valid GitHub repository URL, THE System SHALL initiate an AI-powered analysis and display a loading state indicating progress
2. THE System SHALL validate that the submitted URL matches the pattern `https://github.com/{owner}/{repo}` before initiating analysis; IF the URL is invalid, THEN THE System SHALL display a validation error without making an API call
3. WHEN analysis completes, THE System SHALL render a Repository Intelligence Report containing: repository overview, primary language, star count, fork count, open issue count, last activity date, tech stack tags, and health metrics
4. THE System SHALL display a Beginner Friendliness Score (0–100) composed from: documentation quality, issue label coverage, contribution guide presence, code complexity, and community activity
5. THE System SHALL display a list of Contribution Opportunities extracted from open issues, each tagged with a difficulty label (EASY, MEDIUM, HARD)
6. WHEN the Contributor clicks a Contribution Opportunity, THE System SHALL navigate to the Issue Explainer for that issue
7. IF the repository is private or does not exist, THEN THE System SHALL display an error card explaining the issue without crashing the page
8. THE System SHALL cache Repository Intelligence Reports for 24 hours; WHEN a cached report exists for a URL, THE System SHALL serve the cached version without re-running AI analysis
9. WHEN a Contributor views a Repository Intelligence Report for the first time, THE System SHALL award 10 XP

---

### Requirement 4: Repository Explorer

**User Story:** As a Contributor, I want to visually explore a repository's architecture, so that I can understand its structure before making a contribution.

#### Acceptance Criteria

1. WHEN the Contributor opens the Repository Explorer for a repository, THE System SHALL render an interactive Architecture Map canvas displaying repository modules as draggable nodes
2. THE System SHALL connect related nodes with directed edges representing import or dependency relationships
3. WHEN the Contributor clicks a node on the Architecture Map, THE System SHALL display a NodePopup panel containing: file/module name, description, file type, key exports, and related files
4. THE System SHALL display an AI Guide panel alongside the Architecture Map offering contextual explanations of selected nodes
5. WHEN the Contributor hovers over a node, THE System SHALL highlight that node and its direct connections
6. THE System SHALL support pan and zoom controls on the Architecture Map canvas
7. WHEN the Contributor first opens the Repository Explorer for a repository, THE System SHALL award 10 XP
8. IF the repository structure cannot be parsed, THEN THE System SHALL display a fallback message in the AI Guide panel and render a simplified flat file list instead of the interactive map

---

### Requirement 5: Issue Finder

**User Story:** As a Contributor, I want to discover beginner-friendly open issues across repositories, so that I can find a contribution that matches my current skill level.

#### Acceptance Criteria

1. THE System SHALL display a filterable list of open GitHub issues sourced from analyzed repositories
2. THE System SHALL support filtering issues by: difficulty label (EASY, MEDIUM, HARD), programming language, repository, and issue label (good first issue, help wanted, documentation)
3. WHEN the Contributor applies a filter, THE System SHALL update the issue list within 300ms without a full page reload
4. WHEN the Contributor clicks an issue, THE System SHALL navigate to the Issue Explainer for that issue
5. THE System SHALL display for each issue: issue title, repository name, difficulty badge, relevant language tags, and time-since-opened
6. IF no issues match the active filters, THEN THE System SHALL display an empty state with a suggestion to adjust filters

---

### Requirement 6: Issue Explainer

**User Story:** As a Contributor, I want an AI-generated plain-English explanation of a GitHub issue, so that I can understand what needs to be done without deep codebase knowledge.

#### Acceptance Criteria

1. WHEN the Contributor opens the Issue Explainer for an issue, THE System SHALL fetch and display the original issue title, body, labels, and author
2. WHEN the Issue Explainer loads, THE System SHALL invoke the Gemini API to generate a plain-English explanation of the issue
3. THE AI explanation SHALL include: what the problem is, why it matters, which files are likely involved, and suggested first steps
4. WHEN the AI explanation is generating, THE System SHALL display a streaming skeleton or typing animation to indicate progress
5. IF the Gemini API returns an error, THEN THE System SHALL display the raw issue body as fallback with an error banner
6. WHEN the Contributor reads the explanation and clicks "Start Contributing", THE System SHALL add the issue to the Contributor's Active Quests and award a First PR Assistant context
7. WHEN an Issue Explainer is viewed for the first time, THE System SHALL create a Quest entry linked to that issue

---

### Requirement 7: First PR Assistant

**User Story:** As a Contributor, I want step-by-step AI guidance for making my first pull request, so that I can submit a contribution with confidence.

#### Acceptance Criteria

1. THE System SHALL provide a guided multi-step flow: (a) Fork & Clone, (b) Branch, (c) Edit, (d) Commit, (e) Push, (f) Open PR
2. WHEN the Contributor completes a step, THE System SHALL mark it as complete with a visual checkmark and unlock the next step
3. THE System SHALL display contextual AI tips for each step, referencing the specific repository's contribution guidelines when available
4. WHEN the Contributor links their GitHub PR URL in the final step, THE System SHALL validate that the URL points to an open PR on the target repository
5. WHEN a valid PR URL is submitted, THE System SHALL award 150 XP and mark the associated Quest as submitted
6. WHEN the linked PR is subsequently merged (detected via GitHub webhook or polling), THE System SHALL award an additional 300 XP and trigger the "Merged PR" achievement check
7. IF the Contributor's linked PR is closed without merging, THEN THE System SHALL notify the Contributor and offer to create a new quest for the same issue

---

### Requirement 8: Quest System

**User Story:** As a Contributor, I want a system of daily, weekly, and milestone quests, so that I have clear goals and earn rewards for my contributions.

#### Acceptance Criteria

1. THE System SHALL maintain three quest categories: Daily Challenges, Standard Quests, and Featured Bounties
2. THE System SHALL refresh Daily Challenge quests every 24 hours at midnight UTC
3. THE System SHALL display each quest with: title, description, difficulty badge (EASY / MEDIUM / HARD), XP reward, and current completion status
4. WHEN a Contributor completes a quest's objectives, THE System SHALL automatically mark the quest as complete and award the specified XP
5. WHEN a quest is completed, THE System SHALL display an animated completion modal showing XP gained and any newly unlocked achievements
6. THE System SHALL support quest prerequisites: WHEN a prerequisite quest is not complete, THE System SHALL display the dependent quest as locked
7. THE System SHALL display a progress indicator on the Mission Board showing how many Daily Challenges have been completed for the current day
8. WHEN a Contributor completes all Daily Challenges for a day, THE System SHALL increment the Contributor's streak count by 1
9. IF the Contributor does not complete any Daily Challenge within a 48-hour window, THEN THE System SHALL reset the streak count to 0

---

### Requirement 9: Achievements System

**User Story:** As a Contributor, I want to earn achievement badges for milestones, so that I feel recognized for my progress and motivated to keep contributing.

#### Acceptance Criteria

1. THE System SHALL define at least 20 distinct Achievements covering: first contribution, streak milestones, XP thresholds, community engagement, and repository exploration
2. WHEN an Achievement's unlock condition is satisfied, THE System SHALL immediately create an AchievementUnlock record and notify the Contributor via an in-app toast
3. WHEN the Contributor views their Profile, THE System SHALL display all Achievements, with locked ones shown in a greyed-out state with the unlock condition visible
4. WHEN an Achievement is unlocked, THE System SHALL play a subtle animated glow effect on the Achievement badge
5. THE System SHALL display an Achievement count summary on the Dashboard (e.g., "12 / 47 Achievements")
6. WHEN a Contributor shares an Achievement to a Guild discussion, THE System SHALL render the Achievement badge inline in the message thread

---

### Requirement 10: Learning Academy

**User Story:** As a Contributor, I want structured learning paths with lessons and quizzes, so that I can systematically improve my open-source contribution skills.

#### Acceptance Criteria

1. THE System SHALL organize content into named Learning Paths, each aligned to one of the 7 World Map regions
2. WHEN the Contributor opens the Learning Academy, THE System SHALL display a progression overview showing completed lessons, available lessons, and locked lessons per path
3. WHEN the Contributor completes a Lesson, THE System SHALL award 20 XP and mark the lesson as complete
4. WHEN all Lessons in a Learning Path are complete, THE System SHALL award a Path Certificate and unlock the corresponding World Map region
5. THE System SHALL support lesson types: article, video embed, and interactive quiz
6. WHEN the Contributor answers a quiz question incorrectly, THE System SHALL display the correct answer with an explanation before allowing the Contributor to proceed
7. THE System SHALL track and display a Daily Goal progress bar showing the Contributor's lesson activity for the current day
8. WHEN the Contributor earns a Path Certificate, THE System SHALL make it downloadable and shareable

---

### Requirement 11: Guild Hall

**User Story:** As a Contributor, I want to join and interact with guilds, so that I can learn from peers and collaborate on open-source projects.

#### Acceptance Criteria

1. THE System SHALL display a Guild discovery page listing available Guilds with: name, specialty tags, member count, and activity status
2. WHEN the Contributor joins a Guild, THE System SHALL add the Contributor to the Guild's member list and display the Guild in the Contributor's sidebar navigation
3. THE System SHALL support a per-Guild discussion board with threaded messages, similar to Discord channels
4. WHEN the Contributor posts a message in a Guild discussion, THE System SHALL display the message with: avatar, username, level badge, timestamp, and reaction support
5. THE System SHALL display a Guild activity feed showing recent member contributions, quest completions, and achievements
6. WHEN the Contributor helps another member (upvoted reply or answer marked as helpful), THE System SHALL award 50 XP to the helper
7. THE System SHALL support Guild events: scheduled group contribution sessions displayed on a Guild calendar

---

### Requirement 12: Contributor Profile

**User Story:** As a Contributor, I want a public profile page that showcases my progress and contributions, so that others can see my open-source journey.

#### Acceptance Criteria

1. WHEN a Contributor views a profile (own or another's), THE System SHALL display: GitHub avatar, display name, level, cumulative XP, XP progress bar to next level, and join date
2. THE System SHALL display stat cards on the Profile showing: Total XP, Issues Solved, PRs Submitted, PRs Merged, and Streak Count
3. THE System SHALL display the Contributor's Achievement badges on their Profile, ordered by unlock date (most recent first)
4. THE System SHALL display a Contribution Timeline showing the Contributor's activity history as a chronological feed
5. THE System SHALL display the Contributor's active Guild memberships on their Profile
6. WHEN the Contributor views their own Profile, THE System SHALL display an "Edit Profile" button that allows updating display name and bio
7. THE Profile page SHALL be publicly accessible without authentication, with the exception of the "Edit Profile" functionality

---

## Non-Functional Requirements

### NFR-1: Performance

1. THE System SHALL achieve a Largest Contentful Paint (LCP) of under 2.5 seconds on the Dashboard page under standard broadband conditions
2. WHEN a Contributor applies filters on the Issue Finder, THE System SHALL update the displayed list within 300ms
3. THE System SHALL serve cached Repository Intelligence Reports within 200ms (Redis cache hit)
4. AI-powered analysis tasks (Repository Analyzer, Issue Explainer) that exceed 5 seconds of processing SHALL display an animated progress indicator

### NFR-2: Security

1. THE System SHALL store all session tokens in HttpOnly, Secure, SameSite=Strict cookies
2. THE System SHALL validate all incoming GitHub webhook payloads using HMAC-SHA256 signature verification
3. THE System SHALL never expose GitHub OAuth client secrets to the frontend
4. THE System SHALL enforce rate limiting of 60 API requests per minute per authenticated Contributor

### NFR-3: Reliability

1. THE System SHALL return a structured error response (not an unhandled exception) for all API failures
2. WHEN the Gemini API is unavailable, THE System SHALL serve cached AI results where available, and display a graceful degradation message where not
3. THE System SHALL maintain 99.5% uptime for the core authentication and dashboard flows

### NFR-4: Accessibility

1. THE System SHALL comply with WCAG 2.1 Level AA contrast requirements for all text and interactive elements
2. THE System SHALL support full keyboard navigation across all interactive components
3. THE System SHALL provide ARIA labels on all icon-only buttons and non-decorative SVG elements
4. THE System SHALL not rely solely on color to convey state (e.g., difficulty badges shall include text labels)

### NFR-5: Scalability

1. THE System SHALL support a minimum of 10,000 concurrent Contributor sessions without degradation
2. THE System SHALL horizontally scale backend API workers via containerized deployment

---

## MVP Definition

The following modules constitute the Minimum Viable Product:

- Requirement 1 (Onboarding & Auth) — complete
- Requirement 2 (Dashboard) — complete
- Requirement 3 (Repository Analyzer) — complete
- Requirement 5 (Issue Finder) — complete
- Requirement 6 (Issue Explainer) — complete
- Requirement 8 (Quest System) — daily challenges and standard quests only
- Requirement 9 (Achievements) — first 10 achievements
- Requirement 12 (Contributor Profile) — view-only, no edit

Deferred to v1.1:
- Requirement 4 (Repository Explorer)
- Requirement 7 (First PR Assistant — full guided flow)
- Requirement 10 (Learning Academy)
- Requirement 11 (Guild Hall)

---

## Future Roadmap

- **v1.2**: Mobile-responsive layout and PWA support
- **v1.3**: Team/organization accounts with shared quest boards
- **v1.4**: Marketplace for custom quest templates created by maintainers
- **v2.0**: Real-time collaborative architecture map exploration
- **v2.1**: AI code review assistant integrated into the PR submission flow
