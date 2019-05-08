/**
 * Created by llb on 2019/1/23.
 */
// todo set constructor
var utils = {}

utils.exportExcel = function (options) {
    startExportExcel(options)

    function startExportExcel(options) {
        var csv = ''
        if (options.jsonData) {
            csv = json2csv(options.jsonData,options.title)
        } else {
            csv = table2csv(options.tableEle);
        }
        var sheet = csv2sheet(csv);
        var blob = sheet2blob(sheet);
        options.fileName = options.fileName ? options.fileName + '.xlsx' : '下载.xlsx'
        openDownloadDialog(blob, options.fileName);
    }

    function json2csv(jsonData,title) {
        //列标题，逗号隔开，每一个逗号就是隔开一个单元格
        var str = title;
        //增加\t为了不让表格显示科学计数法或者其他格式
        for(var i = 0 ; i < jsonData.length ; i++ ){
            for(var item in jsonData[i]){
                str += jsonData[i][item] + '\t,';
            }
            str+='\n';
        }
        return str
    }
    // todo 将table转换为csv
    function table2csv(table) {
        var csv = [];
        $(table).find('tr').each(function() {
            var temp = [];
            $(this).find('td').each(function() {
                temp.push($(this).html());
            })
            temp.shift(); // 移除第一个
            csv.push(temp.join(','));
        });
        csv.shift();
        return csv.join('\n');
    }
    // todo csv转sheet对象
    function csv2sheet(csv) {
        var sheet = {}; // 将要生成的sheet
        csv = csv.split('\n');
        csv.forEach(function(row, i) {
            row = row.split(',');
            if(i == 0) sheet['!ref'] = 'A1:'+String.fromCharCode(65+row.length-1)+(csv.length-1);
            row.forEach(function(col, j) {
                sheet[String.fromCharCode(65+j)+(i+1)] = {v: col,s:{alignment: {horizontal: "center" , vertical: "center"}}};
            });
        });
        if (options.merges) sheet['!merges'] = options.merges
        if (options.cols) sheet['!cols'] = options.cols
        return sheet;
    }
    // todo 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
    function sheet2blob(sheet, sheetName) {
        sheetName = sheetName || 'sheet1';
        var workbook = {
            SheetNames: [sheetName],
            Sheets: {}
        };
        workbook.Sheets[sheetName] = sheet;
        // 生成excel的配置项
        var wopts = {
            bookType: 'xlsx', // 要生成的文件类型
            bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
            type: 'binary'
        };
        var wbout = XLSX.write(workbook, wopts);
        var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
        // 字符串转ArrayBuffer
        function s2ab(s) {
            var buf = new ArrayBuffer(s.length);
            var view = new Uint8Array(buf);
            for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
            return buf;
        }
        return blob;
    }
    /**
     * 通用的打开下载对话框方法，没有测试过具体兼容性
     * @param url 下载地址，也可以是一个blob对象，必选
     * @param saveName 保存文件名，可选
     */
    function openDownloadDialog(url, saveName) {
        if (typeof url == 'object' && url instanceof Blob) {
            url = URL.createObjectURL(url); // 创建blob地址
        }
        var aLink = document.createElement('a');
        aLink.href = url;
        aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
        var event;
        if (window.MouseEvent) event = new MouseEvent('click');
        else {
            event = document.createEvent('MouseEvents');
            event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        }
        aLink.dispatchEvent(event);
    }
}

utils.checkAll = function (allInputId, className) {
    var allCheck = document.getElementById(allInputId)
    var checkArr = document.getElementsByClassName(className)

    // console.log(allCheck, checkArr)

    allCheck.onclick = function () {
        for (var i=0;i<checkArr.length;i++){
            checkArr[i].checked = this.checked
        }
    }

    for (var i=0;i<checkArr.length;i++){
        checkArr[i].onclick = function () {
            var status = true
            for (var i=0;i<checkArr.length;i++){
                if(!checkArr[i].checked) {
                    status = false
                }
            }
            // console.log(status)
            allCheck.checked = status
        }
    }

}
