var express = require('express')
// body-parser模块是一个Express中间件,是一个HTTP请求体解析中间件
var bodyParser = require('body-parser')
var UserDao = require('./dao/UserDao')
var AriticleDao = require('./dao/AriticleDao')
var CommentDao = require('./dao/CommentDao')
var UserLikeDao = require('./dao/UserLikeDao')
var AriticleFocusDao = require('./dao/AriticleFocusDao')
var WebMessage = require('./code/WebMessage')
var fs = require("fs")
var multer = require('multer')
var Success = WebMessage.Success
var Failed = WebMessage.Failed
var jsonParser = bodyParser.json()
var uploads = multer({dest: './resources/public'})
var app = express()

// 静态路由
app.use('/public', express.static('./resources/public'))

// 跨域
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE')
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
    res.setHeader('Access-Control-Allow-Credentials', true)
    
    if (req.method === 'OPTIONS') {
        res.send(200)
    } else {
        next()
    }
})

app.listen(80, () => {
    console.log('===========================')
    console.log('===========start===========')
    console.log('===========================')
})

// 用户登录 {
//   "username": "du",
//   "password":"123456"
// }
app.post('/login', jsonParser, (req, res) => {
    var username = req.body.username
    var password = req.body.password

    if (username === undefined || password === undefined) {
        res.json(Failed())
        return
    }

    UserDao.findByUsername(username).then(data => {
        if (data.password === password) {
            res.json(Success())
        } else {
            res.json(Failed())
        }
    }).then(data => {
        res.json(Failed())
    }).catch(data => {
        res.json(Failed())
    })
})

// 用户注册 {
//   "username": "du",
//   "password":"123456",
//   "nickname":"du"
// }
app.post('/register', jsonParser, async (req, res) => {
    var username = req.body.username
    var password = req.body.password
    var nickname = req.body.nickname
    var headimg = 'user/App.ico'

    if (username === undefined || password === undefined || nickname === undefined || headimg === undefined) {
        res.json(Failed())
        return
    }

    var result = await UserDao.findByUsername(username)

    if (result !== -1) {
        res.json(Failed())
        return
    }

    await UserDao.save(username, password, nickname, headimg).then(data => {
        res.json(Success())
    }).catch(data => {
        res.json(Failed())
    })
})

// 添加文章 前端可以用 FormData 传输，Content-Type: multipart/form-data,使用异步async
app.post('/ariticle', uploads.single('cover_img'), async (req, res) => {
    // console.log(111)
    var title = req.body.title
    var content = req.body.content
    // console.log(333)
    
    var cover_img_path = req.file.path
    var cover_desc = req.body.cover_desc
    var type = req.body.type
    var username = req.body.username
    // console.log(222)
    //path 获取上传文件的临时路径
    var result = await UserDao.findByUsername(username)
    if (result.username === username) {
        var id = await AriticleDao.save(title, content, cover_img_path, cover_desc, type, result.id)
        var target_path = './resources/public/ariticle/' + id
        fs.mkdirSync(target_path)
        target_path += '/cover_img' + req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))
        var storage_path = 'ariticle/cover_img' + req.file.originalname.substring(req.file.originalname.lastIndexOf('.'))
        await AriticleDao.updateCoverImgById(id, storage_path)
        fs.rename(cover_img_path, target_path, function(err) {
            if (err) {
                throw err
            }
            fs.unlink(cover_img_path, function() {
                if (err) {
                    throw err
                }
                res.json(Success())
            })
        })
    } else {
        res.json(Failed())
    }
})
// app.post('/ariticle', uploads.array('cover_img'), async (req, res) => {
//     var title = req.body.title
//     var content = req.body.content
//     // var cover_img_path = req.file.path
//     var cover_desc = req.body.cover_desc
//     var type = req.body.type
//     var username = req.body.username

//     var result = await UserDao.findByUsername(username)
//         if (result.username === username) {
//             var id = await AriticleDao.save(title, content, '', cover_desc, type, result.id)
//             var target_path = './resources/public/ariticle/' + id
//             fs.mkdirSync(target_path)
//             var storage_path = ''

//             for (var i = 0; i < req.files.length; i++) {
//                 var file = req.files[i]
//                 var cover_img_path = file.path
//                 var new_target_path = target_path + '/cover_img' + i + file.originalname.substring(file.originalname.lastIndexOf('.'))
//                 storage_path += 'ariticle/cover_img' + i + file.originalname.substring(file.originalname.lastIndexOf('.')) + ';'
//                 fs.rename(cover_img_path, new_target_path, function(err) {
//                     if (err) {
//                         throw err
//                     }
//                     fs.unlink(cover_img_path, function() {
//                         if (err) {
//                             throw err
//                         }
//                     })

//                 })
//            }
//            await AriticleDao.updateCoverImgById(id, storage_path)
//                 res.json(Success())
//             } else {
//                  res.json(Failed())
//         }
// })

