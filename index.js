const express = require('express');
const app = express();
const http = require('http');
const path = require('path')
const PORT = process.env.PORT || 3000;
const WebSocket = require('ws');

app.set('view engine', 'ejs')
app.use(express.static('public'))

const server = http.createServer(app);

// Array to store all the connected clients
const clients = [];

app.get('/', (req, res) => {
    res.render('index');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

const wss = new WebSocket.Server({ port: 8181 });

wss.on('connection', function connection(ws) {
    clients.push(ws);
    ws.on('message', function incoming(message) {
        console.log('received: %s', message);
        //ws.send(`Echo: ${message}`);
        clients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message.toString());
            }
        });
    });

    ws.on('close', () => {
        // Remove the client from the array when it disconnects
        const index = clients.indexOf(ws);
        if (index > -1) {
            clients.splice(index, 1);
        } 
    });
    
    ws.send('Welcome to the chat!');
});

