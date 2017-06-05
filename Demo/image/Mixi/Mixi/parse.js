/**
 * Created with JetBrains WebStorm.
 * User: zhangyi
 * Date: 13-7-11
 * Time: 上午10:04
 * To change this template use File | Settings | File Templates.
 */
//var parser = require('xml2json');
var fs = require("fs");
var parser = require('xml2json');

fs.readFile('d:/main.xml', "utf8", function (err, data) {
    if (err) throw err;

    var json_str = parser.toJson(data);
    json = JSON.parse(json_str);

    var organizations = json.organizations;
    var shops = organizations.shop;

    for (var i = 0, len = shops.length; i < len; i++) {
        var shop_obj = shops[i];
        var out_o = {
            "id" : shop_obj["spid"],
            "name" : shop_obj["spname"],
            "status" : 1,
            "tel" : shop_obj["tel"] || "",
            "menus" : {}
        };

        var menu_list = shop_obj['cai'];
        for (var j = 0, jLen = menu_list.length; j < jLen; j++) {
            var menu_o = menu_list[j];

            out_o.menus[menu_o['caname']] = menu_o['money'];
        }

        var file_url = __dirname + "/public/menu/" + out_o.id + ".json";

        fs.writeFileSync(file_url, JSON.stringify(out_o), "utf8");
    }
});
