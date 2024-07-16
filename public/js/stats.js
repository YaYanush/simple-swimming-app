document.addEventListener('DOMContentLoaded', () => {
    const statsTableBody = document.getElementById('stats-table-body');

    fetch('/history')
        .then(response => response.json())
        .then(history => {
            history.forEach(entry => {
                const row = document.createElement('tr');

                const torCell = document.createElement('td');
                torCell.textContent = entry.tor;
                row.appendChild(torCell);

                const zawodnikCell = document.createElement('td');
                zawodnikCell.textContent = entry.zawodnik;
                row.appendChild(zawodnikCell);

                const startTimeCell = document.createElement('td');
                startTimeCell.textContent = new Date(entry.startTime).toLocaleString();
                row.appendChild(startTimeCell);

                const endTimeCell = document.createElement('td');
                if (entry.endTime) {
                    endTimeCell.textContent = new Date(entry.endTime).toLocaleString();
                    row.appendChild(endTimeCell);

                    const measurementCell = document.createElement('td');
                    measurementCell.textContent = 'Pomiar zakończony';
                    row.appendChild(measurementCell);

                    const elapsedTimeCell = document.createElement('td');
                    elapsedTimeCell.textContent = entry.finalTime;
                    row.appendChild(elapsedTimeCell);
                } else{
                    //dorobić 
                    endTimeCell.textContent = 'Trwa pomiar';
                    row.appendChild(endTimeCell);

                    const measurementCell = document.createElement('td');
                    measurementCell.textContent = 'Trwa pomiar';
                    row.appendChild(measurementCell);

                    const elapsedTimeCell = document.createElement('td');
                    elapsedTimeCell.textContent = 'Brak danych';
                    row.appendChild(elapsedTimeCell);
                }

                statsTableBody.appendChild(row);
            });
        });
});
