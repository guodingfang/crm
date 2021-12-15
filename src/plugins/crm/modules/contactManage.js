layui.extend({
  info: `{/}${layui.request.getContextPath()}/plugins/crm/utils/getInfo`,
  operate: `{/}${layui.request.getContextPath()}/plugins/crm/utils/operate`,
}).define(['table', 'form', 'util', 'info', 'operate'], function(exports){
  const table = layui.table,
    util = layui.util,
    form = layui.form,
    info = layui.info,
    operate = layui.operate;

  //监听搜索
  operate.searchForm({}, () => {})

  table.render({
    elem: '#table-list'
    ,url:`${crmURL}/customerLiaison/queryLiaison`
    ,toolbar: '#toolbar' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter']
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
    ,height: 'full-256'
    ,parseData: function(res) {
      const total = res.total || 0
      $('#total').html(`（共${total}个）`)
      return {
        code: 0,
        msg: res.msg,
        count: res.total,
        data: res.data
      }
    }
    ,cols: [[
      {field:'id', width:60,align:'center', title: '序号', type: 'numbers'}
      ,{field:'name', width:150, title: '联系人姓名', templet: ({ liaisonId, name }) => {
          return `<span class="cell-btn-item-line" data-type="edit" data-id="${liaisonId}">${name}</span>`
        }}
      ,{field:'mainContact', width:90, align: 'center', title: '主要联系人', templet: ({ mainContact }) => {
          return isMainCustomer[mainContact]
        }}
      ,{field:'phoneNum', width:160, align: 'center', title: '联系电话' }
      ,{field:'orgName', width:160, align: 'center', title: '部门' }
      ,{field:'job', width:150, align: 'center', title: '职务' }
      ,{field:'customerName', minWidth: 250, title: '所属客户' }
      ,{field:'character', width:120, align: 'center', title: '客户性质'}
      ,{field:'managerName', width:160, align: 'center', title: '客户经理'}
      ,{field: 'operation', width:150, title: '操作', align: 'center', fixed: 'right', toolbar: '#table-content-list'}
    ]]
    ,page: true
    ,request: {
      pageName: 'current',
      limitName: 'size',
    }
    ,limit: 50
    ,limits: [50, 100, 150, 200]
    ,done: function (res, curr, count) {
      $('.cell-btn-item-line').on('click', function(){
        var type = $(this).data('type');
        var id = $(this).data('id');
        active[type] ? active[type].call(this, id) : '';
      });
    }
  })


  // 监听table操作
  table.on('tool(table-list)', function(obj) {
    const data = obj.data;
    if (obj.event === 'edit') {
      operate.addContact(data, {
        title: '联系人详情',
        operate: 'edit',
        btn: [
          {type: 'save', name: '保存'},
          {type: 'cancel', name: '取消'}
        ]
      })
    } else if (obj.event === 'del') {
      layer.confirm('确定删除联系人？', function(index){
        operate.ajaxGet('customerLiaison/remove', {
          id: data.liaisonId
        }, () => {
          obj.del();
          layer.close(index);
        })
      });
    }
  })

  // 操作
  var active = {
    add: () => {
      operate.addContact({}, {
        title: '新建联系人',
        operate: 'apply',
        btn: [
          {type: 'save', name: '保存'},
          {type: 'cancel', name: '取消'}
        ]
      })
    },
    edit: (id) => {
      const tableData = table.cache["table-list"] || [];
      const data = tableData.find(item => item.liaisonId.toString() === id.toString()) || null;
      operate.addContact(data, {
        title: '联系人详情',
        operate: 'edit',
        btn: [
          {type: 'save', name: '保存'},
          {type: 'cancel', name: '取消'}
        ]
      })
    },
  };

  $('.layui-btn.layuiadmin-btn-list').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });

  exports('contact', {})
});
