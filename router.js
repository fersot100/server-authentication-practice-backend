module.exports = function (app) {
    app.get('/', (req, res, next) => {
        res.send(['Water', 'Phone', 'Paper']);
    });
}