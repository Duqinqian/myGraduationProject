var conn = require('./Connection').conn

exports.save = (focus_user_id, user_id) => {
    let params = [focus_user_id, user_id]
    return new Promise((resolve, reject) => {
        conn.query('insert into tb_user_like(focus_user_id, user_id) values(?, ?)', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

exports.findAllByUserId = (user_id) => {
    let params = [user_id]
    return new Promise((resolve, reject) => {
        conn.query('select * from tb_user_like where user_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}

exports.deleteByFocusUserIdAndUserId = (focus_user_id, user_id) => {
    let params = [focus_user_id, user_id]
    return new Promise((resolve, reject) => {
        conn.query('delete from tb_user_like where focus_user_id = ? and user_id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resolve(results)
            }
        })
    })
}
