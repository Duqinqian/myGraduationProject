var conn = require('./Connection').conn

exports.save = (ariticle_id, user_id, content) => {
    var params = [ariticle_id, user_id, new Date(), content]
    return new Promise((resovle, reject) => {
        conn.query('insert into tb_comment(ariticle_id, user_id, send_time, content) values(?, ?, ?, ?)', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results.insertId)
            }
        })
    })
}

exports.findOneById = (ariticle_id) => {
    var params = [ariticle_id]
    return new Promise((resovle, reject) => {
        conn.query('select * from tb_comment where ariticle_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.deleteOneByAriticleId = (ariticle_id) => {
    var params = [ariticle_id]
    return new Promise((resovle, reject) => {
        conn.query('delete from tb_comment where ariticle_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}