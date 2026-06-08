## Collection: failures

Purpose: Stores every CI/CD failure Runforge processes

Fields:
  _id              ObjectId   auto-generated
  runId    number    GitHub Actions workflow run ID — used to fetch logs
  installationId   ObjectId   ref to installations collection
  repoFullName     string     "owner/repo" — GitHub format
  workflowName     string     name of the workflow that failed
  branch           string     git branch name
  prNumber         number     linked PR number, null if no PR
  commitSHA        string     40-char git commit hash
  commentId        number    GitHub PR comment ID — for editing existing comment
  failedStep       string     name of the step that failed
  cleanedLog       string     processed log sent to AI
  startedAt        Date       when the run started
  failedAt         Date       when the run failed
  resolved         boolean    true when CI passes after this failure
  resolvedAt       Date       when it was resolved, null if not yet
  retryCount       number     how many times this run was retried

Indexes:
  { repoFullName: 1, failedAt: -1 }   compound — most common query
  { installationId: 1 }               for installation-level queries
  { resolved: 1 }                     for unresolved failure queries
  { failedAt: 1 }, expireAfterSeconds: 7776000   TTL — delete after 90 days

## Collection: users

Purpose: Stores people who log into the Runforge dashboard

Fields:
  _id              ObjectId    auto-generated
  githubId         number      unique ID from GitHub (never changes)
  username         string      GitHub username eg. "ParasKhandelwal1616"
  email            string      email from GitHub
  avatarUrl        string      profile picture URL
  role             string      "admin" | "viewer" — their permission level
  createdAt        Date        when they first logged into Runforge
  lastActiveAt     Date        last time they used the dashboard

Indexes:
  { githubId: 1 }   unique index — main lookup field
  { username: 1 }   for username search

## Collection: installations

Purpose: Track every repo that has installed Runforge
         so we can make API calls on their behalf

Fields:
  _id                ObjectId    auto-generated
  installationId     number      GitHub's installation ID (12345678)
  accountLogin       string      GitHub username or org name
  accountType        string      "User" or "Organization"
  repoSelection      string      "all" or "selected"
  selectedRepos      array       list of specific repos if selected
  permissions        object      what permissions they granted
  installedAt        Date        when they installed
  isActive           boolean     false if they uninstalled
  userId             ObjectId    ref to users collection — who installed this
  uninstalledAt      Date        when they uninstalled, null if active
  plan               string      "free" | "starter" | "pro"

## Collection: analyses

Purpose: Stores the AI-generated output for every 
         CI failure Runforge processes

Fields:
  _id              ObjectId    auto-generated
  
  // Reference
  failureId        ObjectId    which failure this analysis belongs to
  
  // What AI returns (your words translated)
  errorType        string      "dependency|test|build|network|timeout|permission|config"
  rootCause        string      plain English explanation of why it failed
  errorMessage     string      exact error line extracted from the log
  fixSuggestions   array       list of possible fixes with details
  bestFix          string      single highest confidence fix
  severity         string      "critical|high|medium|low"
  relatedFiles     array       files mentioned in the error
  retryCount    number    how many times AI call was retried before success
  estimatedFixTime string      "5mins|30mins|2hours|unknown"
  
  // What your app needs
  model            string      which AI model was used eg. "gemini-1.5-flash"
  tokensUsed       number      for cost tracking
  cached           boolean     was this from cache or fresh API call
  confidence       string      "high|medium|low" — how sure the AI is
  embedding        array       vector for similarity search (pattern detection)
  createdAt        Date        when this analysis was generated

Indexes:
  { failureId: 1 }       to fetch analysis for a specific failure
  { errorType: 1 }       to group by error type in dashboard
  { createdAt: -1 }      to get recent analyses first

## Collection: patterns

Purpose: Tracks recurring CI failures across a repo —
         same error type happening multiple times,
         used to alert developers about systemic issues

Fields:
  _id              ObjectId    auto-generated
  repoFullName     string      which repo this pattern is in
  errorType        string      type of error eg. "dependency|network"
  occurrenceCount  number      how many times this error occurred
  firstSeenAt      Date        when this pattern was first detected
  lastSeenAt       Date        most recent occurrence
  failureIds       array       ObjectIds of all failures in this pattern
  embedding        array       vector for similarity detection
  suggestedFix     string      recommended permanent fix
  installationId    ObjectId    ref to installations collection
  isResolved       boolean     true if pattern no longer occurring
  resolvedAt       Date        when it was resolved, null if still active

Indexes:
  { repoFullName: 1 }           all patterns for a repo
  { isResolved: 1 }             filter active vs resolved
  { errorType: 1 }              group by error type
  { lastSeenAt: -1 }            most recent patterns first
  { repoFullName: 1, errorType: 1 }   compound — most common query