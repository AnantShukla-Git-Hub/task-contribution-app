# Daily Task Tracker

A minimal calendar-based task manager with offline data persistence.

## Features

- Dark theme interface
- Visual progress indicators on calendar dates
- Monthly completion tracking
- Excel file export/import
- Task management with completion tracking
- Responsive design
- No backend required - runs entirely in browser

## Usage

1. Open `index.html` in a web browser
2. Click any date to add tasks
3. Use checkboxes to mark tasks complete
4. Export data to save as Excel file
5. Import previously exported files to restore data

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
