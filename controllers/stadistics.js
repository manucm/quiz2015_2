exports.information = function(req, res) {

	var _information = new Array();
	// Recopilamos toda la informacion

	models.Quiz.findAndCountAll().then(function(result) {
		_information.numero_de_preguntas = result;
	});

	res.render('quizes/stadistics/index', {info:_information, errors:[]});

}



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