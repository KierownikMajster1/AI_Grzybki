document.addEventListener('DOMContentLoaded', () => {
    let currentDate = new Date();
    let fetchedData = []; // Przechowywanie pobranych danych

    const currentDateDisplay = document.getElementById('currentDate');
    const dayTable = document.getElementById('dayTable');
    const weekTable = document.getElementById('weekTable');
    const monthTable = document.getElementById('monthTable');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dayViewBtn = document.getElementById('dayView');
    const weekViewBtn = document.getElementById('weekView');
    const monthViewBtn = document.getElementById('monthView');
    const body = document.body;
    const bgColorSelect = document.getElementById('bgColorSelect');
    const languageBtn = document.getElementById('languageBtn');

    let isPolish = true;
    const savedTheme = localStorage.getItem('theme');

if (savedTheme) {
    body.classList.add(savedTheme);
    const calendar = document.querySelector('.calendar');
    if (calendar) {
        calendar.classList.add(savedTheme);
    }
    updateCalendarStyles();
    bgColorSelect.value = savedTheme;
}

bgColorSelect.addEventListener('change', (event) => {
    const selectedMode = event.target.value;

    body.classList.remove('light-theme', 'dark-theme', 'yellow-black', 'black-yellow');
    body.classList.add(selectedMode);

    const calendar = document.querySelector('.calendar');
    if (calendar) {
        calendar.classList.remove('light-theme', 'dark-theme', 'yellow-black', 'black-yellow');
        calendar.classList.add(selectedMode);
    }

    updateCalendarStyles();

    localStorage.setItem('theme', selectedMode);
});

function updateCalendarStyles() {
    const calendarHeaders = document.querySelectorAll('.calendar th');
    const calendarCells = document.querySelectorAll('.calendar td');

    calendarHeaders.forEach(header => {
        header.style.backgroundColor = '';
        header.style.color = '';
    });

    calendarCells.forEach(cell => {
        cell.style.backgroundColor = '';
        cell.style.color = '';
    });
    if (body.classList.contains('light-theme')) {
        calendarHeaders.forEach(header => {
            header.style.backgroundColor = '#f0f0f0';
            header.style.color = '#000';
        });
        calendarCells.forEach(cell => {
            cell.style.backgroundColor = '#f0f0f0';
            cell.style.color = '#000';
        });
    } else if (body.classList.contains('dark-theme')) {
        calendarHeaders.forEach(header => {
            header.style.backgroundColor = '#333';
            header.style.color = 'white';
        });
        calendarCells.forEach(cell => {
            cell.style.backgroundColor = '#333';
            cell.style.color = 'white';
        });
    } else if (body.classList.contains('yellow-black')) {
        calendarHeaders.forEach(header => {
            header.style.backgroundColor = 'yellow';
            header.style.color = 'black';
        });
        calendarCells.forEach(cell => {
            cell.style.backgroundColor = 'yellow';
            cell.style.color = 'black';
        });
    } else if (body.classList.contains('black-yellow')) {
        calendarHeaders.forEach(header => {
            header.style.backgroundColor = 'black';
            header.style.color = 'yellow';
        });
        calendarCells.forEach(cell => {
            cell.style.backgroundColor = 'black';
            cell.style.color = 'yellow';
        });
    }
}

    languageBtn.addEventListener('click', () => {
        isPolish = !isPolish;
        updateLanguage();
    });

    document.getElementById('smallFontBtn').addEventListener('click', () => {
        body.style.fontSize = '12px'; // Set small font size
    });
    
    document.getElementById('mediumFontBtn').addEventListener('click', () => {
        body.style.fontSize = '16px'; // Set medium font size
    });
    
    document.getElementById('largeFontBtn').addEventListener('click', () => {
        body.style.fontSize = '20px'; // Set large font size
    });
    function updateLanguage() {
        const texts = {
            'dayView': isPolish ? 'Plan dnia' : 'Day Plan',
            'weekView': isPolish ? 'Tydzień' : 'Week',
            'monthView': isPolish ? 'Miesiąc' : 'Month',
            'searchBtn': isPolish ? 'Szukaj' : 'Search',
            'clearFiltersBtn': isPolish ? 'Wyczyść filtry' : 'Clear Filters',
            'lecturerLabel': isPolish ? 'Wykładowca' : 'Lecturer',
            'roomLabel': isPolish ? 'Sala' : 'Room',
            'subjectLabel': isPolish ? 'Przedmiot' : 'Subject',
            'groupLabel': isPolish ? 'Grupa' : 'Group',
            'studentIdLabel': isPolish ? 'Numer albumu' : 'Student ID',
            'bgColorBtn': isPolish ? 'Dobór koloru' : 'Pick color',
            'fontBtn': isPolish ? 'Zmiana czcionki' : 'Change font',
            'languageBtn': isPolish ? 'Eng' : 'PL',
            lecturerPlaceholder: isPolish ? 'Wpisz wykładowcę' : 'Enter lecturer',
            roomPlaceholder: isPolish ? 'Wpisz salę' : 'Enter room',
            subjectPlaceholder: isPolish ? 'Wpisz przedmiot' : 'Enter subject',
            groupPlaceholder: isPolish ? 'Wpisz grupę' : 'Enter group',
            studentIdPlaceholder: isPolish ? 'Wpisz numer albumu' : 'Enter student ID',
            dayGeneral: isPolish ? 'Plan dnia' : 'Day Plan',
            monthGeneral: isPolish ? 'Miesiąc' : 'Month',
            weekGeneral: isPolish ? 'Tydzień' : 'Week',
            daysOfWeek: isPolish
                ? ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            dayTableHeaders: isPolish ? ['Godzina', 'Opis'] : ['Hour', 'Description'],
            monthTableHeaders: isPolish
                ? ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz']
                : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        };
        for (const id in texts) {
            const element = document.getElementById(id);
            if (element) {
                element.textContent = texts[id];
            }
        }

        const weekTableHeaders = weekTable.querySelectorAll('thead tr th');
        texts.daysOfWeek.forEach((day, index) => {
            if (weekTableHeaders[index + 1]) {
                weekTableHeaders[index + 1].textContent = day;
            }
        });

        if (viewMode === 'week') {
            const weekRange = getWeekRange(currentDate);
            currentDateDisplay.textContent = `${texts.weekGeneral}: ${formatDate(weekRange.start)} - ${formatDate(weekRange.end)}`;
        }
        const dayTableHeaders = dayTable.querySelectorAll('thead tr th');
        texts.dayTableHeaders.forEach((header, index) => {
            if (dayTableHeaders[index]) {
                dayTableHeaders[index].textContent = header;
            }
        });
        const monthTableHeaders = monthTable.querySelectorAll('thead tr th');
        texts.monthTableHeaders.forEach((header, index) => {
            if (monthTableHeaders[index]) {
                monthTableHeaders[index].textContent = header;
            }
        });

        dayTable.style.display = 'none';
        weekTable.style.display = 'none';
        monthTable.style.display = 'none';

        if (viewMode === 'day') {
            currentDateDisplay.textContent = `${isPolish ? 'Plan dnia' : 'Day Plan'}: ${formatDate(currentDate)}`;
            dayTable.style.display = 'table';
        } else if (viewMode === 'week') {
            const weekRange = getWeekRange(currentDate);
            currentDateDisplay.textContent = `${isPolish ? 'Tydzień' : 'Week'}: ${formatDate(weekRange.start)} - ${formatDate(weekRange.end)}`;
            weekTable.style.display = 'table';
        } else if (viewMode === 'month') {
            currentDateDisplay.textContent = `${isPolish ? 'Miesiąc' : 'Month'}: ${currentDate.toLocaleDateString(isPolish ? 'pl-PL' : 'en-US', {
                month: 'long',
                year: 'numeric'
            })}`;
            monthTable.style.display = 'table';
        }


        document.getElementById('lecturer').placeholder = texts.lecturerPlaceholder;
        document.getElementById('room').placeholder = texts.roomPlaceholder;
        document.getElementById('subject').placeholder = texts.subjectPlaceholder;
        document.getElementById('group').placeholder = texts.groupPlaceholder;
        document.getElementById('studentId').placeholder = texts.studentIdPlaceholder;
        document.getElementById('dayView').textContent = texts['dayView'];
        document.getElementById('weekView').textContent = texts['weekView'];
        document.getElementById('monthView').textContent = texts['monthView'];
        document.getElementById('searchBtn').textContent = texts['searchBtn'];
        document.getElementById('clearFiltersBtn').textContent = texts['clearFiltersBtn'];
        document.getElementById('lecturerLabel').textContent = texts['lecturerLabel'];
        document.getElementById('roomLabel').textContent = texts['roomLabel'];
        document.getElementById('subjectLabel').textContent = texts['subjectLabel'];
        document.getElementById('groupLabel').textContent = texts['groupLabel'];
        document.getElementById('studentIdLabel').textContent = texts['studentIdLabel'];
        document.getElementById('bgColorBtn').textContent = texts['bgColorBtn'];
        document.getElementById('fontBtn').textContent = texts['fontBtn'];
        document.getElementById('languageBtn').textContent = texts['languageBtn'];
        document.getElementById('statistics').textContent = texts['statistics'];
        document.getElementById('semesterEndDate').textContent = texts['semesterEndDate'];

    }
    

    let viewMode = 'week';

    function updateCalendar() {
        dayTable.style.display = 'none';
        weekTable.style.display = 'none';
        monthTable.style.display = 'none';

        if (viewMode === 'day') {
            currentDateDisplay.textContent = `Data: ${formatDate(currentDate)}`;
            dayTable.style.display = 'table';
            renderDayTable(fetchedData);
        } else if (viewMode === 'week') {
            const weekRange = getWeekRange(currentDate);
            currentDateDisplay.textContent = `Tydzień: ${formatDate(weekRange.start)} - ${formatDate(weekRange.end)}`;
            weekTable.style.display = 'table';
            renderWeekTable(fetchedData, weekRange);
        } else if (viewMode === 'month') {
            currentDateDisplay.textContent = `Miesiąc: ${currentDate.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })}`;
            monthTable.style.display = 'table';
            renderMonthTable(fetchedData);
        }

        displayStatistics(fetchedData); // Wyświetlanie statystyk
        displaySemesterEndDate(); // Wyświetlanie daty zakończenia semestru
    }

    function getWeekRange(date) {
        const start = new Date(date);
        start.setDate(date.getDate() - (date.getDay() || 7) + 1); // Poniedziałek
        const end = new Date(start);
        end.setDate(start.getDate() + 6); // Niedziela
        return { start, end };
    }

    function formatDate(date) {
        return date.toLocaleDateString('pl-PL', { year: 'numeric', month: '2-digit', day: '2-digit' });
    }

    function fetchAndRenderData() {
        const lecturer = document.getElementById('lecturer').value;
        const room = document.getElementById('room').value;
        const subject = document.getElementById('subject').value;
        const group = document.getElementById('group').value;
        const albumNumber = document.getElementById('studentId').value;
    
        let url;
        if (albumNumber) {
            url = new URL('http://localhost:8000/album.php');
            url.searchParams.append('album', albumNumber);
        } else {
            url = new URL('http://localhost:8000/api.php');
            if (lecturer) url.searchParams.append('lecturer', lecturer);
            if (room) url.searchParams.append('room', room);
            if (subject) url.searchParams.append('subject', subject);
            if (group) url.searchParams.append('group', group);
        }
    
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Otrzymane dane:', data); // Debugowanie odpowiedzi
                fetchedData = data.data || []; // Ustawienie domyślnej wartości jako pusta tablica
                updateCalendar();
            })
            .catch(error => {
                console.error('Błąd:', error);
                fetchedData = []; // Domyślna wartość w przypadku błędu
                updateCalendar();
            });
    }

    // Renderowanie widoków kalendarza (dnia, tygodnia, miesiąca)
    function renderDayTable(data) {
        const tbody = dayTable.querySelector('tbody');
        tbody.innerHTML = '';

        const dayStart = new Date(currentDate).setHours(0, 0, 0, 0);
        const dayEnd = new Date(currentDate).setHours(23, 59, 59, 999);

        const filteredData = data.filter(event => {
            const eventStart = new Date(event.start_time).getTime();
            return eventStart >= dayStart && eventStart <= dayEnd;
        });

        if (filteredData.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 2;
            cell.textContent = 'Brak zajęć';
            row.appendChild(cell);
            tbody.appendChild(row);
            return;
        }

        filteredData.forEach(event => {
            const row = document.createElement('tr');
            const timeCell = document.createElement('td');
            const startTime = event.start_time ? event.start_time.split('T')[1].slice(0, 5) : 'Brak godziny';
            const endTime = event.end_time ? event.end_time.split('T')[1].slice(0, 5) : 'Brak godziny';
            timeCell.textContent = `${startTime} - ${endTime}`;
            row.appendChild(timeCell);

            const descCell = document.createElement('td');
            const subject = event.subject_name || 'Brak nazwy';
            const room = event.room_name || 'Brak sali';
            descCell.textContent = `${subject}, ${room}`;
            row.appendChild(descCell);

            tbody.appendChild(row);
        });
    }

    function renderWeekTable(data, weekRange) {
        const tbody = weekTable.querySelector('tbody');
        tbody.innerHTML = '';
    
        // Definicja okienek czasowych
        const timeSlots = [
            { slot: 1, startHour: 8, endHour: 10 },
            { slot: 2, startHour: 10, endHour: 12 },
            { slot: 3, startHour: 12, endHour: 14 },
            { slot: 4, startHour: 14, endHour: 16 },
            { slot: 5, startHour: 16, endHour: 18 },
            { slot: 6, startHour: 18, endHour: 20 }
        ];
        const days = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Niedz'];
    
        // Iteracja przez każde okienko
        for (const slot of timeSlots) {
            const row = document.createElement('tr');
            const slotCell = document.createElement('td');
            slotCell.textContent = slot.slot; // Wyświetlanie numeru okienka
            row.appendChild(slotCell);
    
            // Iteracja przez dni tygodnia
            for (let i = 0; i < days.length; i++) {
                const cell = document.createElement('td');
                const dayStart = new Date(weekRange.start);
                dayStart.setDate(dayStart.getDate() + i); // Przesunięcie o odpowiedni dzień tygodnia
                dayStart.setHours(slot.startHour, 0, 0, 0);
    
                const dayEnd = new Date(dayStart);
                dayEnd.setHours(slot.endHour, 0, 0, 0);
    
                // Filtrujemy zajęcia pasujące do przedziału czasowego
                const matchingEvents = data.filter(event => {
                    const eventStart = new Date(event.start_time);
                    const eventEnd = new Date(event.end_time);
                    return (
                        eventStart >= dayStart &&
                        eventEnd <= dayEnd
                    );
                });
    
                if (matchingEvents.length > 0) {
                    cell.innerHTML = matchingEvents
                        .map(event => {
                            const startTime = event.start_time ? event.start_time.split('T')[1].slice(0, 5) : 'Brak godziny';
                            const endTime = event.end_time ? event.end_time.split('T')[1].slice(0, 5) : 'Brak godziny';
                            const subject = event.subject_name || 'Brak nazwy';
                            const room = event.room_name || 'Brak sali';
                            return `${startTime}-${endTime}: ${subject} (${room})`;
                        })
                        .join('<br><hr>');
                } else {
                    cell.textContent = '-';
                }
    
                row.appendChild(cell);
            }
    
            tbody.appendChild(row);
        }
    }
    

    function renderMonthTable(data) {
        const tbody = monthTable.querySelector('tbody');
        tbody.innerHTML = '';

        const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
        const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

        let row = document.createElement('tr');
        for (let i = 0; i < adjustedFirstDay; i++) {
            const emptyCell = document.createElement('td');
            row.appendChild(emptyCell);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            if (row.children.length === 7) {
                tbody.appendChild(row);
                row = document.createElement('tr');
            }

            const cell = document.createElement('td');
            const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

            const matchingEvents = data.filter(event => {
                const eventStart = new Date(event.start_time);
                return (
                    eventStart.getFullYear() === date.getFullYear() &&
                    eventStart.getMonth() === date.getMonth() &&
                    eventStart.getDate() === day
                );
            });

            cell.innerHTML = `<strong>${day}</strong><br>` + matchingEvents
                .map(event => {
                    const startTime = event.start_time ? event.start_time.split('T')[1].slice(0, 5) : 'Brak godziny';
                    const endTime = event.end_time ? event.end_time.split('T')[1].slice(0, 5) : 'Brak godziny';
                    const subject = event.subject_name || 'Brak nazwy';
                    const room = event.room_name || 'Brak sali';
                    return `${startTime}-${endTime}: ${subject} (${room})`;
                })
                .join('<br>');
            row.appendChild(cell);
        }

        if (row.children.length > 0) {
            tbody.appendChild(row);
        }
    }

    function displayStatistics(data) {
        // Wyświetlanie liczby wydarzeń w danym okresie
        const totalEvents = data.length;
        document.getElementById('statistics').textContent = `Liczba zajęć: ${totalEvents}`;
    }

    function displaySemesterEndDate() {
        // Możesz dostosować tę datę w zależności od kalendarza akademickiego
        const semesterEndDate = new Date(currentDate.getFullYear(), 5, 30); // Przykładowa data: 30 czerwca
        const semesterEndDisplay = document.getElementById('semesterEndDate');
        semesterEndDisplay.textContent = `Semestr kończy się: ${formatDate(semesterEndDate)}`;
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
    const savePlanBtn = document.getElementById('savePlanBtn');
    
    savePlanBtn.addEventListener('click', () => {
        if (!fetchedData || fetchedData.length === 0) {
            alert('Brak danych do zapisania!');
            return;
        }
    
        let csvContent = 'data:text/csv;charset=utf-8,';
    
        if (viewMode === 'day') {
            // Plan dnia
            const dayStart = new Date(currentDate).setHours(0, 0, 0, 0);
            const dayEnd = new Date(currentDate).setHours(23, 59, 59, 999);
    
            const filteredData = fetchedData.filter(event => {
                const eventStart = new Date(event.start_time).getTime();
                return eventStart >= dayStart && eventStart <= dayEnd;
            });
    
            csvContent += filteredData.map(event =>
                `${event.start_time},${event.end_time},${event.subject_name},${event.room_name}`
            ).join('\n');
    
        } else if (viewMode === 'week') {
            // Plan tygodnia
            const weekRange = getWeekRange(currentDate);
            const filteredData = fetchedData.filter(event => {
                const eventStart = new Date(event.start_time).getTime();
                return eventStart >= weekRange.start.getTime() && eventStart <= weekRange.end.getTime();
            });
    
            csvContent += filteredData.map(event =>
                `${event.start_time},${event.end_time},${event.subject_name},${event.room_name}`
            ).join('\n');
    
        } else if (viewMode === 'month') {
            // Plan miesiąca
            const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getTime();
            const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getTime();
    
            const filteredData = fetchedData.filter(event => {
                const eventStart = new Date(event.start_time).getTime();
                return eventStart >= monthStart && eventStart <= monthEnd;
            });
    
            csvContent += filteredData.map(event =>
                `${event.start_time},${event.end_time},${event.subject_name},${event.room_name}`
            ).join('\n');
        }
    
        // Pobieranie pliku
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', `plan_${viewMode}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
    


    document.getElementById('searchBtn').addEventListener('click', fetchAndRenderData);

    updateCalendar();

    updateLanguage();
});
