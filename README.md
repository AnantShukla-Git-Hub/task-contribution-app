# Daily Task Tracker

A minimal calendar-based task manager with offline data persistence.

## Features

- Dark theme interface
- Visual progress indicators on calendar dates
- Monthly completion tracking
- **Auto-save to browser** - Data persists automatically
- Excel file export/import for backup
- Task management with completion tracking
- Responsive design
- No backend required - runs entirely in browser

## Usage

1. Open `index.html` in a web browser
2. Click any date to add tasks
3. Use checkboxes to mark tasks complete
4. **Data saves automatically** - close and reopen anytime
5. Export to Excel for backup or sharing
6. Import Excel files to restore data

## Data Persistence

- **Auto-save**: All changes save instantly to browser's localStorage
- **Persistent**: Data remains even after closing browser
- **Backup**: Export to Excel file for safety
- **Restore**: Import Excel file to load data on another device

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- Chart.js for graphs
- SheetJS for Excel handling

## Installation

No installation needed. Clone and open `index.html` in your browser.

```bash
git clone <your-repo-url>
cd daily-task-tracker
# Open index.html in browser
```

## Data Format

Tasks are stored in Excel format with the following structure:

```
date       | task_name      | completed
2026-01-15 | Buy groceries  | false
2026-01-15 | Call mom       | true
```

## License

MIT
