// Data structure: { "2026-05-24": [{ task: "Buy groceries", completed: false }] }
let tasksData = {};
let currentDate = new Date();
let selectedDate = null;
let monthlyChart = null;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
    setupEventListeners();
});

function initializeApp() {
    renderCalendar();
    renderMonthlyChart();
}

function setupEventListeners() {
    document.getElementById('prevMonth').addEventListener('click', () => changeMonth(-1));
    document.getElementById('nextMonth').addEventListener('click', () => changeMonth(1));
    document.getElementById('importBtn').addEventListener('click', importData);
    document.getElementById('exportBtn').addEventListener('click', exportData);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('addTaskBtn').addEventListener('click', addTask);
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTask();
    });
    
    // Close modal on outside click
    document.getElementById('taskModal').addEventListener('click', (e) => {
        if (e.target.id === 'taskModal') closeModal();
    });
}

// Calendar rendering
function renderCalendar() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update header
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    
    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const cell = createDayCell(day, month - 1, year, true);
        grid.appendChild(cell);
    }
    
    // Current month days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const isToday = day === today.getDate() && 
                       month === today.getMonth() && 
                       year === today.getFullYear();
        const cell = createDayCell(day, month, year, false, isToday);
        grid.appendChild(cell);
    }
    
    // Next month days
    const totalCells = grid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows × 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const cell = createDayCell(day, month + 1, year, true);
        grid.appendChild(cell);
    }
}

function createDayCell(day, month, year, isOtherMonth, isToday = false) {
    const cell = document.createElement('div');
    cell.className = 'day-cell';
    if (isOtherMonth) cell.classList.add('other-month');
    if (isToday) cell.classList.add('today');
    
    const dateStr = formatDate(year, month, day);
    const tasks = tasksData[dateStr] || [];
    const percentage = calculatePercentage(tasks);
    
    // Day number
    const dayNum = document.createElement('div');
    dayNum.className = 'day-number';
    dayNum.textContent = day;
    cell.appendChild(dayNum);
    
    // Progress ring
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'progress-ring');
    svg.setAttribute('width', '60');
    svg.setAttribute('height', '60');
    
    const circleBg = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circleBg.setAttribute('class', 'progress-ring-circle-bg');
    circleBg.setAttribute('cx', '30');
    circleBg.setAttribute('cy', '30');
    circleBg.setAttribute('r', '25');
    
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('class', 'progress-ring-circle');
    circle.setAttribute('cx', '30');
    circle.setAttribute('cy', '30');
    circle.setAttribute('r', '25');
    
    const circumference = 2 * Math.PI * 25;
    circle.style.strokeDasharray = `${circumference} ${circumference}`;
    circle.style.strokeDashoffset = circumference;
    
    if (tasks.length > 0) {
        const offset = circumference - (percentage / 100) * circumference;
        circle.style.strokeDashoffset = offset;
        
        if (percentage === 100) {
            circle.style.stroke = 'var(--ring-complete)';
        } else if (percentage > 0) {
            circle.style.stroke = 'var(--ring-partial)';
        }
    }
    
    svg.appendChild(circleBg);
    svg.appendChild(circle);
    cell.appendChild(svg);
    
    // Percentage text
    const text = document.createElement('div');
    text.className = 'progress-text';
    text.textContent = tasks.length > 0 ? `${percentage}%` : '—';
    cell.appendChild(text);
    
    // Click handler
    if (!isOtherMonth) {
        cell.addEventListener('click', () => openDayModal(dateStr, day, month, year));
    }
    
    return cell;
}

function calculatePercentage(tasks) {
    if (tasks.length === 0) return 0;
    const completed = tasks.filter(t => t.completed).length;
    return Math.round((completed / tasks.length) * 100);
}

function formatDate(year, month, day) {
    const m = String(month + 1).padStart(2, '0');
    const d = String(day).padStart(2, '0');
    return `${year}-${m}-${d}`;
}

// Modal functions
function openDayModal(dateStr, day, month, year) {
    selectedDate = dateStr;
    
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date(year, month, day);
    const dayName = dayNames[date.getDay()];
    
    document.getElementById('modalDate').textContent = 
        `${dayName}, ${monthNames[month]} ${day}, ${year}`;
    
    renderTaskList();
    updateModalProgress();
    
    document.getElementById('taskModal').classList.add('active');
    document.getElementById('taskInput').focus();
}

function closeModal() {
    document.getElementById('taskModal').classList.remove('active');
    document.getElementById('taskInput').value = '';
    selectedDate = null;
}

