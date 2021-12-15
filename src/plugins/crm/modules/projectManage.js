layui.extend({
  info: `{/}${layui.request.getContextPath()}/plugins/crm/utils/getInfo`,
  operate: `{/}${layui.request.getContextPath()}/plugins/crm/utils/operate`,
}).define(['table', 'form', 'util', 'info', 'dropdown', 'operate'], function(exports){
  const table = layui.table,
    util = layui.util,
    form = layui.form,
    info = layui.info,
    dropdown = layui.dropdown,
    operate = layui.operate;

  table.render({
    elem: '#table-list'
    ,url:`${crmURL}/customerLiaison/queryLiaison`
    ,toolbar: '#table-list-toolbar' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter']
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
    ,height: 'full-310'
    ,parseData: function(res) {
      return {
        code: 0,
        msg: res.msg,
        count: res.total,
        data: res.data
      }
    }
    ,cols: [[
      {field:'id', width:60,align:'center', title: '序号', type: 'numbers'}
      ,{field:'name', width:200, title: '项目编号', templet: ({ id, name }) => {
          return `<span class="cell-btn-item-line" data-type="look" data-id="${id}">${name}</span>`
        }}
      ,{field:'mainContact', width:100, align: 'center', title: '项目名称'}
      ,{field:'phoneNum', width:120, title: '项目类型' }
      ,{field:'orgName', width:100, align: 'center', title: '状态' }
      ,{field:'job', width:100, title: '售前状态/跟踪阶段' }
      ,{field:'customerName', width: 100, title: '项目状态' }
      ,{field:'character', width:120, title: '所属客户'}
      ,{field:'managerName', width:150, title: '客户经理'}
      ,{field:'customerName', width: 100, title: '项目经理' }
      ,{field:'character', width:120, title: '服务经理'}
      ,{field:'managerName', width:150, title: '立项金额'}
      ,{field: 'operation', title: '操作', align: 'center', width: 120, fixed: 'right', toolbar: '#table-content-list'}
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
    if (obj.event === 'look') {
      operate.lookOA('productInfo/getOaProcess', {
        oaId: data.oaId || ''
      })
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
      const data = tableData.find(item => item.id.toString() === id.toString()) || null;
    },
    look: () => {
      operate.openProjectDetails({},{
        title: '项目详情'
      })
    },
    contact: () => {
      operate.openContactModel({
        title: '查看联系人'
      })
    }
  };

  $('.layui-btn.layuiadmin-btn-list').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });

  const renderDropdown = () => {
    dropdown.render({
      elem: '#project-btn' //可绑定在任意元素中，此处以上述按钮为例
      ,data: [{
        title: '项目立项'
      }, {
        title: '经营类项目',
        type: 'manage-project'
      }, {
        title: '内部项目',
        type: 'interior-project'
      }, {
        title: '募投项目'
      }, {
        title: '在建工程'
      }]
      //菜单被点击的事件
      ,click: function({ title, type }){
        operate.approvalProject({},{
          title: '查看联系人',
          btn: [
            {type: 'save', name: '保存'},
            {type: 'cancel', name: '取消'}
          ],
        })
      }
    });
  }

  exports('project', {
    renderDropdown
  })
});
