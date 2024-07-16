const express = require('express');
const app = express();
const port = 3000;

let torStatus = {};
let history = [];

for (let i = 1; i <= 5; i++) {
    torStatus[`TOR_${i}`] = {
        zawodnik: null,
        startTime: null,
        endTime: null
    };
}

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/scan', (req, res) => {
    const { scanData, tor } = req.body;
    handleScan(scanData, tor, res);
});

app.get('/status', (req, res) => {
    res.json(torStatus);
});

app.get('/history', (req, res) => {
    res.json(history);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

function handleScan(scanData, tor, res) {
    const [id, data, command] = scanData.split('_');
    const torKey = `TOR_${tor}`;
    if (id === 'ZAW') {
        registerZawodnik(data, torKey, res);
    } else if (id === 'TOR') {
        handleTorCommand(torKey, command, res);
    } else {
        res.status(400).send('Invalid scan data');
    }
}

function registerZawodnik(zawodnik, torKey, res) {
    if (torStatus[torKey].zawodnik) {
        torStatus[torKey].zawodnik = zawodnik;
        console.log(torKey);
        res.send(`Na torze ${torKey.split('_')[1]} został zamieniony zawodnik ${torStatus[torKey].zawodnik}`);
    } else {
        torStatus[torKey].zawodnik = zawodnik;
        res.send(`Zawodnik ${zawodnik} zarejestrowany na torze ${torKey.split('_')[1]}`);
    }
}

function handleTorCommand(tor, command, res) {
    if (!torStatus[tor].zawodnik) {
        res.send('Brak zawodnika na torze, zarejestruj zawodnika');
        return;
    }
    if (command === 'START') {
        torStatus[tor].startTime = new Date();
        torStatus[tor].endTime = null;
        res.send(`Start na torze ${tor.split('_')[1]}`);
    } else if (command === 'STOP') {
        if (!torStatus[tor].startTime) {
            res.send('Na torze nie ma zawodnika');
            return;
        }
        torStatus[tor].endTime = new Date();
        const historyEntry = {
            tor: tor.split('_')[1],
            zawodnik: torStatus[tor].zawodnik,
            startTime: torStatus[tor].startTime,
            endTime: torStatus[tor].endTime,
            finalTime: calculateElapsedTime(torStatus[tor].startTime, torStatus[tor].endTime)
        };
        history.push(historyEntry);
        res.send(`Stop na torze ${tor.split('_')[1]}`);
    } else {
        res.status(400).send('Invalid command');
    }
}

function calculateElapsedTime(startTime, endTime) {
    const elapsed = new Date(endTime) - new Date(startTime);
    const minutes = Math.floor(elapsed / 60000);
    const seconds = ((elapsed % 60000) / 1000).toFixed(2);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(5, '0')}`;
}