// 喜欢该文章。http://localhost/ariticle/like/1
app.put('/ariticle/like/:id', async (req, res) => {
    var id = Number.parseInt(req.params.id)

    if (id === 0) {
        res.json(Failed())
    }

    AriticleDao.updateLikeById(id)
    res.json(Success())
})

// 不喜欢该文章。http://localhost/ariticle/unlike/1
app.put('/ariticle/unlike/:id', async (req, res) => {
    var id = Number.parseInt(req.params.id)

    if (id === 0) {
        res.json(Failed())
    }

    AriticleDao.updateUnLikeById(id)
    res.json(Success())
})

// 获取文章，只有id和type两个参数，如果id=0，则只查询符合type；否则查询符合id。http://localhost/ariticle?id=0&type=ASD
// v1.0
app.get('/ariticle', async (req, res) => {
    var id = Number.parseInt(req.query.id)
    var type = req.query.type
    var result
    if (id === 0) {
        result = await AriticleDao.findAllByType(type)
    } else {
        result = await AriticleDao.findAllById(id)
    }
    for (var i = 0; i < result.length; i++) {
        var result_l = result[i]
        if (result_l.publish_time === null) {
            continue
        }
        var date = new Date(result_l.publish_time.getTime())
        var str = '' + date.getFullYear() + '-'
        str += (date.getMonth() + 1) + '-'
        str += date.getDate() + ' '
        str += date.getHours() + ':'
        str += date.getMinutes() + ':'
        str += date.getSeconds()
        result_l.publish_time = str
    }
    res.json(Success(result))
})

// 删除文章，前提是文章必须是该用户发布的。http://localhost/ariticle/du/1
// V1.0
// app.delete('/ariticle/:username/:ariticle_id', async (req, res) => {
//     var username = req.params.username
//     var ariticle_id = Number.parseInt(req.params.ariticle_id)
//     var user = await UserDao.findByUsername(username)

//     if (user === 0 || ariticle_id === 0) {
//         res.json(Failed())
//         return
//     }

//     var ariticles = await AriticleDao.findIdAndUserIdById(ariticle_id)
    
//     if (ariticles.length !== 1) {
//         res.json(Failed())
//         return
//     }

//     if (ariticles[0].user_id === user.id) {
//         await AriticleFocusDao.deleteAllByAriticleId(ariticles[0].id)
//         await AriticleDao.deleteOneById(ariticles[0].id)
//         res.json(Success())
//     } else {
//         res.json(Failed())
//     }
// })

app.delete('/ariticle/:username/:ariticle_id', async (req, res) => {
    var username = req.params.username
    var ariticle_id = Number.parseInt(req.params.ariticle_id)
    var user = await UserDao.findByUsername(username)

    if (user === 0 || ariticle_id === 0) {
        res.json(Failed())
        return
    }

    var ariticles = await AriticleDao.findIdAndUserIdById(ariticle_id)
    
    if (ariticles.length !== 1) {
        res.json(Failed())
        return
    }

    if (ariticles[0].user_id === user.id) {
        await AriticleFocusDao.deleteAllByAriticleId(ariticles[0].id)
        await CommentDao.deleteOneByAriticleId(ariticles[0].id)
        await AriticleDao.deleteOneById(ariticles[0].id)
        res.json(Success())
    } else {
        res.json(Failed())
    }
})

// 添加评论
// {
//     "ariticle_id": 8,
//     "username": "du",
//     "content":"sadasd"
// }
app.post('/comment', jsonParser, async (req, res) => {
    var ariticle_id = req.body.ariticle_id
    var username = req.body.username
    var content = req.body.content

    var result = await UserDao.findByUsername(username)
    if (result.username === username) {
        var status = await CommentDao.save(ariticle_id, result.id, content)
        if (status !== 0) {
            res.json(Success())
        } else {
            res.json(Failed())
        }
    } else {
        res.json(Failed())
    }
})

// 根据文章的id来获取所有评论 
// http://localhost/comment/1
app.get('/comment/:ariticle_id', async (req, res) => {
    var ariticle_id = Number.parseInt(req.params.ariticle_id)

    if (typeof ariticle_id !== undefined) {
        var result = await CommentDao.findOneById(ariticle_id)
        
        for (var i = 0; i < result.length; i++) {
            var result_l = result[i]
            var user_id = result_l.user_id
            var user = await UserDao.findById(user_id)
            result_l['user_id'] = user.username
            var date = new Date(result_l.send_time.getTime())
            var str = '' + date.getFullYear() + '-'
            str += (date.getMonth() + 1) + '-'
            str += date.getDate() + ' '
            str += date.getHours() + ':'
            str += date.getMinutes() + ':'
            str += date.getSeconds()
            result_l.send_time = str
        }

        res.json(Success(result))
    } else {
        res.json(Failed())
    }
})

