function agenda(container) {

    container.innerHTML = '';


    const month = new Array();
    month[0] = "Jan";
    month[1] = "Feb";
    month[2] = "Mar";
    month[3] = "Apr";
    month[4] = "May";
    month[5] = "Jun";
    month[6] = "Jul";
    month[7] = "Aug";
    month[8] = "Sep";
    month[9] = "Oct";
    month[10] = "Nov";
    month[11] = "Dec";


    const hoursMap = {
        "8:00": 1,
        "8:30": 2,
        "9:00": 3,
        "9:30": 4,
        "10:00": 5,
        "10:30": 6,
        "11:00": 7,
        "11:30": 8,
        "12:00": 9,
        "12:30": 10,
        "13:00": 11,
        "13:30": 12,
        "14:00": 13,
        "14:30": 14,
        "15:00": 15,
        "15:30": 16,
        "16:00": 17,
        "16:30": 18,
        "17:00": 19,
        "17:30": 20,
        "18:00": 21,
        "18:30": 22,
        "19:00": 23,
        "19:30": 24,
        "20:00": 25,
        "20:30": 26,
        "21:00": 27,
        "21:30": 28
    }

    const hoursMapRev = {
        1: "8:00",
        2: "8:30",
        3: "9:00",
        4: "9:30",
        5: "10:00",
        6: "10:30",
        7: "11:00",
        8: "11:30",
        9: "12:00",
        10: "12:30",
        11: "13:00",
        12: "13:30",
        13: "14:00",
        14: "14:30",
        15: "15:00",
        16: "15:30",
        17: "16:00",
        18: "16:30",
        19: "17:00",
        20: "17:30",
        21: "18:00",
        22: "18:30",
        23: "19:00",
        24: "19:30",
        25: "20:00",
        26: "20:30",
        27: "21:00",
        28: "21:30"
    }

    const daysOfWeek = {
        1: "Mon",
        2: "Tue",
        3: "Wed",
        4: "Thu",
        5: "Fri",
        6: "Sat",
        0: "Sun"
    }

    // ================ CREATE AGENDA ================

    let title = document.createElement('h5');
    title.classList.add('secondary-text-color');
    title.textContent = 'AGENDA';
    container.appendChild(title);

    // ---- Calendars selection hardcoded ----
    let calendarSelector = document.createElement('select');
    // calendarSelector.classList.add('list-inline', 'accent-color', 'z-depth-1');
    calendarSelector.classList.add('browser-default');
    calendarSelector.setAttribute('id', 'venue-select');
    calendarSelector.style.borderStyle = 'solid';
    calendarSelector.style.borderColor = '#FFC107';
    let calendar1 = document.createElement('option');
    calendar1.textContent = 'Personal Calendar 1';
    calendar1.style.margin = '2px';
    let calendar2 = document.createElement('option');
    calendar2.textContent = 'Personal Calendar 2';
    let roomReserveCalendar = document.createElement('option');
    roomReserveCalendar.textContent = 'Room reservations';
    calendarSelector.appendChild(calendar1);
    calendarSelector.appendChild(calendar2);
    calendarSelector.appendChild(roomReserveCalendar);
    container.appendChild(calendarSelector);

    // ---- Add select calendars menu ---- 
    addCalendarListener(calendarSelector);
    
    // ---- Build table ----
    let agenda = document.createElement('table');
    agenda.classList.add('z-depth-2');
    agenda.style.border = '1px solid grey'
    agenda.style.backgroundColor = '#fff';

    let dateField = new Date();
    let monthNr = dateField.getMonth();
    let year = dateField.getFullYear();


    // ---- Select Period Buttons and Year-Month Field -----
    let backBtn = document.createElement('button');
    backBtn.setAttribute('class', 'btn btn-outline-info')
    backBtn.textContent = '<--';
    let forwardBtn = document.createElement('button');
    forwardBtn.setAttribute('class', 'btn btn-outline-info')
    forwardBtn.textContent = '-->';
    let yearMonthField = document.createElement('span');
    yearMonthField.classList.add('yearMonth');
    yearMonthField.style.paddingRight = '10px';
    yearMonthField.style.paddingLeft = '10px';
    yearMonthField.textContent = `${year}/${monthNr + 1}`;
    let backForwardPanel = document.createElement('div');
    backForwardPanel.setAttribute('id', 'back-forward');
    backForwardPanel.style.padding = '3px';
    backForwardPanel.appendChild(backBtn);
    backForwardPanel.appendChild(yearMonthField);
    backForwardPanel.appendChild(forwardBtn);
    container.appendChild(backForwardPanel);
    // ---- End Select Period Buttons -----


    buildHours(agenda, month, monthNr, year);
    buildDates(agenda, hoursMapRev, daysOfWeek, monthNr, year);
    buildHours(agenda, month, monthNr, year);

    loadBookings(calendar1.textContent);

    container.appendChild(agenda);


    // ---- Back-Forward Click Events -----
    backBtn.addEventListener('click', e => {
        e.preventDefault();
        agenda.innerHTML = '';
        monthNr--;
        if (monthNr < 0) {
            year--;
            monthNr = 11;
        }
        yearMonthField.textContent = `${year}/${monthNr + 1}`;
        buildHours(agenda, month, monthNr, year);
        buildDates(agenda, hoursMapRev, daysOfWeek, monthNr, year);
        buildHours(agenda, month, monthNr, year);
        addCalendarListener(document.getElementById('venue-select'));
        loadBookings(document.getElementById('venue-select').value);
    });

    forwardBtn.addEventListener('click', e => {
        e.preventDefault();
        agenda.innerHTML = '';
        monthNr++;
        if (monthNr > 11) {
            year++;
            monthNr = 0;
        }
        yearMonthField.textContent = `${year}/${monthNr + 1}`;
        buildHours(agenda, month, monthNr, year);
        buildDates(agenda, hoursMapRev, daysOfWeek, monthNr, year);
        buildHours(agenda, month, monthNr, year);
        addVenueListener(document.getElementById('venue-select'));
        loadBookings(document.getElementById('venue-select').value);
    });
    // ---- End Back-Forward Click Events -----



    // ---------- Fetch Bookings and write them into the table -------------
    async function loadBookings(venue) {

        let response = await fetch(
            `http://localhost:8080/schedule/${year}-${monthNr + 1}-${venue}`)
            .then(response => response.json())
            .then(data => {

                console.log(data);

                // ------------ Iterate over Events ------------

                for (let i = 0; i < data.length; i++) {
                    let date = data[i].begin;
                    let begin = data[i].beginTime;
                    let end = data[i].endTime;

                    if (begin.length < 5) { begin += '0'; }   // ---- Add zero to zero minutes etc. - Stupid!!
                    if (end.length < 5) { end += '0'; }
                    if (parseInt(date.slice(date.length - 2)) < 10) {
                        date = date.slice(date.length - 1);
                    } else {
                        date = date.slice(date.length - 2);
                    }                                         // ---- End zeros formatting


                    if (date != null && begin != null) {
                        console.log(`${date}-${begin}`);
                        console.log(`${data.id}`)   // ---- Check dateTime ----
                        let currentTd = document.getElementById(`${date}-${begin}`);
                        let div = document.createElement('div');
                        div.textContent = `${data[i].eventType}`;
                        div.classList.add('truncate');
                        div.setAttribute('title', `${data[i].holder}`);
                        currentTd.appendChild(div);

                        let colspan = hoursMap[`${end}`] - hoursMap[`${begin}`];
                        currentTd.setAttribute('colspan', colspan);


                        // ------ Set chart colors -------
                        let currentBgColor = currentTd.style.backgroundColor;
                        if (data[i].eventType === 'COMMERCIAL') {
                            currentBgColor = 'salmon';
                        } else if (data[i].eventType === 'HOUSE') {
                            currentBgColor = 'blanchedalmond';
                        } else if (data[i].eventType === 'CHARITY') {
                            currentBgColor = 'lightblue';
                        }


                        currentTd.style.backgroundColor = currentBgColor;


                        // --- Remove cells from behind after colspan change ---
                        for (let k = 0; k < colspan - 1; k++) {
                            currentTd.parentElement.lastElementChild.remove();
                        }
                    }

                }
                // ----------- End iterate over Bookings -----
            })
            .catch(error => {
                console.log(error);
            });

        return response;
    }

    //  ============== END Create Agenda ===============



    //  ---- Make booking by picking dates from agenda -----------------------

    let beginBooking = '';
    let endBooking = '';

    makeBooking();

    function makeBooking() {
        agenda.addEventListener('click', (e) => {
            e.preventDefault();

            beginBooking = pickCell(agenda, e);

            if (beginBooking === '') {
                makeBooking();

            } else {
                continueBooking(e.target.id, beginBooking);
            }
        });
    }


    function continueBooking(id, beginBooking) {
        agenda.addEventListener('click', (e) => {

            endBooking = pickCell(agenda, e);

            if (endBooking === '') {
                continueBooking();

            } else {
                // --------  Color selected cells ----------
                let length = hoursMap[e.target.id.slice(e.target.id.indexOf('-') + 1)] - hoursMap[id.slice(id.indexOf('-') + 1)];
                let coloredTd = document.getElementById(id);
                colorCells(coloredTd, length, '#aadbf1')

                console.log('I finally got both dates! Hurra!!');
                let form = document.getElementById('booking-form-hidden');
                form.style.display = 'block';


                document.getElementById('submit-booking').addEventListener('click', (e) => {

                    e.preventDefault();

                    let [holder, purpose, email, phone, bookingType] = document.querySelectorAll('.data-cell');
                    
                    let object = {
                        "venueName": 'void',
                        "bookingType": bookingType.value,
                        "holderName": holder.value,
                        "purpose": purpose.value,
                        "email": email.value,
                        "phone": phone.value,
                        "begin": beginBooking,
                        "end": endBooking
                    }

                    fetch('http://localhost:8080/bookings/book', {
                        method: "POST",
                        body: JSON.stringify(object),
                        headers: { "Content-type": "application/json; charset=UTF-8" }
                    })
                        .then(response => response.text())
                        .then(text => console.log(text))
                        .catch (err => console.log(err));


                    beginBooking = '';
                    endBooking = '';
                });

            }
        });

    }

    function addCalendarListener(calendarSelector) {
        calendarSelector.addEventListener('change', (e) => {
            agenda.innerHTML = '';
            buildHours(agenda, month, monthNr, year);
            buildDates(agenda, hoursMapRev, daysOfWeek, monthNr, year);
            buildHours(agenda, month, monthNr, year);
            loadBookings(calendarSelector.value);
        });
    }
}


