var tableArr = [[, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ], [, , , , ]];
function addWanted(no, name, score, time, dayTimeRoom, prof, etc) {
    $("<tr />").append(
        $("<td />")
            .append($('<a href="javascript:">보임</a>').css("margin", "0 5px 0 5px").click(function () {
                var isHiding = $(this).text() == "보임";
                $(this).text(isHiding ? "숨김" : "보임");
                $("#timeTable .layer:contains(" + no + ")").css("opacity",isHiding ? "0.2" : "0.6");
                showResult();
            }))
            .append($('<a href="javascript:">삭제</a>').css("margin", "0 5px 0 5px").click(function () {
                var layer = $("#timeTable .layer:contains(" + no + ")");
                colorArr.push(layer.css("background-color"));
                layer.each(function (i, l) {
                    var colQry = "#timeTable tr:not(:first) td:nth-child(" + ($(l).parent().index() + 1) + ")";
                    $(l).remove();
                    $(colQry).find(".layer").each(function (i, l) {
                        $(l).css("width", "100%").css("left","0%");
                    }).each(function (i, l) {
                        resizeDupLayer($(l), colQry);
                    });
                });
                $(this).parent().parent().remove();
                showResult();
            })),
        $("<td />").text(no),
        $("<td />").append(name),
        $("<td />").text(score),
        $("<td />").text(time),
        $("<td />").text(dayTimeRoom),
        $("<td />").text(prof),
        $("<td />").text(etc)
    ).appendTo($("#wanted"));
}
function addLayer(col, row, len, color, text) {
    if (col < 0 || col > 6) return false;
    if (row < 0 || row + len - 1 > 20) return false;
    if (color == null || color == "") return false;
    if (text == null || text == "") return false;
    var colTdQry = "#timeTable tr:not(:first) td:nth-child(" + (col + 2) + ")";
    var colTd = $(colTdQry);
    if (colTd.find(".layer:contains(" + text + ")").size() > 0) return false;

    var tdHeight = $("#timeTable tr:eq(1) td:eq(1)").height() + 2;
    var layerHeight = tdHeight * len - 1;
    var trgTd = $("#timeTable tr:eq(" + (row + 1) + ") td:eq(" + (col + 1) + ")");
    var maxLen = 0;
    
    var layer = $("<div class='layer' />")
        .css("position", "absolute")
        .css("background-color", color)
        .css("height", layerHeight + "px")
        .css("width", "100%")
        .text(text)
        .click(HideToggleGrp)
        .appendTo(trgTd)
        .parent().css("position", "relative").end();

    resizeDupLayer(layer,colTdQry);
    return true;
}
function resizeDupLayer(layer, colTdQry) {
    if (colTdQry == null)
        colTdQry = "#timeTable tr:not(:first) td:nth-child(" + 1 + layer.parent().index() + ")"; 
    var ind = $(colTdQry).find(".layer").index(layer);
    var hit = layer.collision(colTdQry + " .layer:not(:eq(" + ind + "))");
    var twidth = 0;
    for (var i = 0; i < hit.length; i++) {
        var width = Number(hit[i].style.width.replace("%", ""));
        twidth += width;
    }
    if (hit.length == 0) return;
    var firstWidth = Number(hit[0].style.width.replace("%", ""));
    if (twidth < 100) { //there's a hole to fit in
        layer.css("width", firstWidth + "%");
        for (var i = 0; hit.length > 0; i++) {//find hole
            layer.css("left", firstWidth * i + "%");
            hit = layer.collision(colTdQry + " .layer:not(:eq(" + ind + "))");
        }
    } else { //no hole. resize all
        var len = 1 / firstWidth * 100;
        for (var i = 0; i < hit.length; i++) {
            var o = $(hit[i]);
            var marginLeft = Number(hit[i].style.marginLeft.replace("%", ""));
            $(o).css("width", 100 / (len + 1) + "%")
                .css("left", 100 / (len + 1) * (marginLeft / firstWidth) + "%");
        }
        layer.css("width", 100 / (len + 1) + "%")
            .css("left", 100 - (100 / (len + 1)) + "%");
    }
}
function HideToggleGrp() {
    var txt = $(this).text();
    var no = txt.split(" ")[0];
    var trg = $("div.layer:contains(" + no + ")");
    var isHiding=Number($(this).css("opacity")) > 0.4;
    trg.css("opacity",  isHiding? "0.2" : "0.6");
    //trg.css("color",isHiding?"black":"white");
    $("#wanted tr:not(:first) td:nth-child(2):contains(" + no + ")").parent().find("td:first a:first").text(isHiding ? "숨김" : "보임");
    showResult();
}
function showResult() {
    $("table#resultTable tr:not(:first,:last)").remove();
    var totalScr = 0;
    $("#wanted tr:not(:first) td:nth-child(1):contains(보임)").parent().each(function (i, r) {
        var name = $(r).find("td:eq(2)").text();
        var no = $(r).find("td:eq(1)").text();
        if (Number($(r).css("opacity")) > 0.4 && $("table#resultTable tr:not(:first,:last) td:nth-child(1):contains(" + no + ")").size() == 0) {
            var scr = Number($(r).find("td:eq(3)").text());
            $("table#resultTable tr:last").before(
                $("<tr />").append(
                    $("<td />").text(no),
                    $("<td />").text(name),
                    $("<td />").text(scr)
                )
            );
            totalScr += scr;
        }
    });
    $("table#resultTable td:last").text(totalScr);
}
function loadTest() {
    addLayer(0, 12, 3, "red", "2094 컴퓨터구조론1");
    addLayer(0, 1, 3, "red", "2095 컴퓨터구조론1");
    addLayer(2, 15, 4, "orange", "3669 소프트웨어모델링및분석");
    addLayer(0, 9, 3, "blue", "3672 프로그래밍언어론");
    addLayer(0, 12, 3, "blue", "3673 프로그래밍언어론");
    addLayer(1, 4, 3, "yellow", "3674 화일처리");
    addLayer(1, 1, 3, "yellow", "3675 화일처리");
    addLayer(0, 1, 3, "green", "3676 데이터통신");
    addLayer(3, 4, 3, "green", "3677 데이터통신");
    addLayer(0, 4, 3, "grey", "3775 운영체제");
    addLayer(0, 9, 3, "grey", "3776 운영체제");

    addLayer(3, 1, 2, "purple", "1061 야외스포츠(골프)");

    addLayer(1, 5, 2, "indigo", "2090 자료구조");
    addLayer(1, 12, 2, "indigo", "2091 자료구조");

    addLayer(2, 12, 3, "red", "2094 컴퓨터구조론1");
    addLayer(2, 1, 3, "red", "2095 컴퓨터구조론1");
    addLayer(4, 1, 4, "orange", "3669 소프트웨어모델링및분석");
    addLayer(2, 9, 3, "blue", "3672 프로그래밍언어론");
    addLayer(2, 12, 3, "blue", "3673 프로그래밍언어론");
    addLayer(3, 1, 3, "yellow", "3674 화일처리");
    addLayer(4, 5, 3, "yellow", "3675 화일처리");
    addLayer(2, 1, 3, "green", "3676 데이터통신");
    addLayer(4, 9, 3, "green", "3677 데이터통신");
    addLayer(2, 4, 3, "grey", "3775 운영체제");
    addLayer(2, 9, 3, "grey", "3776 운영체제");

    addLayer(3, 9, 2, "indigo", "2090 자료구조");
    addLayer(3, 14, 2, "indigo", "2091 자료구조");

    $("div.layer:contains(2095):first").click();
    $("div.layer:contains(3673):first").click();
    $("div.layer:contains(3674):first").click();
    $("div.layer:contains(3675):first").click();
    $("div.layer:contains(3677):first").click();
    $("div.layer:contains(3776):first").click();
    $("div.layer:contains(2090):first").click();
    $("div.layer:contains(2091):first").click();
}
var colorArr = ["magenta", "blue", "aqua", "red", "yello", "plum", "purple", "green", "brown", "Khaki", "hotpink"];
function makeREST(arr){
    var a=null,rst="?";
    while(a=arr.pop()){
        rst+=a+"="+$("[name="+a+"] option:selected").val()+"&";
    }
    return rst;
}
$(document).ready(function () {
    var url = 'http://kupis.konkuk.ac.kr/sugang/acd/cour/time/SeoulTimetableInfo.jsp';
    doExternalAjax(url);
    yqlAjax("http://www.konkuk.ac.kr/jsp/Intro/intro_05_02_tab01.jsp", function (data) {
        var trg = $("#wantSelector"); //요람
        var select = $(data).find("table tr:first select");
        if(select.text())
        select.attr("onchange", "").change(function () {
            var url = $(this).find(":selected").val();
            var a = $(this).parent().find("a:first");
            a.attr("href", url);
            if (url.substr(-4) == ".pdf")
                a.attr("download", "")
                    .removeAttr("target")
                    .text("다운로드");
            else 
                a.removeAttr("download")
                        .attr("target","_blank")
                        .text("열기");
        })
            .find("option:first").remove().end()
            .prependTo(trg);

        //var lastYoram=select.find("option:last");
        //var url = lastYoram.val();
        $("<a />").insertAfter(select)
            .after($("<span>&nbsp;&nbsp;&nbsp;'요람 안에 수강신청의 모든 답이 있다.' -by sunbaenim</span>"));
        select.find("option:last").prop("selected", true).change();
    });
    $("button#searchButt").hide().click(function () {
        //ltYy=&ltShtm=&openSust=&pobtDiv=&cultCorsFld=&sbjtId=&sbjtNm=
        doExternalAjax(url + makeREST(["ltYy","ltShtm","openSust","pobtDiv"])+"sbjtId="+$("[name=sbjtId]").val()+
            "&sbjtNm="+$("[name=sbjtNm]").val());
        return false;
    });
    $("button#addButt").click(function () { //manual add
        var form = $(this).parent();
        var no = form.find("#no").val();
        var find = $("#wanted td:nth-child(2):contains(" + no + ")").parent();
        var color = form.find("#color").val();
        var name = form.find("#name").val();
        var room = form.find("#room").val();
        var week = form.find("#week").val();
        var time = Number(form.find("#time").val());
        var cls=Number(form.find("#class").val());
        var weekClassRoom = week + cls + "-" + (time + cls) + (room == "" ? "" : "(" + room + ")");
        if (find.size() > 0) {
            color = $("#timeTable .layer:contains(" + no + "):first").css("background-color");
            name = find.find("td:eq(2)").text();
            time = Number(find.find("td:eq(4)").text());
            find.find("td:eq(5)").append(", " + weekClassRoom);
        } else if (color == "")
            color = colorArr.pop();
        if (false == addLayer(
            ["월", "화", "수", "목", "금"].indexOf(week),
            cls,
            time,
            color,
            no+" "+name+" "+room
        ))
            colorArr.push(color);
        //else {
            if (find.size() == 0)
                addWanted(no, name, form.find("#score").val(), time,
                    weekClassRoom, form.find("#prof").val(), form.find("#etc").val());
            showResult();
        //}
        form.find("input").val("")
            [0].focus();
        return false;
    });
    //setTimeout(loadTest, 500);
});
function formatStr(str) {
    var daytime = str.match(/[월화수목금토일][0-9]{2}-[0-9]{2}/);
    if (daytime) daytime = daytime[0];
    else return null;
    //var clocks = str.match(/[0-9]{4}-[0-9]{4}/);
    //if (clocks) clocks = clocks[0];
    //else return null;
    return {
        day:daytime.charAt(0),
        startClass:Number(daytime.substr(1,2)),
        endClass: Number(daytime.substr(-2)),
        //startClock: clocks.substr(4),
        //endClock:clocks.substr(-4),
        room:str.match(/\([^)]+\)/)[0].replace(/\(|\)/g,"")
    };
}
function addThisLine(e) {
    var tr = $(e.target).parent().parent();
    var no = tr.find("td:eq(3) :first").text();
    var title = tr.find("td:eq(4) :first").clone();
    var scr = Number(tr.find("td:eq(5) :first").text());
    var time = Number(tr.find("td:eq(6) :first").text());
    var prof = tr.find("td:eq(9) :first").text();
    var etc = tr.find("td:eq(14) :first").text();
    var color = colorArr.pop();
    var dayTimeRoom = tr.find("td:eq(8) :first").text();
    var arr = dayTimeRoom.split(",");
    var item = null,rst=false;
    while (item = arr.pop()) {
        item = item.trim();
        if (item == "") continue;
        var ans = formatStr(item);
        rst = ans ? addLayer(["월", "화", "수", "목", "금", "토", "일"].indexOf(ans.day),
            ans.startClass,
            time,
            color,
            no + " " + title.first().text() + " " + ans.room) : true;
        /* how data fills form */
        /*$("#addForm input#name").val(no + " " + title + " " + ans.room);
        $("#addForm input#week").val(ans.day);
        $("#addForm input#class").val(ans.startClass);
        $("#addForm input#time").val(time);
        $("#addForm button#addButt").click();*/
    }
    if (rst) {
        addWanted(no, title, scr, time, dayTimeRoom, prof, etc);
        showResult();
    } else
        colorArr.push(color);
}
//yahoo yql을 이용한 외부페이지 로드
function yqlAjax(url, fn) {
    return $.getJSON("http://query.yahooapis.com/v1/public/yql?q=" +
        encodeURIComponent("select * from html where url=\"" + url + "\"") +
            "&format=xml'&callback=?", function (data) {
                if (data.results[0])
                    data = filterData(data.results[0],url);
                
                fn(data);
            });
}
//return : 성공시 data, 실패시 null
var extLoadData = null;
function doExternalAjax(url) {
    // assemble the YQL call
    yqlAjax(url,function (data) {
        if (!extLoadData) {
            var needed = $(data).find("table:first p");
            needed.find("[name=pobtDiv]").attr("onchange", "").change(function () {
                if (["기교", "핵교", "일교"].indexOf($(this).find("option:selected").text()) >= 0)
                    $("select[name=cultCorsFld]").parent().show();
                else
                    $("select[name=cultCorsFld]").parent().hide();
            }).end() //이수구분
                .find("option:contains(선택)").remove().end()
                .find("[name=ltYy] option:last").prop("selected", true).end()
                .find(":button").remove().end() //remove all jscripted buttons
                .prependTo($("#searchForm"))
                .find("select[name=pobtDiv]").change().end() //cuz upperlines makes pobt value changed
                .last().append($("#searchForm button").detach().show());
        } else
            $(data).find("table:last").attr("id", "searched")
                .find("tr:first").prepend($("<td>선택</td>"))
                    .find("td").removeAttr("width").end()
                .nextAll().each(function(i,r){
                    if ($("td", r).size() > 1)
                        $(r).prepend(
                            $("<td />").append(
                                $("<a href='javascript:'>추가</a>").click(this, addThisLine)
                            )
                        );
                }).find("td:nth-child(5) a").attr("href", function (i, a) {
                    return a.replace(/\([^)]*\)/, '("' + url.match(/ltYy=[^=&]+/)[0].replace(/[^=]+=/, '') + '","' +
                        url.match(/ltShtm=[^=&]+/)[0].replace(/[^=]+=/, '') + '",' +
                        a.match(/'[^']+'/)[0] +
                        ')');
                }).end()
                .parent().parent()
            .replaceAll($("#searched"));
        
        extLoadData = true;
        //extLoadData = data;
    });
}
function filterData(data,url) {
    // filter all the nasties out
    // no body tags
    data = data.replace(/<?\/body[^>]*>/g, '');
    // no linebreaks
    data = data.replace(/[\r|\n]+/g, '');
    // no comments
    data = data.replace(/<--[\S\s]*?-->/g, '');
    // no noscript blocks
    data = data.replace(/<noscript[^>]*>[\S\s]*?<\/noscript>/g, '');
    // no script blocks
    data = data.replace(/<script[^>]*>[\S\s]*?<\/script>/g, '');
    // no self closing scripts
    data = data.replace(/<script.*\/>/, '');
    // [... add as needed ...]
    if (url) {
        var lastDir = url.replace(/[^\/]+([^\/]$)/g, '');
        //data = data.replace(/src='/gi, 'src=\'' + lastDir);
        //data = data.replace(/src="/gi, 'src=\"' + lastDir);
        data = data.replace(/(\.\.[\/]){2}/g, lastDir + "../../");
        data = data.replace(/[^\/]+[\/]\.\.[\/]/g, '')
        data = data.replace(/[^\/]+[\/]\.\.[\/]/g, '')
    }
    return data;
}
function doPlanPop(ltYy,ltShtm,sbjtId) {
    window.open("http://kupis.konkuk.ac.kr/sugang/acd/cour/plan/CourLecturePlanInq.jsp?ltYy=" + ltYy + "&ltShtm=" + ltShtm + "&sbjtId=" + sbjtId);
}
function doDetailPop(ltYy, haksuId) {
    window.open("http://kupis.konkuk.ac.kr/sugang/acd/cour/plan/CourLectureDetailInq.jsp?openYy=" + ltYy + "&haksuId=" + haksuId);
}
function doPop(ltYy, ltShtm, sbjtId) {
    yqlAjax("http://kupis.konkuk.ac.kr/sugang/acd/cour/aply/CourInwonInqTime.jsp?ltYy=" + ltYy + "&ltShtm=" + ltShtm + "&sbjtId=" + sbjtId,
        function (data) {
            var table = $(data).find("table:last");
            var cur = table.find("tr:eq(0) td:eq(1)").text().trim();
            var tot = table.find("tr:eq(1) td:eq(1)").text().trim();
            if (cur && tot)
                $("#searched tr td:nth-child(4):contains(" + sbjtId + ")").parent().find("td:last").html(cur + " / " + tot+" ").append(
                    $('<a href="javascript:" />').text('r').click(doPop(ltYy,ltShtm,sbjtId))
                );
        }
    );
}