// 关注用户，focus_username代表被关注的用户
// {
//     "focus_username": "du",
//     "username":"qin"
// }
app.post('/userFocus', jsonParser, async (req, res) => {
    var focus_username = req.body.focus_username
    var username = req.body.username

    var focus_User = await UserDao.findByUsername(focus_username)
    var user = await UserDao.findByUsername(username)

    if (focus_User === 0 || user === 0) {
        res.json(Failed())
        return
    }

    UserLikeDao.save(focus_User.id, user.id)
    res.json(Success())
})

// 获取该用户的关注，http://localhost/userFocus/qin
app.get('/userFocus/:username', async (req, res) => {
    var username = req.params.username
    var user = await UserDao.findByUsername(username)

    if (user === 0) {
        res.json(Failed())
        return
    }

    var results = await UserLikeDao.findAllByUserId(user.id)

    for (var i = 0; i < results.length; i++) {
        var result = results[i]
        var focus_user_id = result.focus_user_id
        var user_id = result.user_id
        var focus_User = await UserDao.findById(focus_user_id)
        var user = await UserDao.findById(user_id)
        delete result['id']
        result['focus_User'] = focus_User.username
        result['user_id'] = user.username
    }

    res.json(Success(results))
})

// 取消关注，第一个uri填写该用户，第二个uri填写被取消关注的用户
app.delete('/userFocus/:username/:focus_username', async (req, res) => {
    var focus_username = req.params.focus_username
    var username = req.params.username
    var focus_User = await UserDao.findByUsername(focus_username)
    var user = await UserDao.findByUsername(username)

    if (focus_User === 0 || user === 0) {
        res.json(Failed())
        return
    }

    UserLikeDao.deleteByFocusUserIdAndUserId(focus_User.id, user.id)
    res.json(Success())
})

// 关注文章
// {
//    "username": "qin",
//    "ariticle_id": 1
// }
app.post('/ariticleFocus', jsonParser, async (req, res) => {
    var ariticle_id = req.body.ariticle_id
    var username = req.body.username
    var user = await UserDao.findByUsername(username)

    if (user === 0) {
        res.json(Failed())
        return
    }

    AriticleFocusDao.save(ariticle_id, user.id)
    res.json(Success())
})

// 获取用户关注的文章，http://localhost/ariticleFocus/qin
app.get('/ariticleFocus/:username', jsonParser, async (req, res) => {
    var username = req.params.username
    var user = await UserDao.findByUsername(username)

    if (user === 0) {
        res.json(Failed())
        return
    }

    var results = await AriticleFocusDao.findAllByUserId(user.id)

    for (var i = 0; i < results.length; i++) {
        var result = results[i]
        delete result['user_id']
        var ariticle_info = await AriticleDao.findAllOnlySomeById(result.ariticle_id)
        result['info'] = ariticle_info
    }

    res.json(Success(results))
})

// 取消文章关注，http://localhost/ariticleFocus/qin/1
// v1.0
// app.delete('/ariticleFocus/:username/:ariticle_id', jsonParser, async (req, res) => {
//     var username = req.params.username
//     var ariticle_id = Number.parseInt(req.params.ariticle_id)
//     var user = await UserDao.findByUsername(username)

//     if (user === 0 || ariticle_id == 0) {
//         res.json(Failed())
//         return
//     }

//     AriticleFocusDao.deleteByAriticleIdAndUserId(ariticle_id, user.id)
//     res.json(Success())
// })

app.delete('/ariticleFocus/:username/:ariticle_id', async (req, res) => {
    var username = req.params.username
    var ariticle_id = Number.parseInt(req.params.ariticle_id)
    var user = await UserDao.findByUsername(username)

    if (user === 0 || ariticle_id == 0) {
        res.json(Failed())
        return
    }

    AriticleFocusDao.deleteByAriticleIdAndUserId(ariticle_id, user.id)
    res.json(Success())
})

// 根据用户id获取用户的用户名，http://localhost/user/1
// v1.0
// app.get('/user/:id', jsonParser, async (req, res) => {
//     var id = Number.parseInt(req.params.id)

//     if (id <= 0) {
//         res.json(Failed())
//         return
//     }

//     var user = await UserDao.findById(user_id)
//     var map = []
//     map['user'] = user.username
//     res.json(Success(map))
// })

app.get('/user/:id', async (req, res) => {
    var id = Number.parseInt(req.params.id)

    if (id <= 0) {
        res.json(Failed())
        return
    }

    var user = await UserDao.findById(id)
    var map = []
    map.push(user.username)
    res.json(Success(map))
})

// 获取用户发布文章，
// v1.0 根据作者获取它的所有文章
// http://localhost/ariticle/du?type=Ariticle
// du 是用户名 type 是 类型
// http://localhost/ariticle/du?type= 
// du 用户名  type不填 就是查询全部 
app.get('/ariticle/:username', async (req, res) => {
    var username = req.params.username
    var type = req.query.type
    var result

    if (type !== '') {
        result = await AriticleDao.findAllByTypeAndUsername(type, username)
    } else {
        result = await AriticleDao.findAllByUsername(username)
    }
    res.json(Success(result))
})