const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'chave-secreta-agenda-escolar-2025';

app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const DB_FILE = path.join(__dirname, 'users.json');
const DATA_FILE = path.join(__dirname, 'userdata.json');

if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, JSON.stringify([]));
}

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({}));
}

function getUsers() {
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
}

function saveUsers(users) {
    fs.writeFileSync(DB_FILE, JSON.stringify(users, null, 2));
}

function getUserData() {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

function saveUserData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function verificarToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
    }
    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.userId = decoded.id;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Token inválido' });
    }
}

app.post('/api/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' });
        }
        const users = getUsers();
        const userExists = users.find(u => u.email === email);
        if (userExists) {
            return res.status(400).json({ error: 'Este email já está registado' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = { id: Date.now(), email: email, password: hashedPassword, createdAt: new Date().toISOString() };
        users.push(newUser);
        saveUsers(users);
        const allData = getUserData();
        allData[newUser.id] = { aulas: [], tarefas: [] };
        saveUserData(allData);
        res.status(201).json({ message: 'Utilizador registado com sucesso!' });
    } catch (error) {
        console.error('Erro no registo:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email e password são obrigatórios' });
        }
        const users = getUsers();
        const user = users.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ error: 'Email ou password incorretos' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Email ou password incorretos' });
        }
        const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '24h' });
        res.json({ message: 'Login bem-sucedido!', token: token, email: user.email });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.get('/api/verify', verificarToken, (req, res) => {
    res.json({ valid: true, userId: req.userId });
});

app.post('/api/aulas', verificarToken, (req, res) => {
    try {
        const { aulas } = req.body;
        const allData = getUserData();
        if (!allData[req.userId]) {
            allData[req.userId] = { aulas: [], tarefas: [] };
        }
        allData[req.userId].aulas = aulas;
        saveUserData(allData);
        res.json({ message: 'Aulas guardadas com sucesso!' });
    } catch (error) {
        console.error('Erro ao guardar aulas:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.get('/api/aulas', verificarToken, (req, res) => {
    try {
        const allData = getUserData();
        const userAulas = allData[req.userId]?.aulas || [];
        res.json({ aulas: userAulas });
    } catch (error) {
        console.error('Erro ao obter aulas:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.post('/api/tarefas', verificarToken, (req, res) => {
    try {
        const { tarefas } = req.body;
        const allData = getUserData();
        if (!allData[req.userId]) {
            allData[req.userId] = { aulas: [], tarefas: [] };
        }
        allData[req.userId].tarefas = tarefas;
        saveUserData(allData);
        res.json({ message: 'Tarefas guardadas com sucesso!' });
    } catch (error) {
        console.error('Erro ao guardar tarefas:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.get('/api/tarefas', verificarToken, (req, res) => {
    try {
        const allData = getUserData();
        const userTarefas = allData[req.userId]?.tarefas || [];
        res.json({ tarefas: userTarefas });
    } catch (error) {
        console.error('Erro ao obter tarefas:', error);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

app.listen(PORT, () => {
    console.log('Servidor a correr em http://localhost:3000');
});
