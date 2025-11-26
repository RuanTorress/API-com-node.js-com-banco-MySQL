const express = require('express');
const app = express();
// Conexão com o banco (Sequelize) - usa o arquivo models/db.js
const { sequelize } = require('./models/db');

// Rotas para charts que buscam dados reais no banco
// Assunções: existem tabelas 'vendas', 'vendas_mensal' e 'usuarios' com colunas
// - vendas(categoria, quantidade)
// - vendas_mensal(mes, total)
// - usuarios(genero)

app.get('/chart/pizza', async (req, res) => {
  try {
    const [rows] = await sequelize.query("SELECT categoria AS label, quantidade AS value FROM vendas");
    const dados = {
      labels: rows.map(r => r.label),
      datasets: [{ data: rows.map(r => r.value) }]
    };
    res.json({ tipo: 'pizza', dados });
  } catch (err) {
    console.error('Erro /chart/pizza:', err);
    res.status(500).json({ error: 'Erro ao buscar dados para gráfico pizza' });
  }
});

app.get('/chart/linha', async (req, res) => {
  try {
    // ajustado para o nome da tabela no seu banco: `vendas_mensais`
    const [rows] = await sequelize.query("SELECT mes AS label, total AS value FROM vendas_mensais ORDER BY id ASC");
    const dados = {
      labels: rows.map(r => r.label),
      datasets: [{ label: 'Total mensal', data: rows.map(r => r.value) }]
    };
    res.json({ tipo: 'linha', dados });
  } catch (err) {
    console.error('Erro /chart/linha:', err);
    res.status(500).json({ error: 'Erro ao buscar dados para gráfico linha' });
  }
});

app.get('/chart/barra', async (req, res) => {
  try {
    // Para barra usamos as mesmas colunas de 'vendas' por categoria (pode ser outro SQL conforme seu esquema)
    const [rows] = await sequelize.query("SELECT categoria AS label, quantidade AS value FROM vendas ORDER BY quantidade DESC");
    const dados = {
      labels: rows.map(r => r.label),
      datasets: [{ label: 'Quantidade por categoria', data: rows.map(r => r.value) }]
    };
    res.json({ tipo: 'barra', dados });
  } catch (err) {
    console.error('Erro /chart/barra:', err);
    res.status(500).json({ error: 'Erro ao buscar dados para gráfico barra' });
  }
});

// Rota extra: pizza por usuários (exemplo solicitado)
app.get('/chart/pizzaUsuarios', async (req, res) => {
  try {
    // ajustado para a coluna `sexo` conforme seu schema
    const [rows] = await sequelize.query("SELECT sexo AS label, COUNT(*) AS value FROM usuarios GROUP BY sexo");
    const dados = {
      labels: rows.map(r => r.label),
      datasets: [{ data: rows.map(r => r.value) }]
    };
    // retorno consistente com os outros endpoints
    res.json({ tipo: 'pizzaUsuarios', dados });
  } catch (err) {
    console.error('Erro /chart/pizzaUsuarios:', err);
    res.status(500).json({ error: 'Erro ao buscar dados para pizzaUsuarios' });
  }
});

app.listen(8081,function(){
  console.log('Server is running on port 8081');
});