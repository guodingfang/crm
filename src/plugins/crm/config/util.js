function getQueryString(name) {
  var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
  var r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
}

const getDateRange = (dataStr) => {
  var reg = /\d{4}-\d{2}-\d{2}/g;
  var dateArr = dataStr.match(reg);
  if (!dateArr) return '';
  if (!(dateArr instanceof Array)) return '';
  dateArr = dateArr.map(date => (`${date} 00:00:00`))
  if (dateArr.length < 2) return dataStr;
  return dateArr
}


// get请求url拼接
function paramsStringSplit(params) {
  let paramsStr = ''
  for(let key in params){
    paramsStr += `${key}=${params[key]}&`
  }
  if (paramsStr.length) {
    paramsStr = paramsStr.slice(0, paramsStr.length-1)
  }
  return paramsStr
}

// 请求参数code and value 分离
function paramsCodeAndValueSplit(params, separator = '|') {
  let newParams = {}
  for(let key in params){
    const arr = params[key].split(separator)
    if(arr.length === 2) {
      const [ code, val ] = arr
      newParams[`${key}Code`] = code
      newParams[`${key}`] = val
    } else {
      newParams[key] = params[key]
    }
  }
  return newParams
}

// 客户经理选择
function selectTransferMain(mainSelectValue = '') {
  $(".layui-transfer-data:last>li").each(function() {
    $(this).find("button").remove()
    $(this).find(".transfer-li-mask").remove()
    if (mainSelectValue === $(this).find("input").attr('value')) {
      $(this).css('position', 'relative')
      // $(this).children('.layui-form-checkbox .layui-icon').css('background-color', '#000')
      $(this).append(`
        <div class="transfer-li-mask"></div>
        <button class='transfer-btn-select-main layui-btn layui-btn-normal layui-btn-xs'></button>
      `)
    } else {
      $(this).append(`
        <button class='transfer-btn-select-main layui-btn layui-btn-primary layui-btn-xs'></button>
      `)
    }
  })
}

// 获取组织结构tree
function getRestTree(data) {
  const dataArr = data instanceof Array ? data : [data]
  const getChildrenTree = (data) => {
    return {
      name: data.orgName,
      value: data.orgCode,
      children: data.childs ? data.childs.map(item =>
        getChildrenTree(item)
      ) : []
    }
  }
  return dataArr.map(item =>
    getChildrenTree(item)
  ) || []
}

// 合并单元格
function mergeTable({ data, mergeCol, mergeColIndex }) {
  var mergeIndex = 0;// 定位需要添加合并属性的行数
  var mark = 1; // 这里涉及到简单的运算，mark是计算每次需要合并的格子数
  var columsName = mergeCol;//需要合并的列名称
  var columsIndex = mergeColIndex;//需要合并的列索引值

  for (var k = 0; k < columsName.length; k++)//这里循环所有要合并的列
  {
    var trArr = $(".layui-table-body>.layui-table").find("tr");//所有行
    for (var i = 1; i < data.length; i++) { //这里循环表格当前的数据
      var tdCurArr = trArr.eq(i).find("td").eq(columsIndex[k]);//获取当前行的当前列
      var tdPreArr = trArr.eq(mergeIndex).find("td").eq(columsIndex[k]);//获取相同列的第一列
      if (data[i][columsName[k]] === data[i - 1][columsName[k]]) { //后一行的值与前一行的值做比较，相同就需要合并
        mark += 1;
        tdPreArr.each(function () {//相同列的第一列增加rowspan属性
          $(this).attr("rowspan", mark);
        });
        tdCurArr.each(function () {//当前行隐藏
          $(this).css("display", "none");
        });
      }else {
        mergeIndex = i;
        mark = 1;// 一旦前后两行的值不一样了，那么需要合并的格子数mark就需要重新计算
      }
    }
  }
}

// 对联系人列表进行判断
const judgeContactList = (data) => {
  let judge = true
  const liaisonList = data
  if (!liaisonList.length) {
    judge = false
    layer.msg('请输入至少一个联系人');
    return judge
  }
  liaisonList.map(item => {
    const { name = '', phoneNum = '', orgName = '', job = '' } = item
    if (!name || !phoneNum || !orgName || !job) {
      layer.msg('请填写完整联系人信息');
      judge = false
      return judge
    }
    const reg = /^1[3456789]\d{9}$/
    if (!reg.test(phoneNum)) {
      layer.msg(`联系人${name}的联系电话输入错误`);
      judge = false
      return judge
    }
  })
  return judge
}
