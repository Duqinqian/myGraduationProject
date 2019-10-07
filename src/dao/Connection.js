var mysql = require('mysql')
var createConnection = mysql.createConnection
var user = 'tb_user'
var ariticle = 'tb_ariticle'
var comment = 'tb_comment'
var ariticle_focus = 'tb_ariticle_focus'
var user_like = 'tb_user_like'
var articles = 'tb_articles'
var chat = 'tb_chat'
var found = 'tb_found'
var lost = 'tb_lost'
var fun = 'tb_fun'
var superuser = 'tb_superuser'

// 修改密码
var password = 'password'

var conn = createConnection({     
    host        : 'localhost',
    port        : '3306',
    user        : 'root',
    password    : password,
    database    : 'life'
})

var error_bool = false
var conn_1

conn.connect(err => {
    if (err) {
        conn_1 = createConnection({     
            host        : 'localhost',
            port        : '3306',
            user        : 'root',
            password    : password
        })

        conn_1.connect()
        conn_1.query(`create database if not exists life`)
        conn_1.query(`create table if not exists life.${user}(id int primary key auto_increment, username varchar(50), password varchar(50), nickname varchar(255), headimg varchar(1000))`)
        conn_1.query(`create table if not exists life.${ariticle}(id int primary key auto_increment, title varchar(255), content varchar(3000), cover_img varchar(1000), cover_desc varchar(1000), user_id int, type varchar(1000), publish_time Datetime, _like int, _unlike int, FOREIGN KEY (user_id) REFERENCES life.${user} (id))`)
        conn_1.query(`create table if not exists life.${comment}(id int primary key auto_increment, ariticle_id int, user_id int, send_time Datetime, content varchar(2000), FOREIGN KEY (user_id) REFERENCES life.${user} (id), FOREIGN KEY (ariticle_id) REFERENCES life.${ariticle} (id))`)
        conn_1.query(`create table if not exists life.${user_like}(id int primary key auto_increment, focus_user_id int, user_id int, FOREIGN KEY (focus_user_id) REFERENCES life.${user} (id), FOREIGN KEY (user_id) REFERENCES life.${user} (id))`)
        conn_1.query(`create table if not exists life.${ariticle_focus}(id int primary key auto_increment, ariticle_id int, user_id int, FOREIGN KEY (ariticle_id) REFERENCES life.${ariticle} (id), FOREIGN KEY (user_id) REFERENCES life.${user} (id))`)

        error_bool = true
    }
})

if (error_bool) {
    conn = conn_1
    conn.connect()
}

exports.conn = conn