function addCalendarListener(venuesSelector) {
    venuesSelector.addEventListener('change', (e) => {
        loadBookings(venuesSelector.value);
    });
}


function colorCells(cell, length, color) {
    for (let h = 0; h < length + 1; h++) {
                    cell.style.backgroundColor = color;
                    cell = cell.nextElementSibling;
                }
}


function buildHours(agenda, month, monthNr, year) {   // ---- With MONTH field ----

    firstRow = document.createElement('tr');
    firstRow.style.border = '1px solid teal';
    firstRow.style.fontSize = '11px';
    firstRow.style.color = 'teal';
    firstRow.classList.add('first-row');

    let monthField = document.createElement('td');
    monthField.innerHTML = `<strong>${month[monthNr]}</strong>`;
    firstRow.appendChild(monthField);

    for (let i = 8; i <= 21; i++) {

        let tdHour = document.createElement('td');
        tdHour.innerHTML = `<strong>${i}</strong>`;
        tdHour.style.borderLeft = '2px solid pink';
        tdHour.style.paddingLeft = '3px';
        tdHour.style.paddingRight = '3px';

        firstRow.appendChild(tdHour);

        let tdHalfHour = document.createElement('td');
        tdHalfHour.style.fontSize = '9px';
        tdHalfHour.innerHTML = `30`;
        tdHalfHour.style.paddingLeft = '3px';
        tdHalfHour.style.paddingRight = '3px';

        firstRow.appendChild(tdHalfHour);
    }

    agenda.appendChild(firstRow);
}


