var models = require('../models/models.js');

promedio = function(a, b) {

	if (a==0 || b==0)
		return 0;
	return (a/b);
}

exports.information = function(req, res) {

	var _information = {
		numero_de_preguntas:0,
		numero_de_comentarios:0,
		numero_de_comentarios_publicados: 0,
		numero_de_preguntas_sin_comentarios: 0,
		numero_de_preguntas_con_comentario:0
	};
	// Recopilamos toda la informacion

	models.Quiz.count().then(function(result) {
		_information.numero_de_preguntas= result;
		return models.Comment.count().then(function(result) {
			_information.numero_de_comentarios = result;
			return models.Comment.countUnpublished().then(function(result) {
			_information.numero_de_comentarios_publicados = result.count;
			_information.numero_medio_de_comentarios_por_pregunta = promedio(_information.numero_de_comentarios, _information.numero_de_preguntas);

			return models.Comment.countCommentQuizes().then(function(count) {
				_information.numero_de_preguntas_con_comentario = count;
				_information.numero_de_preguntas_sin_comentarios = _information.numero_de_preguntas - _information.numero_de_preguntas_con_comentario;
				res.render('stadistics/index', {info: _information, errors:[]});
			});
		});
		





			
		});
		
	});


	
/*
	// Numero de comentarios totales
	models.Comment.count().then(function(result) {
		
	})*/

	

};


/* Con promiseall

 4var statsData = {};
 5
 6exports.obtainData = function(req, res, next) {
 7//Se ha usado el método all de Promises (implementado ya en sequelize), ya que
 8//de esta forma se ejecutan las consultas asíncronamente en paralelo y se
 9//continúa cuando han acabado todas.
10    Sequelize.Promise.all([
11        models.Quiz.count(),
12        models.Comment.count(),
13//Se ha añadido nuevos métodos al modelo Comment en models/comment.js
14//Para ello se han seguido las instucciones de la documentación de sequelize:
15//http://docs.sequelizejs.com/en/latest/docs/models-definition/#expansion-of-models
16        models.Comment.countDistinctQuizId(),
17        models.Comment.countPublished()
18    ]).then( function( values ){
19        statsData.quizes=values[0];
20        statsData.comments=values[1];
21        statsData.commentedQuizes=values[2];
22        statsData.publishedComments=values[3];
23    }).catch( function (err) {
24        next(err);
25    }).finally( function() {
26        next();
27    });
28};

*/