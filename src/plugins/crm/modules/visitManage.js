layui.extend({
  info: `{/}${layui.request.getContextPath()}/plugins/crm/utils/getInfo`,
  operate: `{/}${layui.request.getContextPath()}/plugins/crm/utils/operate`,
}).define(['table', 'form', 'laytpl', 'util', 'info', 'operate'], function(exports){
  const table = layui.table,
    util = layui.util,
    laytpl = layui.laytpl,
    form = layui.form,
    info = layui.info,
    operate = layui.operate;

  const list = [
    {
      id: 1,
      name: '大区',
      children: [
        {id: 3, name: '北区（共XX条行动记录）', children: [
          {id: 15, name: '北区-小8（共XX条行动记录）'},
        ]},
        {id: 4, name: '北区-小噢（共XX条行动记录）'}
      ]
    },
    {
      id: 2,
      name: '二区',
      children: [
        {id: 5, name: '南区-小李（共XX条行动记录）'},
        {id: 6, name: '南区-小张（共XX条行动记录）'},
        {id: 7, name: '南区-小王（共XX条行动记录）'}
      ]
    }
  ]

  laytpl(userTabBar.innerHTML).render(list, function (html) {
    document.getElementById('userTabBarContainer').innerHTML = html
  })

  const renderTable = (el) => {
    table.render({
      elem: `#${el}`
      ,url:`${crmURL}/customerLiaison/queryLiaison`
      ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      ,height: 'full-500'
      ,parseData: function(res) {
        return {
          code: 0,
          msg: res.msg,
          count: res.total,
          data: res.data
        }
      }
      ,cols: [[
        {field:'id', width:60,align:'center', title: '星期'}
        ,{field:'name', width:200, title: '日期'}
        ,{field:'mainContact', width:100, align: 'center', title: '行动'}
        ,{field:'phoneNum', width:120, title: '客户名称' }
        ,{field:'orgName', width:100, align: 'center', title: '拜访人' }
        ,{field:'job', width:100, title: '地点' }
        ,{field:'customerName', width: 100, title: '时间' }
        ,{field:'character', width:120, title: '参与（陪同）人员'}
        ,{field:'managerName', width:150, title: '拜访目的'}
        ,{field:'customerName', width: 100, title: '沟通结果' }
        ,{field:'character', width:120, title: '后续行动计划'}
      ]]
      ,request: {
        pageName: 'current',
        limitName: 'size',
      }
      ,limit: 1000000
      ,done: function (res, curr, count) {

      }
    })
  }

  exports('visit', {
    renderTable
  })
});
