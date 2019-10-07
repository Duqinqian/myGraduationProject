var conn = require('./Connection').conn

exports.findByUsername = (username) => {
    let params = [username]
    return new Promise((resolve, reject) => {
        conn.query('select * from tb_user where username = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                if (results.length === 0) {
                    resolve(-1)
                }

                if (results.length !== 1) {
                    resolve(0)
                } else {
                    resolve(results[0])
                }
            }
        })
    })
}

exports.findById = (id) => {
    let params = [id]
    return new Promise((resolve, reject) => {
        conn.query('select * from tb_user where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                if (results.length !== 1) {
                    resolve(0)
                } else {
                    resolve(results[0])
                }
            }
        })
    })
}

exports.save = (username, password, nickname, headimg) => {
    let params = [username, password, nickname, headimg]
    return new Promise((resolve, reject) => {
        conn.query('insert into tb_user(username, password, nickname, headimg) values(?, ?, ?, ?)', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}