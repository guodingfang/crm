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
    ,url: `${projectUrl}/project/pro/contract/getConlist?projectId=331CD864ECC14DE38A85D11C065075BE`
    ,toolbar: '#toolbar' //开启头部工具栏，并为其绑定左侧模板
    ,defaultToolbar: ['filter']
    ,cellMinWidth: 80
    ,height: 'full-256'
    ,parseData: function(res) {
      return {
        code: 0,
        msg: res.msg,
        count: res.total,
        data: res.data
      }
    }
    ,cols: [[
      {field:'id', width:80, align:'center', title: '序号', type: 'numbers'}
      ,{field:'conNum', width:150, title: '合同编号', templet: ({ id, conNum }) => {
          return `<span class="cell-btn-item-line" data-type="look" data-id="${id}">${conNum}</span>`
        }}
      ,{field:'conName', width:120, title: '合同名称'}
      ,{field:'phoneNum', width:160, align: 'center', title: '项目编号' }
      ,{field:'orgName', width:160, align: 'center', title: '项目名称' }
      ,{field:'job', width:150, align: 'center', title: '归属客户' }
      ,{field:'conStatus', width: 130, title: '合同状态', templet: ({ conStatus }) => {
          return conStatus.dicName
        }}
      ,{field:'conMoney', width:200, title: '合同金额（元）'}
      ,{field:'settleMoney', width:150, title: '结算金额(元)'}
      ,{field:'payMoney', width:150, title: '已回款金额(元)'}
      ,{field:'dep', width:120, align: 'center', title: '已回款比例'}
      ,{field:'conDate', width:120, title: '签单日期'}
      ,{field:'employeeName', width: 130, title: '签单人', templet: ({ conPeople }) => {
          return conPeople.employeeName
        }}
      ,{field:'orgName', width:200, title: '归属部门', templet: ({ conPeople }) => {
          return conPeople.org.orgName
        }}
      ,{field:'jdDate', width:150, title: '交档日期'}
      ,{field:'employeeName', width:150, title: '交档人', templet: ({ jdMan }) => {
          return jdMan.employeeName
        }}
      ,{field:'managerName', width:160, align: 'center', title: '付款方式'}
      ,{field:'remark', width:120, align: 'center', title: '备注'}
      ,{field:'attachPath', width:120, align: 'center', title: '合同附件', templet: ({ attachPath }) => {
          return JSON.parse(attachPath).length
        }}
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

  })

  // 操作
  var active = {
    apply: () => {
      operate.addContract({}, {
        title: '合同信息',
        operate: 'apply',
        btn: [
          {type: 'save', name: '保存'},
          {type: 'submit', name: '提交'},
          {type: 'cancel', name: '取消'}
        ]
      })
    },
    look: () => {
      operate.openContractDetails({}, {
        title: '合同管理',
      })
    }
  };

  $('.layui-btn.layuiadmin-btn-list').on('click', function(){
    var type = $(this).data('type');
    active[type] ? active[type].call(this) : '';
  });

  exports('contract', {})
});
