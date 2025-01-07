document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();

    const currentDateDisplay = document.getElementById('currentDate');
    const dayTable = document.getElementById('dayTable');
    const weekTable = document.getElementById('weekTable');
    const monthTable = document.getElementById('monthTable');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dayViewBtn = document.getElementById('dayView');
    const weekViewBtn = document.getElementById('weekView');
    const monthViewBtn = document.getElementById('monthView');

    let viewMode = 'week';

    function updateCalendar() {
        dayTable.style.display = 'none';
        weekTable.style.display = 'none';
        monthTable.style.display = 'none';

        if (viewMode === 'day') {
            currentDateDisplay.textContent = `Data: ${formatDate(currentDate)}`;
            dayTable.style.display = 'table';
            renderDayTable();
        } else if (viewMode === 'week') {
            const weekRange = getWeekRange(currentDate);
            currentDateDisplay.textContent = `Tydzień: ${formatDate(weekRange.start)} - ${formatDate(weekRange.end)}`;
            weekTable.style.display = 'table';
            renderWeekTable();
        } else if (viewMode === 'month') {
            currentDateDisplay.textContent = `Miesiąc: ${currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}`;
            monthTable.style.display = 'table';
            renderMonthTable();
        }
    }

    function getWeekRange(date) {
        const start = new Date(date);
        start.setDate(date.getDate() - date.getDay() + 1);
        const end = new Date(start);
        end.setDate(start.getDate() + 6);
        return { start, end };
    }

    function renderDayTable() {
        const tbody = dayTable.querySelector('tbody');
        tbody.innerHTML = '';

        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.textContent = "Przykładowe wydarzenie - 10:00";
        row.appendChild(cell);
        tbody.appendChild(row);
    }

    function renderWeekTable() {
        const tbody = weekTable.querySelector('tbody');
        tbody.innerHTML = '';
        const hours = Array.from({ length: 13 }, (_, i) => `${8 + i}:00`);

        for (const hour of hours) {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            timeCell.textContent = hour;
            row.appendChild(timeCell);

            for (let i = 0; i < 7; i++) {
                const cell = document.createElement('td');
                cell.textContent = `Dane ${hour} Dzień ${i + 1}`; // Dummy data
                row.appendChild(cell);
            }

            tbody.appendChild(row);
        }
    }

    function renderMonthTable() {
        const tbody = monthTable.querySelector('tbody');
        tbody.innerHTML = '';

        const daysOfWeekRow = document.createElement('tr');
        for (const day of ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz']) {
            const dayCell = document.createElement('th');
            dayCell.textContent = day;
            daysOfWeekRow.appendChild(dayCell);
        }
        tbody.appendChild(daysOfWeekRow);

        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        let row = document.createElement('tr');

        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            if (row.children.length === 7) {
                tbody.appendChild(row);
                row = document.createElement('tr');
            }

            const cell = document.createElement('td');
            cell.textContent = `Dzień ${i}`; // Dummy data
            row.appendChild(cell);
        }

        if (row.children.length > 0) {
            tbody.appendChild(row);
        }
    }

    function formatDate(date) {
        return date.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    prevBtn.addEventListener('click', () => {
        if (viewMode === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
        } else if (viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else if (viewMode === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        }
        updateCalendar();
    });

    nextBtn.addEventListener('click', () => {
        if (viewMode === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        } else if (viewMode === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (viewMode === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        }
        updateCalendar();
    });

    dayViewBtn.addEventListener('click', () => {
        viewMode = 'day';
        updateCalendar();
    });

    weekViewBtn.addEventListener('click', () => {
        viewMode = 'week';
        updateCalendar();
    });

    monthViewBtn.addEventListener('click', () => {
        viewMode = 'month';
        updateCalendar();
    });

    updateCalendar();
});
