var path = require('path');

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite
var sequelize = new Sequelize(null, null, null,
								{dialect:"sqlite", storage:"quiz.sqlite"}
							);

// Importar la definición de la tabla Quiz en quiz
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

exports.Quiz = Quiz; // exportar la definición de la tabla Quiz
// sequelize.sync() crea e inicializa tabla de preguntas de DB
sequelize.sync().then(function(){
	Quiz.count().then(function(count) {
		if (count === 0) {
			Quiz.create({pregunta: 'Capital de Italia',
						 respuesta: 'Roma'}).then(function(){console.log('Base de datos inicializada')});
		};
	});
});