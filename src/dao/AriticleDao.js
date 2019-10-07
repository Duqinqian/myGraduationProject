var conn = require('./Connection').conn

exports.save = (title, content, cover_img, cover_desc, type, user_id) => {
    let params = [title, content, cover_img, cover_desc, user_id, type, new Date(), 0, 0]
    return new Promise((resovle, reject) => {
        conn.query('insert into tb_ariticle(title, content, cover_img, cover_desc, user_id, type, publish_time, _like, _unlike) values(?, ?, ?, ?, ?, ?, ?, ?, ?)',
             params, (err, results) => {
                if (err) {
                    reject(err)
                } else {
                    resovle(results.insertId)
                }
        })
    })
}

exports.updateCoverImgById = (id, cover_img) => {
    let params = [cover_img, id]
    return new Promise((resovle, reject) => {
        conn.query('update tb_ariticle set cover_img = ? where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results.insertId)
            }
        })
    })
}

exports.findAllByType = (type) => {
    let params = [type]
    return new Promise((resovle, reject) => {
        conn.query('select id, title, content, cover_img, cover_desc, publish_time, _like, _unlike, user_id from tb_ariticle where type = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.findAllById = (id) => {
    let params = [id]
    return new Promise((resovle, reject) => {
        conn.query('select title, content, cover_img, cover_desc, publish_time, _like, _unlike, user_id from tb_ariticle where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.findIdAndUserIdById = (id) => {
    let params = [id]
    return new Promise((resovle, reject) => {
        conn.query('select id, user_id from tb_ariticle where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.findAllOnlySomeById = (id) => {
    let params = [id]
    return new Promise((resovle, reject) => {
        conn.query('select id, title, cover_img, cover_desc, publish_time, _like, _unlike from tb_ariticle where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.updateLikeById = (id) => {
    let params = [id]
    return new Promise((resovle, reject) => {
        conn.query('update tb_ariticle set _like = _like + 1 where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.updateUnLikeById = (id) => {
    let params = [id]
    return new Promise((resovle, reject) => {
        conn.query('update tb_ariticle set _unlike = _unlike + 1 where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.deleteOneById = (id) => {
    let params = [id]
    return new Promise((resovle, reject) => {
        conn.query('delete from tb_ariticle where id = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results.insertId)
            }
        })
    })
}

exports.findAllByTypeAndUsername = (type, username) => {
    let params = [type, username]
    return new Promise((resovle, reject) => {
        conn.query('select tb_ariticle.* from tb_ariticle, tb_user where tb_ariticle.type = ? and tb_user.id = tb_ariticle.user_id and tb_user.username = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}

exports.findAllByUsername = (username) => {
    let params = [username]
    return new Promise((resovle, reject) => {
        conn.query('select tb_ariticle.* from tb_ariticle, tb_user where tb_user.id = tb_ariticle.user_id and tb_user.username = ?', params, (err, results) => {
            if (err) {
                reject(err)
            } else {
                resovle(results)
            }
        })
    })
}