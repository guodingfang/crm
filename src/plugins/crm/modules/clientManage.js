layui.define(['table', 'form', 'util', 'info', 'operate'], function(exports){
  const table = layui.table,
    util = layui.util,
    form = layui.form,
    info = layui.info,
    operate = layui.operate;

  let role = ''

  const getUserRole = (cb) => {
    operate.ajaxGet('/user/getRole', { code: window.user.code }, (data) => {
      role = data || '无效角色'
      cb && cb(data)
    })
  }

  info.getCustomerCharacter('#character')
  info.getRegionInfo('#province', {
    params: {
      regionLevel: 0,
    }
  })

  info.getUsers('#manager', () => {}, {
    required: 'no',
    radio: true
  })

  // form表单监控
  form.on('select(layuiadmin-province)', (data) => {
    const [code] = data.value.split('|')
    if (code) {
      $('#city').removeAttr('disabled')
    } else {
      $('#city').attr('disabled', true)
    }
    info.getRegionInfo('#city', {
      clearData: !code,
      params: {
        regionLevel: 1,
        parentCode: code,
      }
    })
  })


  //监听搜索
  operate.searchForm({}, () => {})

  $('#reset').on('click',function (data) {
    $('#city').attr('disabled', true)
  })

  table.render({
    elem: '#table-list'
    ,url:`${crmURL}/customer/queryCustomer`
    ,toolbar: '#toolbar' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter', 'exports']
    ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
    ,height: 'full-306'
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
      ,{field:'customerName', width:250, title: '客户名称', templet: ({ id, customerName }) => {
          return `<span class="cell-btn-item-line" data-type="user" data-id="${id}">${customerName}</span>`
        }}
      ,{field:'status', width:100, align: 'center', title: '状态', templet: ({ status}) => {
          return `<div class="cell-status"><span style="background-color: ${customerStatusStyle[status]}"></span>${customerStatus[status]}</div>`
        }}
      ,{field:'character', width:100, align: 'center', title: '客户性质' }
      ,{field:'type', width:100, align: 'center', title: '客户类型'}
      ,{field:'active', width:110, align: 'center', title: '是否活跃客户', templet: ({ active }) => {
          return customerActiveStatus[active]
        }}
      ,{field:'province', width: 80, align: 'center', title: '所在省份' }
      ,{field:'city', width:100, align: 'center', title: '所在城市'}
      ,{field:'manage', width:110, align: 'center', title: '客户经理', templet: ({ managerList }) => {
          return managerList.length ? managerList[0].managerName : ''
        }}
      ,{field:'dep', width:150, align: 'center', title: '业务部门', templet: ({ managerList }) => {
          return managerList.length ? managerList[0].orgName : ''
        }}
      ,{field:'latestDate', width:120, align: 'center', title: '最近拜访日期' }
      ,{field:'contact', width:100, align: 'center', title: '联系人', templet: ({ id }) => {
          return `<span class="cell-btn-item-line" data-type="contact" data-id="${id}">查看</span>`
        }}
      ,{field:'createDate', width:150, align: 'center', title: '创建时间',}
      ,{field:'updateDate', width:150, align: 'center', title: '更新时间'}
      ,{field: 'operation', title: '操作', align: 'center', width: 120, fixed: 'right', toolbar: '#table-content-list'}
    ]]
    ,page: true
    ,request: {
      pageName: 'page',
      limitName: 'limit',
    }
    ,limit: 50
    ,limits: [50, 100, 150, 200]
    ,done: function (res, curr, count) {
      $('.cell-btn-item-line').on('click', function(){
        var type = $(this).data('type');
        var id = $(this).data('id');
        active[type] ? active[type].call(this, id) : '';
      });

      $('.layui-btn.layuiadmin-btn-list').on('click', function(){
        var type = $(this).data('type');
        active[type] ? active[type].call(this) : '';
      });
    }
  })

  // 监听table操作
  table.on('tool(table-list)', function(obj) {
    const data = obj.data;
    if (obj.event === 'look') {
      lookCustomer(data)
    } else if (obj.event === 'delete') {
      layer.confirm('确定删除产品？', function(index){
        operate.ajaxGet('customer/delete', { customerId: data.id }, () => {
          obj.del();
          layer.close(index);
        })
      });
    } else if (obj.event === 'audit') {
      $.get(`${crmURL}/customer/reg/pass?customerId=${data.id}`, function ({ code, msg }) {
        if (code === 0) {
          layer.msg("审核通过",{time:2000});
          table.reload('table-list')
          return
        }
        layer.msg(msg);
      })
    }
  })

  const lookCustomer = (data) => {
    if (data.status === 1) {
      operate.openClientDetails(data, {
        title: '客户详情',
      })
      return
    }

    let btn = [],
      readOnly = false

    if (data.status === 0) {
      if (role === '超级管理员' || role === 'CRM管理员') {
        btn = [
          {type: 'approve', name: '审批通过'},
          {type: 'reject', name: '驳回'}
        ]
      }
      readOnly = true
    } else if (data.status === 2) {
      if (data.creater !== window.user.name) {
        readOnly = true
      } else {
        btn = [
          {type: 'submit', name: '提交审批'},
          {type: 'delete', name: '作废'},
          {type: 'cancel', name: '取消'}
        ]
      }
    } else if (data.status === 3) {
      if (data.creater === window.user.name) {
        btn = [
          {type: 'submit', name: '提交审批'},
          {type: 'save', name: '保存'},
          {type: 'cancel', name: '取消'}
        ]
      }
    } else if (data.status === 4) {
      readOnly = true
    }

    operate.openClientRecords(data, {
      title: '客户报备',
      operate: 'edit',
      btn
    }, readOnly)
  }

  // 操作
  var active = {
    add: () => {
      operate.openClientRecords({}, {
        title: '客户报备',
        operate: 'apply',
        btn: [
          {type: 'submit', name: '提交审批'},
          {type: 'save', name: '保存'},
          {type: 'cancel', name: '取消'}
        ]
      })
    },
    edit: (id) => {
      const tableData = table.cache["table-list"] || [];
      const data = tableData.find(item => item.id.toString() === id.toString()) || null;
    },
    user: (id) => {
      const tableData = table.cache["table-list"] || [];
      const data = tableData.find(item => item.id.toString() === id.toString()) || null;
      lookCustomer(data)
    },
    contact: (id) => {
      const tableData = table.cache["table-list"] || [];
      const data = tableData.find(item => item.id.toString() === id.toString()) || null;
      operate.openContactModel(data,{
        title: '查看联系人',
        btn: [
          {type: 'save', name: '保存'},
          {type: 'cancel', name: '取消'}
        ],
      })
    }
  };

  exports('client', {
    getUserRole
  })
});
