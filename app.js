const fs = require('fs');
const express = require('express');
const app = express();
const path = 'participantes.json';
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

// Adicionar participante
app.post('/adicionar', (req, res) => {
    let participantes = [];
    if (fs.existsSync(path)) {
        participantes = JSON.parse(fs.readFileSync(path));
    }
    participantes.push(req.body.nome);
    fs.writeFileSync(path, JSON.stringify(participantes, null, 2));
    res.json({ mensagem: `${req.body.nome} foi adicionado!` });
});

// Realizar sorteio
app.get('/sortear', (req, res) => {
    if (!fs.existsSync(path)) {
        return res.json({ mensagem: "Nenhum participante cadastrado!" });
    }
    let participantes = JSON.parse(fs.readFileSync(path));
    if (participantes.length < 2) {
        return res.json({ mensagem: "É necessário pelo menos 2 participantes para o sorteio!" });
    }
    let sorteado = participantes[Math.floor(Math.random() * participantes.length)];
    res.json({ mensagem: `O amigo secreto sorteado foi: ${sorteado}` });
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));

// HTML + JavaScript no frontend (public/index.html)
/**
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Amigo Secreto</title>
</head>
<body>
    <input type="text" id="nome" placeholder="Digite o nome">
    <button onclick="adicionar()">Adicionar</button>
    <button onclick="sortear()">Sortear Amigo</button>

    <script>
        function adicionar() {
            const nome = document.getElementById('nome').value;
            fetch('/adicionar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome })
            }).then(res => res.json()).then(data => alert(data.mensagem));
        }

        function sortear() {
            fetch('/sortear')
                .then(res => res.json())
                .then(data => alert(data.mensagem));
        }
    </script>
</body>
</html>
**/
