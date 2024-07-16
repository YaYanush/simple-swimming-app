document.addEventListener('DOMContentLoaded', () => {
    const lanes = {
        '1': { input: document.getElementById('input-1'), zawodnik: document.getElementById('zawodnik-1'), time: document.getElementById('czas-1'), interval: null },
        '2': { input: document.getElementById('input-2'), zawodnik: document.getElementById('zawodnik-2'), time: document.getElementById('czas-2'), interval: null },
        '3': { input: document.getElementById('input-3'), zawodnik: document.getElementById('zawodnik-3'), time: document.getElementById('czas-3'), interval: null },
        '4': { input: document.getElementById('input-4'), zawodnik: document.getElementById('zawodnik-4'), time: document.getElementById('czas-4'), interval: null },
        '5': { input: document.getElementById('input-5'), zawodnik: document.getElementById('zawodnik-5'), time: document.getElementById('czas-5'), interval: null },
    };

    Object.keys(lanes).forEach(tor => {
        console.log(tor)
        lanes[tor].input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const scanData = lanes[tor].input.value;
                lanes[tor].input.value = ''; // Clear input after scanning
                fetch('/scan', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ scanData, tor }),
                })
                .then(response => response.text())
                .then(message => {
                    alert(message);
                    updateLanesStatus();
                });
            }
        });
    });

    function updateLanesStatus() {
        fetch('/status')
            .then(response => response.json())
            .then(status => {
                Object.keys(status).forEach(tor => {
                    const lane = lanes[tor.split('_')[1]];
                    console.log(lane)
                    lane.zawodnik.textContent = status[tor].zawodnik || 'Brak zawodnika';
                    if (status[tor].startTime && !status[tor].endTime) {
                        if (!lane.interval) {
                            lane.interval = setInterval(() => {
                                const passedTime = new Date() - new Date(status[tor].startTime); 
                                const minutes = Math.floor(passedTime / 60000); //  milliseconds to mins + rounding 
                                const seconds = ((passedTime % 60000) / 1000).toFixed(2);
                                lane.time.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(5, '0')}`;
                            }, 100);
                        }
                    } else {
                        clearInterval(lane.interval);
                        lane.interval = null;
                        lane.time.textContent = '00:00.00';
                    }
                });
            });
    }

    updateLanesStatus();
});