function renderTaskList() {
    const tasks = tasksData[selectedDate] || [];
    const taskList = document.getElementById('taskList');
    const emptyState = document.getElementById('emptyState');
    
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        emptyState.style.display = 'block';
        return;
    }
    
    emptyState.style.display = 'none';
    
    // Sort: incomplete first, then completed
    const sortedTasks = [...tasks].sort((a, b) => a.completed - b.completed);
    
    sortedTasks.forEach((task, index) => {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item';
        if (task.completed) taskItem.classList.add('completed');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleTask(index));
        
        const taskName = document.createElement('div');
        taskName.className = 'task-name';
        taskName.textContent = task.task;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
        `;
        deleteBtn.addEventListener('click', () => deleteTask(index));
        
        taskItem.appendChild(checkbox);
        taskItem.appendChild(taskName);
        taskItem.appendChild(deleteBtn);
        taskList.appendChild(taskItem);
    });
}

function addTask() {
    const input = document.getElementById('taskInput');
    const taskName = input.value.trim();
    
    if (!taskName) return;
    
    if (!tasksData[selectedDate]) {
        tasksData[selectedDate] = [];
    }
    
    tasksData[selectedDate].push({
        task: taskName,
        completed: false
    });
    
    input.value = '';
    input.focus();
    
    renderTaskList();
    updateModalProgress();
    renderCalendar();
    renderMonthlyChart();
}

function toggleTask(index) {
    const tasks = tasksData[selectedDate];
    tasks[index].completed = !tasks[index].completed;
    
    renderTaskList();
    updateModalProgress();
    renderCalendar();
    renderMonthlyChart();
}

function deleteTask(index) {
    tasksData[selectedDate].splice(index, 1);
    
    if (tasksData[selectedDate].length === 0) {
        delete tasksData[selectedDate];
    }
    
    renderTaskList();
    updateModalProgress();
    renderCalendar();
    renderMonthlyChart();
}

function updateModalProgress() {
    const tasks = tasksData[selectedDate] || [];
    const percentage = calculatePercentage(tasks);
    
    const circle = document.querySelector('.modal-progress .progress-ring-circle');
    const text = document.querySelector('.progress-text-modal');
    
    const circumference = 2 * Math.PI * 25;
    const offset = circumference - (percentage / 100) * circumference;
    
    circle.style.strokeDashoffset = offset;
    
    if (percentage === 100) {
        circle.style.stroke = 'var(--ring-complete)';
    } else if (percentage > 0) {
        circle.style.stroke = 'var(--ring-partial)';
    } else {
        circle.style.stroke = 'var(--ring-empty)';
    }
    
    text.textContent = `${percentage}%`;
}

// Month navigation
function changeMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    renderCalendar();
    renderMonthlyChart();
}

// Monthly chart
function renderMonthlyChart() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const labels = [];
    const data = [];
    
    for (let day = 1; day <= daysInMonth; day++) {
        labels.push(day);
        const dateStr = formatDate(year, month, day);
        const tasks = tasksData[dateStr] || [];
        const percentage = calculatePercentage(tasks);
        data.push(percentage);
    }
    
    const ctx = document.getElementById('monthlyChart');
    
    if (monthlyChart) {
        monthlyChart.destroy();
    }
    
    monthlyChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Completion %',
                data: data,
                borderColor: '#6366f1',
                backgroundColor: 'rgba(99, 102, 241, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 3,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        color: '#a0a0a0',
                        callback: (value) => value + '%'
                    },
                    grid: {
                        color: '#333333'
                    }
                },
                x: {
                    ticks: {
                        color: '#a0a0a0'
                    },
                    grid: {
                        color: '#333333'
                    }
                }
            }
        }
    });
}

// Import/Export functions
function importData() {
    document.getElementById('fileInput').click();
    document.getElementById('fileInput').onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = new Uint8Array(event.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // Clear existing data
                tasksData = {};
                
                // Read all sheets (months)
                workbook.SheetNames.forEach(sheetName => {
                    const worksheet = workbook.Sheets[sheetName];
                    const jsonData = XLSX.utils.sheet_to_json(worksheet);
                    
                    jsonData.forEach(row => {
                        const date = row.date;
                        const task = row.task_name;
                        const completed = row.completed === 'true' || row.completed === true;
                        
                        if (!tasksData[date]) {
                            tasksData[date] = [];
                        }
                        
                        tasksData[date].push({ task, completed });
                    });
                });
                
                renderCalendar();
                renderMonthlyChart();
                alert('Data imported successfully!');
            } catch (error) {
                alert('Error importing file. Please check the format.');
                console.error(error);
            }
        };
        reader.readAsArrayBuffer(file);
    };
}

function exportData() {
    const year = currentDate.getFullYear();
    const workbook = XLSX.utils.book_new();
    
    // Group data by month
    const monthlyData = {};
    
    Object.keys(tasksData).forEach(dateStr => {
        const [y, m] = dateStr.split('-');
        if (parseInt(y) !== year) return;
        
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                           'July', 'August', 'September', 'October', 'November', 'December'];
        const monthName = monthNames[parseInt(m) - 1];
        
        if (!monthlyData[monthName]) {
            monthlyData[monthName] = [];
        }
        
        tasksData[dateStr].forEach(task => {
            monthlyData[monthName].push({
                date: dateStr,
                task_name: task.task,
                completed: task.completed
            });
        });
    });
    
    // Create sheet for each month
    Object.keys(monthlyData).forEach(monthName => {
        const worksheet = XLSX.utils.json_to_sheet(monthlyData[monthName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, monthName);
    });
    
    // Download
    XLSX.writeFile(workbook, `tasks-${year}.xlsx`);
}