function buildDates(agenda, hoursMapRev, daysOfWeek, monthNr, year) {
    let weekDay = new Date(year, monthNr, 1).getDay();

    for (let i = 1; i <= daysInMonth(monthNr, year); i++) {
        let trDate = document.createElement('tr');

        let tdDate = document.createElement('td');
        tdDate.style.fontSize = '11px';
        tdDate.style.padding = '2px';
        tdDate.classList.add('first-column');
        tdDate.innerHTML = `<strong>${i},</strong> ${daysOfWeek[weekDay]}`;

        if (isWeekend(weekDay)) {
            tdDate.style.backgroundColor = 'red lighten-5';
        }

        trDate.appendChild(tdDate);

        buildCells(trDate, i, hoursMapRev, weekDay);

        agenda.appendChild(trDate);

        if (weekDay === 6) {
            weekDay = 0;
        } else {
            weekDay++;
        }
    }

    function buildCells(tr, i, hoursMapRev, weekDay) {
        for (let j = 1; j <= 28; j++) {
            let indexedTd = document.createElement('td');
            indexedTd.style.border = '1px solid teal';
            indexedTd.style.padding = '2px';
            indexedTd.style.maxWidth = '17px';
            if (isWeekend(weekDay)) {
                indexedTd.setAttribute('class', 'red lighten-5');
            }
            indexedTd.setAttribute('id', `${i}-${hoursMapRev[j]}`);
            tr.appendChild(indexedTd);
        }
    }
}


function daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
}


function isWeekend(weekDay) {
    return weekDay === 6 || weekDay === 0;
}


function pickCell(agenda, e) {
    let dateTime = '';

    if (!e.target.parentElement.classList.contains('first-row') && !e.target.classList.contains('first-column')) {

        // ---- Select "first date" cell
        dateTime = readDateTime(e);
    }

    return dateTime;
}


function readDateTime(e) {
    let day = e.target.id.slice(0, e.target.id.indexOf('-'));
    day = setZero(day);                                                 // Set zero for one-place-day
    let time = e.target.id.slice((e.target.id.indexOf('-') + 1));
    let yearMonth = document.querySelector('.yearMonth').textContent;
    let year = yearMonth.slice(0, yearMonth.indexOf('/'));
    let month = yearMonth.slice(yearMonth.indexOf('/') + 1);
    month = setZero(month);                                               // Set zero for one-place-month
    let currentDateTime = `${year}-${month}-${day} ${time}:00`;

    return currentDateTime;
}

function setZero(num) {
    if (num.length === 1) {               // Set zero for one-place-number
        num = `0${num}`;
    }
    return num;
}