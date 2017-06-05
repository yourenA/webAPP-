var proxyRequest = require('request');
var fs = require("fs");

exports.autoroute = {
    'get' : {
        '(.?)/(index)?' : showIndexView,
        '(.?)/login' : checkLoginHandler,
        '(.?)/logout' : onLogoutHandler,
        '(.?)/log_out' : onClearUserIdenHandler,
        '(.?)/update_priv' : updatePrivHandler
    },
    'post' : {
        '(.?)/login' : checkLoginHandler
    }
};

function showIndexView(req, res) {
    if (req.session.user && req.session.user.uId !== undefined && req.session.user.uName !== undefined) {
        res.end();
        res.redirect("main");
    } else {
        res.render('index', {user : req.session.user});
    }
}

function checkLoginHandler(req, res) {
    var pt = req.param("pt").toString().trim();
    var pwd = req.param("pwd").toString().trim();

    var o = {};

    if (pt == "") {
        o = {code:1, msg:'帐号不能为空'};
        res.end(JSON.stringify(o));
        return ;
    } else if (pwd == "") {
        o = {code:1, msg:'密码不能为空'};
        res.end(JSON.stringify(o));
        return ;
    }

    var url = "http://oa.bojoy.net/general/reservation/check_iden.php?uid="+pt+"&pwd=" + pwd + "&t=" + new Date().getTime();

    proxyRequest.get(url, function(error, proxyResponse, proxyBody) {
        if (proxyResponse.statusCode == "200") {
            var proxyResultArr = proxyBody.split("@");
            if (proxyResultArr.length == 2) {
                o = {code:0, msg:"登录成功"};

                req.session.user = {
                    uId : proxyResultArr[0],
                    uName :proxyResultArr[1],
                    isAdmin : checkIsAdmin(proxyResultArr[1])
                };

            }  else {
                o = {code:1, msg:proxyBody.toString()};
            }

            res.end(JSON.stringify(o));

            return ;
        }
    });
}

function onLogoutHandler(req, res) {
    req.session.user = null;
    res.redirect("../index");
}

function onClearUserIdenHandler(req, res) {
    var uId = req.session.user ? req.session.user["uId"] : null;

    req.session.user = null;

    if (uId) {
        req.session.user = {uId : uId};
    }

    res.redirect("../index");
}

var MANAGER_LIST = null;
function checkIsAdmin(uName) {
    if (!MANAGER_LIST) {
//        MANAGER_LIST = require("../public/manager.json");

        var fileContent = fs.readFileSync(__dirname + '/../public/manager.json');
        MANAGER_LIST = JSON.parse(fileContent);
    }

    return MANAGER_LIST[uName] == "1" ? true : false;
}

function updatePrivHandler(req, res) {
    if (req.session.user && req.session.user.uId !== undefined && req.session.user.uName !== undefined) {

        var o = null;

        if (req.session.user.isAdmin) {
            MANAGER_LIST = null;

            o = {code:0, msg:"管理员列表更新成功"};
            res.end(JSON.stringify(o));
        } else {
            o = {code:1, msg:"系统发生非预期错误，请联系管理员"};
            res.end(JSON.stringify(o));
        }

    } else {
        res.redirect("../");
    }
}