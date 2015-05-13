function addWanted(no, name, score, time, dayTimeRoom, prof, etc) {
  $('<tr />').append(
    $('<td />')
      .append($('<a href="javascript:">보임</a>').css('margin', '0 5px 0 5px').click(function () {
        var isHiding = $(this).text() == '보임';
        $(this).text(isHiding ? '숨김' : '보임');
        $('#timeTable .layer:contains(' + no + ')').css('opacity',isHiding ? '.5' : '1');
        showResult();
      }))
      .append($('<a href="javascript:">삭제</a>').css('margin', '0 5px 0 5px').click(function () {
        var layer = $('#timeTable .layer:contains(' + no + ')');
        colorArr.push(layer.css('background-color'));
        layer.each(function (i, l) {
          var colQry = '#timeTable tr:not(:first) td:nth-child(' + ($(l).parent().index() + 1) + ')';
          $(l).remove();
          $(colQry).find('.layer').each(function (i, l) {
            $(l).css('width', '100%').css('left','0%');
          }).each(function (i, l) {
            resizeDupLayer($(l), colQry);
          });
        });
        $(this).parent().parent().remove();
        showResult();
      })),
    $('<td />').text(no),
    $('<td />').append(name),
    $('<td />').text(score),
    $('<td />').text(time),
    $('<td />').text(dayTimeRoom),
    $('<td />').text(prof),
    $('<td />').text(etc)
  ).appendTo($('#wanted'));
}
function addLayer(col, row, len, color, text) {
  //console.log(col,row,len,color,text);
  if (col < 0 || col > 6) return false;
  if (row < 0 || row + len - 1 > 21) return false;
  if (color == null || color == '') return false;
  if (text == null || text == '') return false;
  var colTdQry = '#timeTable tr:not(:first) td:nth-child(' + (col + 2) + ')';
  var colTd = $(colTdQry);
  if (colTd.find('.layer:contains(' + text + ')').size() > 0) return false;

  var tdHeight = $('#timeTable tr:eq(1) td:eq(1)').height() + 2;
  var layerHeight = tdHeight * len - 1;
  var trgTd = $('#timeTable tr:eq(' + (row + 1) + ') td:eq(' + (col + 1) + ')');
  var maxLen = 0;

  var layer = $('<div class="layer" />')
    .css('position', 'absolute')
    .css('background-color', color)
    .css('height', layerHeight + 'px')
    .css('width', '100%')
    .text(text)
    .click(HideToggleGrp)
    .appendTo(trgTd)
    .parent().css('position', 'relative').end();

  resizeDupLayer(layer,colTdQry);
  return true;
}
function resizeDupLayer(layer, colTdQry) {
  if (colTdQry == null)
    colTdQry = '#timeTable tr:not(:first) td:nth-child(' + (1 + layer.parent().index()) + ')';
  var ind = $(colTdQry).find('.layer').index(layer);
  layer.css('width', '100%').css('left','0%');
  var hit = layer.collision(colTdQry + ' .layer:not(:eq(' + ind + '))');
  var twidth = 0;
  for (var i = 0; i < hit.length; i++) {
    var width = Number(hit[i].style.width.replace('%', ''));
    twidth += width;
  }
  if (hit.length == 0) return;
  var firstWidth = Number(hit[0].style.width.replace('%', ''));
  if (twidth < 100) { //there's a hole to fit in
    layer.css('width', firstWidth + '%');
    for (var i = 0; i <= hit.length; i++) {//find hole
      layer.css('left', firstWidth *i + '%');
      hit = layer.collision(colTdQry + ' .layer:not(:eq(' + ind + '))');
      if (!hit) break;
      else if (hit.length == 1)
        if (Math.abs(Number(hit[0].style.left.replace('%', '')) - Number(layer.get(0).style.width.replace('%', '')) - Number(layer.get(0).style.left.replace('%', ''))) < 1)
          break;
      }
  } else { //no hole. resize all
    var len = hit.length; //1 / firstWidth * 100;
    var width = 100 / (len + 1);
    for (var i = 0; i < hit.length; i++) {
      var o = $(hit[i]);
      $(o).css('width', width + '%')
        .css('left', width * (i + 1) + '%');
    }
    layer.css('width', width + '%')
      .css('left', '0%');
  }
}
function HideToggleGrp() {
  var txt = $(this).text();
  var no = txt.split(' ')[0];
  var trg = $('div.layer:contains(' + no + ')');
  var isHiding=Number($(this).css('opacity')) > 0.5;
  trg.css('opacity',  isHiding? '.5' : '1');
  //trg.css("color",isHiding?"black":"white");
  $('#wanted tr:not(:first) td:nth-child(2):contains(' + no + ')').parent().find('td:first a:first').text(isHiding ? '숨김' : '보임');
  showResult();
}
function showResult() {
  $('table#resultTable tr:not(:first,:last)').remove();
  var totalScr = 0;
  $('#wanted tr:not(:first) td:nth-child(1):contains("보임")').parent().each(function (i, r) {
    var tds = $('td', r);
    //console.log(window.td = tds);
    var name = tds.eq(2).text();
    var no = tds.eq(1).text();
    if (Number($(r).css('opacity')) > 0.5 && $('table#resultTable tr:not(:first,:last) td:nth-child(1):contains(' + no + ')').size() == 0) {
      var scr = Number(tds.eq(3).text());
      $('table#resultTable tr:last').before(
        $('<tr />').append(
          $('<td />').text(no),
          $('<td />').text(name),
          $('<td />').text(scr)
        )
      );
      totalScr += scr;
    }
  });
  $('table#resultTable td:last').text(totalScr);
}
var colorArr = [];
function makeREST(arr){
  var a=null,rst="?";
  while(a=arr.pop()){
    rst+=a+"="+$("[name="+a+"] option:selected").val()+"&";
  }
  return rst;
}
$(document).ready(function () {
    for (var i = 3; i >= 0; i--)
        for (var j = 0; j < 9; j++)
            colorArr.push('hsla(' + (j * 36) + ',' + (100 - i * 20) + '%,' + (50 - i * 20) + '%,.25)');
    var url = 'http://kupis.konkuk.ac.kr/sugang/acd/cour/time/SeoulTimetableInfo.jsp';
    doExternalAjax(url);
    yqlAjax("http://www.konkuk.ac.kr/jsp/Intro/intro_05_02_tab01.jsp", function (data) {
        //console.debug(window.db= data);
        var trg = $("#wantSelector"); //요람
        var select = $(data);
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
            .find('option:first').remove().end()
            .prependTo(trg);

        //var lastYoram=select.find("option:last");
        //var url = lastYoram.val();
        $("<a />").insertAfter(select)
            .after($("<span>&nbsp;&nbsp;&nbsp;'요람 안에 수강신청의 모든 답이 있다.' -by sunbaenim</span>"));
        select.find("option:first").prop("selected", true).change();
    },'//select[@name="select"]');
    $("button#searchButt").hide().click(function () {
        //ltYy=&ltShtm=&openSust=&pobtDiv=&cultCorsFld=&sbjtId=&sbjtNm=
        doExternalAjax(url + makeREST(["ltYy","ltShtm","openSust","pobtDiv"])+"sbjtId="+$("[name=sbjtId]").val()+
            "&sbjtNm=" + $("[name=sbjtNm]").val());
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
    var daytime = str.match(/[월화수목금토일][0-9]{2}(-[0-9]{2})?/);
    if (daytime) daytime = daytime[0];
    else return null;
    //var clocks = str.match(/[0-9]{4}-[0-9]{4}/);
    //if (clocks) clocks = clocks[0];
    //else return null;
    var roomStr=str.match(/\([^)]+\)/);
    roomStr = roomStr?roomStr[0]:'';
    return {
        day:daytime.charAt(0),
        startClass:Number(daytime.substr(1,2)),
        endClass: Number(daytime.substr(-2)),
        //startClock: clocks.substr(4),
        //endClock:clocks.substr(-4),
        room:roomStr.replace(/\(|\)/g,"")
    };
}
function addThisLine(e) {
    var tds = $(e.target).parent().parent().find('td');
    //console.log(window.tds=tds);
    var no = tds.eq(3).text();
    var title = tds.eq(4).find(':first').clone();
    var scr = Number(tds.eq(5).text());
    var time = Number(tds.eq(6).text());
    var prof = tds.eq(9).text();
    var etc = tds.eq(14).text();
    var color = colorArr.pop();
    var dayTimeRoom = tds.eq(8).text();
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
            no + " " + title.text() + " " + ans.room) : true;
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
function yqlAjax(url, fn, xpath) {
    return $.getJSON('http://query.yahooapis.com/v1/public/yql?q=' +
        encodeURIComponent('select * from html where url="' + url + '"' + (xpath? " and xpath='"+xpath+"'" : '')) +
            '&format=xml&callback=?', function (data) {
                /* //JSON format
                console.log(data.query.results);
                if (data.query.results)
                    data = data.query.results;*/
                    //data = filterData(data.results[0],url);
                //console.log(window.d = data);
                //if (data.results[0])
                if (data.results)
                    data = data.results//filterData(data.results[0],url);
                if (data.length == 1) data = data[0]
                fn(data);
            });
}
function addSyncIconOn(trg,size) {
    $('<img />').addClass('sync').width(size?size:100).attr('src', './images/loading.gif').appendTo(trg);
}
//return : 성공시 data, 실패시 null
var extLoadData = null;
function doExternalAjax(url) {
    addSyncIconOn($('#searchButt').parent(),18);
    // assemble the YQL call
    if (!extLoadData)
        yqlAjax(url,function (data) {
            $(data[0]).find("[name=pobtDiv]").attr("onchange", "").change(function () {
                if (["기교", "핵교", "일교"].indexOf($(this).find("option:selected").text()) >= 0)
                    $("select[name=cultCorsFld]").parent().show();
                else
                    $("select[name=cultCorsFld]").parent().hide();
            }).find('option:last').prop('selected', true).end()
                .end() //이수구분
                .find('option:contains("선택")').remove().end()
                .find('[name=ltYy] option:last').prop("selected", true).end()
                .find(':button').remove().end() //remove all jscripted buttons
                .prependTo($('#searchForm'))
                .find('select[name=pobtDiv]').change().end() //cuz upperlines makes pobt value changed
                .last().append($("#searchForm button").detach().show());
            extLoadData = true;
            $('.sync').remove();
        },'//table[1]');
    else
        yqlAjax(url, function(data){
            $(data[data.length-1]).attr("id", "searched")
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
        $('.sync').remove();
    },'//table[last()]');
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

function doDetailPop(ltYy, haksuId) {
    window.open("http://kupis.konkuk.ac.kr/sugang/acd/cour/plan/CourLectureDetailInq.jsp?openYy=" + ltYy + "&haksuId=" + haksuId);
}
function doPop(ltYy, ltShtm, sbjtId) {
    addSyncIconOn($("#searched tr td:nth-child(4):contains(" + sbjtId + ")").parent().find("td:last"),12);
    yqlAjax("http://kupis.konkuk.ac.kr/sugang/acd/cour/aply/CourInwonInqTime.jsp?ltYy=" + ltYy + "&ltShtm=" + ltShtm + "&sbjtId=" + sbjtId,
        function (data) {
            var table = $(data).find("table:last");
            var cur = table.find("tr:eq(0) td:eq(1)").text().trim();
            var tot = table.find("tr:eq(1) td:eq(1)").text().trim();
            if (cur && tot)
                $("#searched tr td:nth-child(4):contains(" + sbjtId + ")").parent().find("td:last").html(cur + " / " + tot+" ").append(
                    $('<a href="javascript:" />').text('r').click(doPop(ltYy,ltShtm,sbjtId))
                );
            $('.sync').remove();
        }
    );
}
function ConvertTarget(){
    $('#wanted td:contains("숨김") a:eq(1)').click();
    var rst=$('#combine').clone().prepend($('body style').clone()).prepend($('body script').clone());
    $('#timeTable',rst).after($('#wanted',rst));
    $('#wanted',rst).before($('p:first',rst).text('-예비목록'));
    $('p:first',rst).text('-시간표');
    rst.append('html complete 형식으로 저장 후 html 파일의 이름을 바꾸고, "파일명_files"로 생성되는 폴더를 삭제하세요.');
    $('#wanted',rst).find('td:nth-child(1),th:nth-child(1)').remove();
    return rst;
}
function ConvertToExportPage() {
    $('body').html(ConvertTarget().html());
}
function OpenExportPage(){
    var path=document.URL;
    var dir=path.substring(0, path.lastIndexOf('/'));
    window.open('data:text/html;charset=utf-8,<!DOCTYPE html><head>'+
        '<title>Universal Personal Lecture Time Table : http://192.168.25.15/school/upltt.html</title>'+
        '</head><body>'+ ConvertTarget().html()+'</body>');
}
