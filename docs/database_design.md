## Collection: failures

Purpose: Stores every CI/CD failure Runforge processes

Fields:
  _id              ObjectId   auto-generated
  installationId   ObjectId   ref to installations collection
  repoFullName     string     "owner/repo" — GitHub format
  workflowName     string     name of the workflow that failed
  branch           string     git branch name
  prNumber         number     linked PR number, null if no PR
  commitSHA        string     40-char git commit hash
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
  uninstalledAt      Date        when they uninstalled, null if active
  plan               string      "free" | "starter" | "pro"

  ## Collection: Analyses

Purpose: Have all the analitis form the faliers what we get form giving the falior to the ai
           and this have a responce

Fields:
  branch    string
  Solution    strings
  
