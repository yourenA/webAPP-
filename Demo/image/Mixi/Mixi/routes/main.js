/**
 * Created with JetBrains WebStorm.
 * User: zhangyi
 * Date: 13-7-9
 * Time: 下午8:13
 * To change this template use File | Settings | File Templates.
 */
var fs = require("fs");
var dbConfig = require("../db.json");
var mysql = require("mysql");
var queues = require('mysql-queues');


exports.autoroute = {
    "get" : {
        "(.?)/main" : showMainViewHandler,
        "(.?)/main/:id" : showOrderDinnerHandler,
        "(.?)/manager/close_order" : closeOrderHandler,
        "(.?)/manager/open_order" : openOrderHandler,
        "(.?)/manager/list/" : showDinnerListHandler,
        "(.?)/updateMenu" : function(req, res) {
            updateMenuConfig();
            res.end("<meta http-equiv='content-type' content='text/html; charset=utf-8' /> 菜单已成功更新");
        },
        "(.?)/manager/menu" : showAllMenusHandler,
        "(.?)/manager/delMenu" : delMenuHandler,
        "(.?)/manager/order_food_list/" : showOrderFoodListHandler
    },
    "post" : {
        '(.?)/orderFood' : orderFoodHandler,
        '(.?)/cancelOrder' : cancelOrderHandler,
        '(.?)/pay' : changePayStatusHandler,
        "(.?)/manager/saveMenu" : saveMenuHandler
    }
};

function checkIden(req, res) {
    if (req.session.user && req.session.user.uId !== undefined && req.session.user.uName !== undefined) {
        return true;
    } else {
        res.redirect("../");
        return false;
    }
}

var g_isLoaded = false;
var MENUS_CONFIG = {};

function updateMenuConfig() {
    MENUS_CONFIG = {};

    var dirPath = __dirname + '/../public/menu';
    var files = fs.readdirSync(dirPath);

    files.forEach(function(fileName) {
        if (/\.json$/.test(fileName)) {
            var filePath = dirPath + "/" + fileName;
            var fileContent = fs.readFileSync(filePath, "utf8");
            var o = JSON.parse(fileContent);

            MENUS_CONFIG[o["id"]] = o;
        }
    });
}

function showMainViewHandler(req, res) {
    if (checkIden(req, res)) {
        if (!g_isLoaded) {
            g_isLoaded = true;

            updateMenuConfig();
        }

        var dining_arr = [];
        for (var i in MENUS_CONFIG) {
            var _o = MENUS_CONFIG[i];

            if (_o["status"] == "1") {
                dining_arr.push([_o["id"], _o["name"]]);
            }
        }

        var currDate = new Date().format("YYYY-MM-dd");
        var ts = getTS();
        var uId = req.session.user.uId;
        var conn = getConnection();
        var isClose = false;

        if (req.session.user.isAdmin) {
            queryOrderStatus(conn, currDate, ts, res, function() {
                isClose = false;
                render();
            }, function() {
                isClose = true;
                render();
            });
        } else {
            render();
        }

        function render() {
            queryOrderedDataHandler(conn, uId, currDate, ts, res, function(row) {
                var timeDes = ts == "1" ? "晚餐" : "午餐";
                res.render('main', {user : req.session.user, mixi_place : dining_arr, dinner_data : row, is_admin : req.session.user.isAdmin, is_close : isClose, time_des:timeDes});
                conn.end();
                conn = null;
            })
        }
    }
}

//查询已订餐的数据
function queryOrderedDataHandler(conn, uId, currDate, ts, res, callback) {
    var row = null;
    conn = conn || getConnection();

    conn.query("SELECT * FROM order_rice WHERE uid = ? AND d_date = ? AND ts = ?", [uId, currDate, ts], function(err, rows, fields) {
        if (err) {
            throw err;
            o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
            res.end(JSON.stringify(o));

            return false;
        } else if (rows.length == 0) {
            row = null;
        } else {
            row = rows[0];
        }

        callback && callback(row);
    });
}


