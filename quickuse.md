# YouTrack MCP Quick Reference

Common usage patterns for the YouTrack MCP tools. Use this to quickly recall how to interact with YouTrack in Claude sessions.

---

## Projects

### List All Projects
```
mcp_youtrack_projects
  action: list
```

### Get Project Details
```
mcp_youtrack_projects
  action: get
  projectId: "TCG" (or "81-101")
```

### Get Project Statistics
```
mcp_youtrack_projects
  action: status
  projectId: "TCG"
```

### List Project Custom Fields
```
mcp_youtrack_projects
  action: fields
  projectId: "TCG"
```

---

## Issues

### Create Issue
```
mcp_youtrack_issues
  action: create
  projectId: "81-101"
  summary: "Task title here"
  description: "Full description with **markdown** support"
  type: "Task"
  priority: "Normal"
  assignee: "michael"
```

**Available Types:** Bug, Change Request, Documentation, Cosmetics, Exception, Feature, Task, Usability Problem, Performance Problem, Epic, Data-Integrity, Migration Task, Question, Idea, Administrative, Meeting

**Available Priorities:** Show-stopper, Critical, Major, Normal, Minor

**Available States:** Ready, In Progress, Backlog, Client Review, Blocked, Needs Review, Complete

### Update Issue
```
mcp_youtrack_issues
  action: update
  issueId: "TCG-123"
  summary: "Updated title"
  description: "Updated description"
```

### Get Single Issue
```
mcp_youtrack_issues
  action: get
  issueId: "TCG-123"
```

### Search Issues (Smart)
```
mcp_youtrack_issues
  action: search
  query: "LinkedIn"
  projectId: "TCG"
```

### Query Issues (Advanced)
```
mcp_youtrack_issues
  action: query
  query: "project: TCG state: {In Progress}"
```

### Count Issues
```
mcp_youtrack_issues
  action: count
  query: "project: TCG state: Ready"
```

### Change Issue State
```
mcp_youtrack_issues
  action: state
  issueId: "TCG-123"
  state: "In Progress"
  comment: "Starting work on this"
```

### Mark Issue Complete
```
mcp_youtrack_issues
  action: complete
  issueId: "TCG-123"
  comment: "Done!"
```

### Link Issues
```
mcp_youtrack_issues
  action: link
  issueId: "TCG-123"
  targetIssueId: "TCG-124"
  linkType: "relates to"
```

**Link Types:** "relates to", "depends on", "duplicates", "subtask of", "parent for"

### Move Issue to Another Project
```
mcp_youtrack_issues
  action: move
  issueId: "TCG-123"
  targetProjectId: "HD"
```

### Get Field Values for Project
```
mcp_youtrack_issues
  action: get_field_values
  projectId: "TCG"
  fieldName: "Type"
```

---

## Raw Queries

### YouTrack Query Syntax
```
mcp_youtrack_query
  query: "project: TCG state: Ready"
  fields: "id,summary,description,state,priority"
  limit: 50
```

**Query Examples:**
- `state: Ready` - All ready issues
- `project: TCG assignee: me` - My issues in project
- `priority: Show-stopper created: >2025-01-01` - Recent critical issues
- `#bug -state: Complete` - Open bugs
- `state: {In Progress} assignee: michael` - Michael's active work

---

## Comments

### List Comments
```
mcp_youtrack_comments
  action: get
  issueId: "TCG-123"
```

### Add Comment
```
mcp_youtrack_comments
  action: add
  issueId: "TCG-123"
  text: "Comment with **markdown** support"
```

### Update Comment
```
mcp_youtrack_comments
  action: update
  issueId: "TCG-123"
  commentId: "4-12345"
  text: "Updated comment text"
```

### Delete Comment
```
mcp_youtrack_comments
  action: delete
  issueId: "TCG-123"
  commentId: "4-12345"
```

---

## Bulk Operations (Commands)

### Apply Command to Multiple Issues
```
mcp_youtrack_commands
  action: apply
  query: "State: In Progress"
  issueIds: ["TCG-1", "TCG-2", "TCG-3"]
```

### Apply Command with Comment
```
mcp_youtrack_commands
  action: apply
  query: "for: john.doe Priority: High"
  issueIds: ["TCG-123"]
  comment: "Escalating this issue"
  silent: false
```

### Get Command Suggestions
```
mcp_youtrack_commands
  action: suggest
  query: "State: "
```

---

## Agile Boards & Sprints

### List All Boards
```
mcp_youtrack_agile_boards
  action: boards
```

### Get Board Details
```
mcp_youtrack_agile_boards
  action: board_details
  boardId: "123-45"
```

### List Sprints
```
mcp_youtrack_agile_boards
  action: sprints
  boardId: "123-45"
```

### Create Sprint
```
mcp_youtrack_agile_boards
  action: create_sprint
  boardId: "123-45"
  name: "Sprint 5"
  start: "2026-02-03"
  finish: "2026-02-14"
  goal: "Complete LinkedIn campaign launch"
```

### Assign Issues to Sprint
```
mcp_youtrack_agile_boards
  action: assign_issues
  boardId: "123-45"
  sprintId: "sprint-id"
  issueIds: ["TCG-1", "TCG-2", "TCG-3"]
```

