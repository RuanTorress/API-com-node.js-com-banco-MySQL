const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('cadastro', 'root', '123456', {
    host: 'localhost',
    dialect: 'mysql'
});

sequelize.authenticate().then(() => {
    console.log('Conexão com o banco de dados realizada com sucesso.');
}).catch(err => {
    console.error('Não foi possível conectar ao banco de dados:', err);
});

module.exports = {
    Sequelize: Sequelize,
    sequelize: sequelize
}