function showOrderDinnerHandler(req, res) {
    if (checkIden(req, res)) {
        var dId = req.params[0];
        var menusConfig = MENUS_CONFIG[dId];

        if (!menusConfig) {
            var dirPath = __dirname + '/../public/menu';
            var filePath = dirPath + "/" + dId+".json";

            if (!fs.existsSync(filePath)) {
                res.end('<meta http-equiv="content-type" content="text\/html; charset=utf-8" \/>您访问的菜单已不存在');
                return ;
            }

            MENUS_CONFIG[dId] = require("../public/menu/"+dId+".json");
            menusConfig = MENUS_CONFIG[dId];

            console.log("加载菜单：", menusConfig);
        }

        var connection = getConnection();

        var currDate = new Date().format("YYYY-MM-dd");
        var ts = getTS();
        var isClose = false;
        var uId = req.session.user.uId;

        queryOrderStatus(connection, currDate, ts, res, function() {
            isClose = false;
            renderHandler();
        } , function() {
            isClose = true;
            renderHandler();
        });

        function renderHandler() {
            queryOrderedDataHandler(connection, uId, currDate, ts, res, function(row) {
                var timeDes = ts == "1" ? "晚餐" : "午餐";
                res.render('order_dinner', {user : req.session.user, d_id :dId, menus_config : menusConfig, is_close : isClose, dinner_data : row, time_des : timeDes});
                connection.end();
                connection = null;
            });
        }
    }
}

function checkSession(req, res) {
    if (req.session.user && req.session.user.uId !== undefined && req.session.user.uName !== undefined) {
        return true;
    } else {
        var o = {code:1000, msg:"当前登录身份已过期"};
        res.end(JSON.stringify(o));
        return false;
    }
}

function orderFoodHandler(req, res) {
    if (checkSession(req, res)) {
        var uId = req.body.uId;
        var uName = req.body.uName;
        var menuName = req.body.menuName;
        var menuPrice = req.body.menuPrice;
        var dId = req.body.dId;
        var ts = req.body.ts || getTS();  //午餐还是晚餐
        var o = null;

        if (req.session.user.uId != uId || req.session.user.uName != uName) {
            o = {code:1, msg:"请求非法"};
            res.end(JSON.stringify(o));
            return false;
        }

        if (ts != "0" && ts != "1") {
            o = {code:1, msg:"非法参数"};
            res.end(JSON.stringify(o));
            return false;
        }

        var menuConfig = MENUS_CONFIG[dId];
        if (!menuConfig) {
            o = {code:1, msg:"您需要预订的餐厅不存在"};
            res.end(JSON.stringify(o));
            return false;
        }

        if (!menuName || !menuPrice || !uId || !uName || !dId) {
            o = {code:1, msg:"请求缺少必要参数"};
            res.end(JSON.stringify(o));
            return false;
        }

        if (!menuConfig['menus'][menuName]) {
            o = {code:1, msg:"预订的菜不存在"};
            res.end(JSON.stringify(o));
            return false;
        }

        if (menuConfig['menus'][menuName] != menuPrice) {
            o = {code:1, msg:"传递的价格有误"};
            res.end(JSON.stringify(o));
            return false;
        }

        var dName = menuConfig['name'];
        var addrIp = req.ip;

        var currDate = new Date().format("YYYY-MM-dd");
        var currTime = new Date().format("YYYY-MM-dd hh:mm:ss");

        var connection = getConnection();

        //订餐系统是否已关闭
        checkOrderStatus(connection, currDate, ts, res, queryOrder);

        function queryOrder() {
            connection.query("SELECT * FROM order_rice AS t WHERE t.`uid` = ? AND d_date = ? AND ts = ?", [uId, currDate, ts], function(err, rows, fields) {
                if (err) {
                    throw err;
                    o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
                    res.end(JSON.stringify(o));

                    connection.end();
                    connection = null;
                } else if (rows.length > 0) {
                    o = {code:100, msg:"您今天已经订过餐了"};
                    res.end(JSON.stringify(o));

                    connection.end();
                    connection = null;
                } else {
                    execOrder();
                }
            });
        }

        function execOrder() {
            var trans = connection.startTransaction();
            trans.query("INSERT INTO order_rice VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [uId, uName, currDate, currTime, ts, menuName, menuPrice, dId, dName, addrIp, 0], function (err, info) {
                if (err) {
                    throw err;
                    trans.rollback();
                    console.log(info);

                    o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
                    res.end(JSON.stringify(o));

                    connection.end();
                    connection = null;
                } else {
                    trans.commit(function (err, info) {
                        console.log(info);
                        o = {code:0, msg:"订餐成功"};
                        res.end(JSON.stringify(o));

                        connection.end();
                        connection = null;
                    });
                }
            });
            trans.execute();
        }
    }
}

