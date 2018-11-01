

exports.myMiddleWare = (req, res,next) => {
    req.name = 'wes';
    next(); // here the next symbolises that the work was done by this middleware go to next middleware.
}

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
}

exports.addStore = (req, res) => {
    res.render('editStore' , {
        title: 'Add Store'
    });
}

exports.createStore = (req, res) => {
    res.json(req.body);
}