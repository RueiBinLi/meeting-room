const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/update-json', (req, res) => {
    const newData = req.body;
    const filePath = path.join(__dirname, '/json/users.json');
    console.log(filePath)

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let jsonData;
        try {
            jsonData = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }

        jsonData.push(newData);

        fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).send('Error writing file');
            }

            console.log('JSON data updated successfully');
            res.send('JSON data updated successfully');
        });
    });
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 's10959039@gm2.nutn.edu.tw',
        pass: 'swapsphere12'
    }
});

let email;

app.post('/send-email', (req, res) => {
    email = req.body.email;
    const randomCode = generateRandomCode(6);

    const mailOptions = {
        from: 's10959039@gm2.nutn.edu.tw',
        to: email,
        subject: '會議室預約系統 一次性驗證碼通知',
        text: `您的驗證碼為: ${randomCode}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email');
        } else {
            console.log('Email sent:', info.response);

            filePath = path.join(__dirname, '/json/users.json');

            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error('Error reading file:', err);
                    return res.status(500).send('Error reading file');
                }

                let users;
                try {
                    users = JSON.parse(data);
                } catch (parseError) {
                    console.error('Error parsing JSON:', parseError);
                    return res.status(500).send('Error parsing JSON');
                }

                let user = users.find(user => user.email === email);
                if (user) {
                    user.verificationCode = randomCode;
                } else {
                    users.push({ email: email, verificationCode: randomCode });
                }


                fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
                    if (writeErr) {
                        console.error('Error writing file:', writeErr);
                        return res.status(500).send('Error writing file');
                    }

                    console.log('Verification code saved successfully');
                    return res.json({ code: randomCode });
                });
            });
        }
    });
});

function generateRandomCode(length) {
    const charset = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let randomCode = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomCode += charset[randomIndex];
    }

    return randomCode;
}

app.post('/reset-password', (req, res) => {
    const { code, newPassword } = req.body;

    // Path to the JSON file
    const filePath = path.join(__dirname, 'json', 'users.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let users;
        try {
            users = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }

        const userWithEmail = users.find(user => user.verificationCode === code);
        const email = userWithEmail ? userWithEmail.email : undefined;

        if (!email) {
            return res.status(400).send('Invalid verification code');
        }

        const user = users.find(user => user.email === email);
        if (user) {
            user.password = newPassword;
            user.verificationCode = '';
        } else {
            return res.status(400).send('User not found');
        }

        fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).send('Error writing file');
            }

            console.log('Password updated successfully');
            return res.send('Password updated successfully');
        });
    });
});

app.post('/update-room-reservation-status', (req, res) => {
    const { room, date, startTime, endTime, status } = req.body;
    const filePath = path.join(__dirname, 'json/room_reservation.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let reservations = JSON.parse(data);


        reservations.forEach(reservation => {
            if (reservation.room === room && reservation.date === date && reservation.startTime === startTime && reservation.endTime === endTime) {
                reservation.status = status;
            }
        })

        fs.writeFile(filePath, JSON.stringify(reservations, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Error writing file');
            }

            res.json({ message: 'Status updated successfully' });
        });
    });
});

app.post('/delete-room-reservation', (req, res) => {
    const { room, date, startTime, endTime, status } = req.body;
    const filePath = path.join(__dirname, 'json/room_reservation.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let reservations = JSON.parse(data);


        // reservations.forEach(reservation => {
        //     if (reservation.room === room && reservation.date === date && reservation.startTime === startTime && reservation.endTime === endTime) {
        //         reservation.status = status;
        //     }
        // })

        fs.writeFile(filePath, JSON.stringify(reservations, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Error writing file');
            }

            res.json({ message: 'Status updated successfully' });
        });
    });
});

app.post('/delete-equip-reservation', (req, res) => {
    const { room, date, startTime, endTime, status } = req.body;
    const filePath = path.join(__dirname, 'json/equip_reservation.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let reservations = JSON.parse(data);


        // reservations.forEach(reservation => {
        //     if (reservation.room === room && reservation.date === date && reservation.startTime === startTime && reservation.endTime === endTime) {
        //         reservation.status = status;
        //     }
        // })

        fs.writeFile(filePath, JSON.stringify(reservations, null, 2), (err) => {
            if (err) {
                console.error('Error writing file:', err);
                return res.status(500).send('Error writing file');
            }

            res.json({ message: 'Status updated successfully' });
        });
    });
});

app.get('/room-reservation', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'room_reservation.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const reservations = JSON.parse(data);
            res.json(reservations);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/equip-reservation', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'equip_reservation.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const reservations = JSON.parse(data);
            res.json(reservations);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/user', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'users.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const reservations = JSON.parse(data);
            res.json(reservations);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/meeting-room', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'meeting_room.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const reservations = JSON.parse(data);
            res.json(reservations);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }
    });
});

app.get('/equipment', (req, res) => {
    const filePath = path.join(__dirname, 'json', 'equipment.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        try {
            const reservations = JSON.parse(data);
            res.json(reservations);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }
    });
});

app.post('/update-meeting-room', (req, res) => {
    const updatedRoom = req.body;

    const filePath = path.join(__dirname, 'json', 'room_reservation.json');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).send('Error reading file');
        }

        let rooms;
        try {
            rooms = JSON.parse(data);
        } catch (parseError) {
            console.error('Error parsing JSON:', parseError);
            return res.status(500).send('Error parsing JSON');
        }

        rooms.push(updatedRoom);

        fs.writeFile(filePath, JSON.stringify(rooms, null, 2), 'utf8', (writeErr) => {
            if (writeErr) {
                console.error('Error writing file:', writeErr);
                return res.status(500).send('Error writing file');
            }

            console.log('Room updated successfully');
            return res.send('Room updated successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