### Get Sprint Issues
```
mcp_youtrack_agile_boards
  action: sprint_issues
  boardId: "123-45"
  sprintId: "sprint-id"
```

---

## Time Tracking

### Log Time
```
mcp_youtrack_time_tracking
  action: log_time
  issueId: "TCG-123"
  duration: "2h"
  description: "Research completed"
  date: "2026-02-02"
  workType: "Development"
```

### Get Time Entries
```
mcp_youtrack_time_tracking
  action: get_time_entries
  issueId: "TCG-123"
```

### Time Reports
```
mcp_youtrack_time_tracking
  action: time_reports
  projectId: "TCG"
  startDate: "2026-01-01"
  endDate: "2026-01-31"
```

---

## Knowledge Base

### List Articles
```
mcp_youtrack_knowledge_base
  action: list
  projectId: "TCG"
```

### Create Article
```
mcp_youtrack_knowledge_base
  action: create
  projectId: "TCG"
  title: "Article Title"
  content: "## Section 1\n\nContent here...\n\n## Section 2\n\nMore content..."
  summary: "Brief overview for article list"
```

⚠️ **Important:** Do NOT include `# Title` in content - it's added from the title field automatically.

### Search Articles
```
mcp_youtrack_knowledge_base
  action: search
  searchTerm: "LinkedIn strategy"
  projectId: "TCG"
```

### Link Articles (Parent-Child)
```
mcp_youtrack_knowledge_base
  action: link_sub_article
  parentArticleId: "article-1"
  childArticleId: "article-2"
```

---

## Users

### List All Users
```
mcp_youtrack_users
  action: list
```

### Search Users
```
mcp_youtrack_users
  action: search
  query: "michael"
```

### Get Current User
```
mcp_youtrack_users
  action: current
```

### Get Project Team
```
mcp_youtrack_users
  action: project_team
  projectId: "TCG"
```

---

## Analytics

### Project Statistics
```
mcp_youtrack_analytics
  reportType: project_stats
  projectId: "TCG"
```

### Resource Allocation
```
mcp_youtrack_analytics
  reportType: resource_allocation
  projectId: "TCG"
  startDate: "2026-01-01"
  endDate: "2026-01-31"
```

---

## Activities

### Get Issue Activities
```
mcp_youtrack_activities
  action: get_issue
  issueId: "TCG-123"
```

### Get Global Activities
```
mcp_youtrack_activities
  action: get_global
  author: "me"
  top: 20
```

---

## Custom Fields

### List All Custom Fields
```
mcp_youtrack_custom_fields
  action: list
```

### Get Issue Custom Fields
```
mcp_youtrack_custom_fields
  action: issue_fields
  issueId: "TCG-123"
```

### Update Issue Custom Field
```
mcp_youtrack_custom_fields
  action: update_issue_field
  issueId: "TCG-123"
  fieldId: "field-id"
  value: "New Value"
```

---

## Admin Operations

### Search Users (Admin)
```
mcp_youtrack_admin
  operation: search_users
  query: "john"
```

### Bulk Update Issues
```
mcp_youtrack_admin
  operation: bulk_update
  issueIds: ["TCG-1", "TCG-2"]
  updates: {"priority": "High"}
```

### Create Dependency
```
mcp_youtrack_admin
  operation: dependencies
  sourceIssueId: "TCG-123"
  targetIssueId: "TCG-124"
```

---

## Authentication

### Check Auth Status
```
mcp_youtrack_auth
  action: status
```

### Test Token
```
mcp_youtrack_auth
  action: test
```

---

## Common Workflows

### Create Multiple Tasks (Batch)
When creating many tasks, call `mcp_youtrack_issues` with `action: create` multiple times in parallel.

### Sprint Planning
1. `mcp_youtrack_agile_boards action: boards` - Find board
2. `mcp_youtrack_agile_boards action: create_sprint` - Create sprint
3. Create issues with `mcp_youtrack_issues action: create`
4. `mcp_youtrack_agile_boards action: assign_issues` - Assign to sprint

### Issue Triage
1. `mcp_youtrack_query query: "project: TCG state: Ready"` - Get backlog
2. `mcp_youtrack_commands action: apply` - Bulk update priorities/assignees

### Weekly Review
1. `mcp_youtrack_analytics reportType: project_stats` - Get overview
2. `mcp_youtrack_query query: "project: TCG state: Complete resolved: thisWeek"` - Completed this week
3. `mcp_youtrack_time_tracking action: time_reports` - Time spent

---

## Tips

- **Project IDs:** Can use either numeric ID (`81-101`) or shortName (`TCG`)
- **Issue IDs:** Format is `SHORTNAME-NUMBER` (e.g., `TCG-123`)
- **Dates:** Use `YYYY-MM-DD` format
- **Duration:** Use `Xh` (hours), `Xd` (days), `Xm` (minutes)
- **Multi-word values:** Wrap in braces: `state: {In Progress}`
- **Current user:** Use `me` in queries and assignee fields
- **Parallel calls:** Create/query operations can run in parallel
- **Large results:** Tool outputs may be written to temp files - read with `read_file`
