var Option = require('../models/option');

exports.delete = function (req, res) {
    var optionId = req.params.option;
    Option.findByIdAndRemove(optionId, function (err, option) {
        if (err) {
            return res.json({
                success: false,
                error: err.message
            });
        }
        res.json({
            success: true,
            option: option
        });
    });
};