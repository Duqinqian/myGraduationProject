var Success = function (params = []) {
    var base = {}
    base['code'] = 200
    base['extra'] = params
    return base
}

var Failed = function (params = []) {
    var base = {}
    base['code'] = 400
    base['extra'] = params
    return base
}

exports.Success = Success
exports.Failed = Failed