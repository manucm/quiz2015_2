// GET /quizes/question
/*
exports.question = function(req, res) {
	console.log("entra");
	res.render('quizes/question', {pregunta: 'Capital de Italia'});
};

exports.answer = function(req, res) {
	if (req.query.respuesta === 'Roma') {
		res.render('quizes/answer', {respuesta : 'Correcto', title : 'Quiz'});
	} else {
		res.render('quizes/answer', {respuesta : 'Incorrecto', title : 'Quiz'});
	}
};
var models = require('../models/models.js');

// Utilizamos la base de datos de SQLite 
exports.question = function(req, res) {
	models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/question', {pregunta: quiz[0].pregunta});
	})
};

exports.answer = function(req, res) {
	models.Quiz.findAll().then(function(quiz) {
		if (req.query.respuesta === quiz[0].respuesta) {
			res.render('quizes/answer', {respuesta: 'Correcto'});
		} else {
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
		}
	});
}*/
var models = require('../models/models.js');

// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.findById(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			}
			else {
				next(new Error('No existe quizId= '+ quizId))
			}
		}
	).catch(function(error) {next(error);});
};

exports.show = function(req, res) {
		res.render('quizes/show', {quiz: req.quiz});
};

exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado});
};

exports.index = function(req, res) {
	models.Quiz.findAll().then(function(quizes) {
		res.render('quizes/index', {quizes: quizes});
	}).catch(function(error) {next(error);});
};



