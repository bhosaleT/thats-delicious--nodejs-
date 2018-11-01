exports.myMiddleWare = (req, res,next) => {
    req.name = 'wes';
    next(); // here the next symbolises that the work was done by this middleware go to next middleware.
}

exports.homePage = (req, res) => {
    console.log(req.name);
    res.render('index');
}