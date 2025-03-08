const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const receitasRoutes = require('./routes/receitas');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Rotas
app.use('/receitas', receitasRoutes);

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
