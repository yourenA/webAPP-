/**
 * Created by Administrator on 2017/1/25.
 */
(function (window,document) {
    var proEle=document.querySelector('.top-area-pro ul');
    var cityEle=document.querySelector('.top-area-city ul');
    var countyEle=document.querySelector('.top-area-county ul');
    var showPro='';
    var showCity='';
    var showCounty='';
    proEle.innerHTML='';
    cityEle.innerHTML='';
    countyEle.innerHTML='';
    var parseProDate=null;
    var parseCityDate=null;
    var parsCountyDate=null;
    var topArea=document.querySelector('.top-area');
    var app={
        init:function () {
            document.addEventListener('DOMContentLoaded', function () {
                ajax({
                    url: "./data/city.json",              //请求地址
                    type: "GET",                       //请求方式
                    dataType: "json",
                    success: function (response) {
                        var cityData=JSON.parse(response);
                        console.log(cityData);
                        parseProDate=cityData.citylist;
                        showPro=parseProDate[0].p;
                        for(var i=0;i<parseProDate.length;i++){
                            proEle.innerHTML+='<li data-index='+i+' >'+parseProDate[i].p+'</li>';
                        }
                        var parseProDate0=parseProDate[0].c;
                        for(var j=0;j<parseProDate0.length;j++){
                            cityEle.innerHTML+='<li data-index='+j+' >'+parseProDate0[j].n+'</li>';
                        }
                        parseCityDate=parseProDate[0].c;
                    },
                    fail: function (status) {
                        // 此处放失败后执行的代码
                    }
                });
                app.bindProClick();
                app.bindCityClick();
                app.bindCountyClick();
                app.bindAddressClick();
                app.bindDocumentClick();
            }.bind(app),false)
        }(),
        bindProClick:function () {
            proEle.addEventListener('touchend',function (e) {
                e.stopPropagation();
                cityEle.innerHTML='';
                countyEle.innerHTML='';
                var proIndex=e.target.getAttribute('data-index');
                showPro=e.target.textContent;
                parseCityDate=parseProDate[proIndex].c;
                for(var i=0;i<parseCityDate.length;i++){
                    cityEle.innerHTML+='<li data-index='+i+' >'+parseCityDate[i].n+'</li>'
                }
            },false);
        },
        bindCityClick:function () {
            cityEle.addEventListener('touchend',function (e) {
                e.stopPropagation();
                countyEle.innerHTML='';
                var proIndex=e.target.getAttribute('data-index');
                showCity=e.target.textContent;
                parsCountyDate=parseCityDate[proIndex].a;
                console.log(parsCountyDate)
                if(parsCountyDate){
                    for(var i=0;i<parsCountyDate.length;i++){
                        countyEle.innerHTML+='<li data-index='+i+' >'+parsCountyDate[i].s+'</li>'
                    }
                }else{
                    document.querySelector('.address p').textContent=showPro+showCity;
                }

            },false);
        },
        bindCountyClick:function () {
            countyEle.addEventListener('touchend',function (e) {
                e.stopPropagation();
                showCounty=e.target.textContent;
                document.querySelector('.address p').textContent=showCity+showCounty;
                topArea.style.display='none';
                var tap=document.createElement('div');
                tap.style.cssText='width:40px;height:40px;border-radius:20px;position:absolute;';
                var touch = e.changedTouches[0];
                tap.style.top=(touch.pageY-20) + 'px';
                tap.style.left=(touch.pageX-20) + 'px';
                document.body.appendChild(tap);

                setTimeout(function(){
                    document.body.removeChild(tap);
                }, 500);
            },false);
        },
        bindAddressClick:function () {
            document.querySelector('.address').addEventListener('touchend',function (e) {
                e.stopPropagation();
                if(topArea.style.display === 'none'|| topArea.style.display === ""){
                    topArea.style.display='block'
                }else {
                    topArea.style.display='none'
                }
            },false);
        },
        bindDocumentClick:function () {
            document.addEventListener('touchend',function (e) {
                console.log('dc');
                if(topArea.style.display === 'block'){
                    topArea.style.display='none';
                    var tap=document.createElement('div');
                    tap.style.cssText='width:40px;height:40px;border-radius:20px;position:absolute;';
                    var touch = e.changedTouches[0];
                    tap.style.top=(touch.pageY-20) + 'px';
                    tap.style.left=(touch.pageX-20) + 'px';
                    document.body.appendChild(tap);

                    setTimeout(function(){
                        document.body.removeChild(tap);
                    }, 500);
                }

            })
        }
    }
})(window,document);