function getConnection() {
    var connection = mysql.createConnection({
        host : dbConfig["dbHost"],
        port : 3306,
        user : dbConfig["uName"],
        password : dbConfig["uPwd"],
        database : dbConfig["dbName"],
        charset : 'UTF8_GENERAL_CI',
        debug : false
    });

    queues(connection, true);

    connection.connect();

    return connection;
}

function checkOrderStatus(conn, tDate, ts, res, callback) {
    var o = null;

    queryOrderStatus(conn, tDate, ts, res, callback, function() {
        o = {code:10000, msg:"订餐系统已关闭，请联系管理员"};
        res.end(JSON.stringify(o));
    });
}

function queryOrderStatus(conn, tDate, ts, res, callback, callback2) {
    var o = null;

    conn.query("SELECT * FROM order_status WHERE d_date = ? AND ts = ?", [tDate, ts], function(err, rows, fields) {
        if (err) {
            throw err;
            o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
            res.end(JSON.stringify(o));
        } else if (rows.length == 0) {
            callback();
        } else {
            var row = rows[0];
            if (row["b_close"] == 0) {
                callback();
            } else {
                callback2();
            }
        }
    });
}


function cancelOrderHandler(req, res) {
    if (checkSession(req, res)) {
        var currDate = new Date().format("YYYY-MM-dd");
        var uId = req.session.user.uId;
        var ts = req.body.ts || getTS();  //午餐还是晚餐
        var o = null;

        if (ts != "0" && ts != "1") {
            o = {code:1, msg:"非法参数"};
            res.end(JSON.stringify(o));
            return false;
        }

        var connection = getConnection();

        function cancelHandler() {
            connection.query("DELETE FROM order_rice WHERE uid = ? AND d_date = ? AND ts = ?", [uId, currDate, ts], function(err, rows, fields) {
                if (err) {
                    throw err;
                    o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
                    res.end(JSON.stringify(o));
                } else {
                    o = {code:0, msg:"您的订餐已取消"};
                    res.end(JSON.stringify(o));
                }

                connection.end();
                connection = null;
            });
        }

        //订餐系统是否已关闭
        checkOrderStatus(connection, currDate, ts, res, cancelHandler);
    }
}

/** * 时间对象的格式化; */
Date.prototype.format = function (format) {
    /*
    * eg:format="YYYY-MM-dd hh:mm:ss";
    */
    var o = {
        "M+": this.getMonth() + 1, //month
        "d+": this.getDate(), //day
        "h+": this.getHours(), //hour
        "m+": this.getMinutes(), //minute
        "s+": this.getSeconds(), //second
        "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
        "S": this.getMilliseconds() //millisecond
    }

    if (/((|Y|)+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }

    return format;
}

function closeOrderHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
        if (!req.session.user.isAdmin) {
            o = {code:1, msg:"非管理员，无权进行此操作"};
            res.end(JSON.stringify(o));
            return ;
        }

        var ts = req.body.ts || getTS();  //午餐还是晚餐
        updateOrderStatusHandler(1, ts, res);
    }
}

