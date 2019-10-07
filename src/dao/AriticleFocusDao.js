var conn = require('./Connection').conn

exports.save = (ariticle_id, user_id) => {
    var params = [ariticle_id, user_id]
    return new Promise((resovle, reject) => {
        conn.query('insert into tb_ariticle_focus(ariticle_id, user_id) values(?, ?)', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.findAllByUserId = (user_id) => {
    var params = [user_id]
    return new Promise((resovle, reject) => {
        conn.query('select * from tb_ariticle_focus where user_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.deleteByAriticleIdAndUserId = (ariticle_id, user_id) => {
    var params = [ariticle_id, user_id]
    return new Promise((resovle, reject) => {
        conn.query('delete from tb_ariticle_focus where ariticle_id = ? and user_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.deleteAllByAriticleId = (ariticle_id) => {
    var params = [ariticle_id]
    return new Promise((resovle, reject) => {
        conn.query('delete from tb_ariticle_focus where ariticle_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}