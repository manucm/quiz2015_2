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
		res.render('quizes/show', {quiz: req.quiz, errors: []});
};

exports.answer = function(req, res) {
	var resultado = 'Incorrecto';
		if (req.query.respuesta === req.quiz.respuesta) {
			resultado = 'Correcto';
		}
		res.render('quizes/answer',{quiz: req.quiz, respuesta: resultado, errors: []});
};

exports.index = function(req, res) {
	// Comprobamos si la petición get incluye el envío del 
	// parámetro get
	var search = req.query.search;
	if (search) {
		models.Quiz.findAll({where: ["pregunta like ?", '%'+search+'%']}).then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);});
	} else {
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index', {quizes: quizes, errors: []});
		}).catch(function(error) {next(error);});
	}
};

// GET /quizes/new 
exports.new = function(req, res) {
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta", tematica: "Tematica"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build( req.body.quiz );

	quiz
	.validate()
	.then(function(err) {
		if (err) {
			res.render('quizes/new', {quiz: quiz, errors: err.errors});
		} else {
			// guarda en DB los campso pregunta y respuesta de quiz
			quiz
			.save({fields: ["pregunta", "respuesta", "tematica"]})
			.then(function() {
				res.redirect('/quizes');
			});  // res.redirect: Redirección HTTP a lista de preguntas
		}
	});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // a través de autoload de instancia de quiz

	res.render('quizes/edit', {quiz:req.quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	req.quiz.tematica = req.body.quiz.tematica;

	req.quiz
	.validate()
	.then(function(err) {
		if (err) {
			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
		} else {
			req.quiz
			.save( {fields: ["pregunta", "respuesta", "tematica"]})
			.then( function() {res.redirect('/quizes');}); // Redirección HTTP a lista de preguntas (URL relativo)
		}
	});
};

// DELETE / quizes/:id 
exports.destroy = function(req, res) {
	req.quiz.destroy()
	.then( function() {
		res.redirect( '/quizes');
	}).catch(function(error) {next(error)});
};