function getTS() {
    var date = new Date();
    //上午、下午
    return date.getHours() >= 12 ? "1" : "0";
}

function openOrderHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
        if (!req.session.user.isAdmin) {
            o = {code:1, msg:"非管理员，无权进行此操作"};
            res.end(JSON.stringify(o));
            return ;
        }
        var ts = req.body.ts || getTS();  //午餐还是晚餐
        updateOrderStatusHandler(0, ts, res);
    }
}

function updateOrderStatusHandler(iden, ts, res) {
    var currDate = new Date().format("YYYY-MM-dd");

    var connection = getConnection();
    connection.query("REPLACE INTO order_status (d_date, b_close, ts) VALUES(?,?,?)", [currDate, iden, ts], function(err, rows, fields) {
        if (err) {
            throw err;
            o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
            res.end(JSON.stringify(o));
        } else {
            o = {code:0, msg:"操作成功"};
            res.end(JSON.stringify(o));
        }

        connection.end();
        connection = null;
    });
}

//显示订餐列表
function showDinnerListHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
//        if (!req.session.user.isAdmin) {
//            o = {code:1, msg:"非管理员，无权进行此操作"};
//            res.end(JSON.stringify(o));
//            return ;
//        }

        //参数
        var queryDate = req.query.queryDate || new Date().format("YYYY-MM-dd");
        var ts = req.query.ts || getTS();

        if (!/^(0|1)$/.test(ts)) {
            ts = getTS();
        }

        if (!/^\d{4}\-\d{2}\-\d{2}$/.test(queryDate)) {
            queryDate = new Date().format("YYYY-MM-dd");
        }
        //console.log(queryDate, ts);

        var sql = ["SELECT * FROM order_rice WHERE d_date = ? AND ts = ? "];
        var sqlParamsArr = [queryDate, ts];

        var dId = req.query.d_id;
        if (MENUS_CONFIG[dId]) {
            sql.push(" AND dining_id = ?");
            sqlParamsArr.push(dId);
        } else {
            dId = "";
        }

        var isPay = req.query.is_pay;
        if (/^(0|1)$/.test(isPay)) {
            sql.push(" AND is_pay = ?");
            sqlParamsArr.push(isPay);
        } else {
            isPay = "";
        }

        sql.push(" ORDER BY dining_id,food_name");
        sql = sql.join("");
        console.log("sql:", sql);

        var connection = getConnection();
        connection.query(sql, sqlParamsArr, function(err, rows, fields) {
            if (err) {
                throw err;
                o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
                res.end(JSON.stringify(o));
            } else {
                var arr = [];
                for (var i = 0, len = rows.length; i < len; i++) {
                    arr.push(rows[i]);
                }
                //console.log(arr);
                res.render('list', {user : req.session.user, list_data : arr, query_data : {
                    queryDate : queryDate,
                    ts : ts,
                    dId : dId,
                    isPay : isPay
                }});
            }

            connection.end();
            connection = null;
        });
    }
}

function changePayStatusHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
        if (!req.session.user.isAdmin) {
            o = {code:1, msg:"非管理员，无权进行此操作"};
            res.end(JSON.stringify(o));
            return ;
        }

        var nId = req.body.nid;
        if (!nId) {
            o = {code:1, msg:"缺少参数"};
            res.end(JSON.stringify(o));
            return ;
        }

        var connection = getConnection();
        connection.query("UPDATE order_rice SET is_pay = '1' WHERE n_id = ?", [nId], function(err, rows, fields) {
            if (err) {
                throw err;
                o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
                res.end(JSON.stringify(o));
            } else {
                o = {code:0, msg:""};
                res.end(JSON.stringify(o));
            }

            connection.end();
            connection = null;
        });
    }
}

function showAllMenusHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
        if (!req.session.user.isAdmin) {
            o = {code:1, msg:"非管理员，无权进行此操作"};
            res.end(JSON.stringify(o));
            return ;
        }

        res.render('menus', {user : req.session.user, menu_data : MENUS_CONFIG});
    }
}

function delMenuHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
        if (!req.session.user.isAdmin) {
            o = {code:1, msg:"非管理员，无权进行此操作"};
            res.end(JSON.stringify(o));
            return ;
        }

        var menuId = req.query.m_id;
        if (!menuId) {
            o = {code:1, msg:"参数传递不正确"};
            res.end(JSON.stringify(o));
            return ;
        }

        var filePath = __dirname + '/../public/menu/' + menuId + ".json";
        fs.exists(filePath, function(exists) {
            if (!exists) {
                o = {code:1, msg:"文件不存在"};
                res.end(JSON.stringify(o));
                return ;
            }

            fs.unlink(filePath, function() {
                updateMenuConfig();

                o = {code:0, msg:""};
                res.end(JSON.stringify(o));
                return ;
            });
        });
    }
}

function saveMenuHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
        if (!req.session.user.isAdmin) {
            o = {code:1, msg:"非管理员，无权进行此操作"};
            res.end(JSON.stringify(o));
            return ;
        }

        var menuId = req.body.m_id;
        if (!menuId) {
            o = {code:1, msg:"参数传递不正确"};
            res.end(JSON.stringify(o));
            return ;
        }

        var filePath = __dirname + '/../public/menu/' + menuId + ".json";
        var menuContent = req.body.m_content;

        fs.writeFile(filePath, menuContent, "utf8", function(err) {
            if (err) {
                o = {code:1, msg:err};
                res.end(JSON.stringify(o));
                return ;
            }

            updateMenuConfig();

            o = {code:0, msg:""};
            res.end(JSON.stringify(o));
            return ;
        });
    }
}

function showOrderFoodListHandler(req, res) {
    var o = null;

    if (checkSession(req, res)) {
//        if (!req.session.user.isAdmin) {
//            o = {code:1, msg:"非管理员，无权进行此操作"};
//            res.end(JSON.stringify(o));
//            return ;
//        }

        //参数
        var queryDate = req.query.queryDate || new Date().format("YYYY-MM-dd");
        var ts = req.query.ts || getTS();

        if (!/^(0|1)$/.test(ts)) {
            ts = getTS();
        }

        if (!/^\d{4}\-\d{2}\-\d{2}$/.test(queryDate)) {
            queryDate = new Date().format("YYYY-MM-dd");
        }
        //console.log(queryDate, ts);

        var sql = ["SELECT food_name,COUNT(1) AS num,price, dining_name, d_date, ts FROM order_rice WHERE d_date = ? AND ts = ?"];
        var sqlParamsArr = [queryDate, ts];

        var dId = req.query.d_id;
        if (MENUS_CONFIG[dId]) {

        } else {
            for (var kDid in MENUS_CONFIG) {
                dId = kDid;
                break;
            }
        }

        sql.push(" AND dining_id = ?");
        sqlParamsArr.push(dId);

        sql.push(" GROUP BY food_name ORDER BY dining_id,food_name");
        sql = sql.join("");
        console.log("sql:", sql);

        var connection = getConnection();
        connection.query(sql, sqlParamsArr, function(err, rows, fields) {
            if (err) {
                throw err;
                o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
                res.end(JSON.stringify(o));
            } else {
                var arr = [];
                for (var i = 0, len = rows.length; i < len; i++) {
                    arr.push(rows[i]);
                }
                //console.log(arr);
                res.render('order_food_list', {user : req.session.user, list_data : arr, query_data : {
                    queryDate : queryDate,
                    ts : ts,
                    dId : dId
                }});
            }

            connection.end();
            connection = null;
        });
    }
}