layui.define(['table', 'form', 'element', 'laytpl', 'operate', 'info'], function(exports){
  const table = layui.table
    ,form = layui.form
    ,element = layui.element
    ,laytpl = layui.laytpl
    ,operate = layui.operate
    ,info = layui.info
    ,$ = layui.$;


  function getTabBarInfo(data) {
    const list = [
      { name: '资料管理', type: 'document-manage', showTable: true },
      { name: '投标管理', type: 'bid-manage', showTable: true },
      { name: '合同管理', type: 'contract-manage', showTable: true },
      { name: '业务费用管理', type: 'cost-manage', showTable: true },
      { name: '流程管理', type: 'flow-manage', showTable: true },
      { name: '项目周报', type: 'project-week', showTable: true },
      { name: '竞争对手', type: 'competitor', showTable: true },
      { name: '干系人', type: 'stakeholder', showTable: true }
    ]
    laytpl(tabBar.innerHTML).render(list, function (html) {
      document.getElementById('tabBarContainer').innerHTML = html
      const tab = list[0]
      if (tab.showTable) {
        tabSelect(data, tab)
      }
    })

    element.on('tab(tabBar)', function({ index }){
      const tab = list[index]
      tabSelect(data, tab)
    });
  }

  const tabSelect = (data, tab) => {
    const id = data.id
    switch (tab.type) {
      case 'contract-manage':
        renderTable(tab.type, tableCols[tab.type], {
          url: `${projectUrl}/project/pro/contract/getConlist?projectId=331CD864ECC14DE38A85D11C065075BE`,
          toolbar: `#${tab.type}-toolbar`,
          defaultToolbar: ['filter', 'exports'],
          parseData: function(res) {
            return {
              code: 0,
              msg: res.msg,
              count: res.total,
              data: res.data
            }
          }
        }, data)
        break
      default:
        renderTable(tab.type, tableCols[tab.type], {
          toolbar: `#${tab.type}-toolbar`,
          defaultToolbar: ['filter', 'exports']
        }, data)
    }
  }


  const renderTable = (el, cols = [], options = {}, customerData) => {
    const { url = '', ...otherOptions } = options
    table.render({
      elem: `#${el}-table`
      ,cellMinWidth: 80
      ,height: 'full-480'
      ,url: url || `../../../../mock/clientDetails.json`
      ,...otherOptions
      ,cols: [[
        ...cols,
      ]]
      ,request: {
        pageName: 'current',
        limitName: 'size',
      }
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
    });
    // 监听table操作
    table.on(`tool(${el}-table)`, function(obj) {
      const data = obj.data;
      switch (el) {
        case 'billing-info':
          if (obj.event === 'edit') {
            operate.addBilling(data, {
              title: '票据修改',
              operate: 'edit',
              btn: [
                {type: 'save', name: '保存'},
                {type: 'cancel', name: '取消'}
              ]
            })
          } else if (obj.event === 'failure') {
            operate.ajaxPost('ticket/create', {
              ...data,
              status: 1,
            }, {
              success: ({ code, data, msg }) => {
                if (code !== 0) {
                  layer.msg(msg)
                  return
                }
                table.reload('billing-info-table')
              }
            })
          } else if (obj.event === 'take') {
            operate.ajaxPost('ticket/create', {
              ...data,
              status: 0,
            }, {
              success: ({ code, data, msg }) => {
                if (code !== 0) {
                  layer.msg(msg)
                  return
                }
                table.reload('billing-info-table')
              }
            })
          }
          break
        default:
          return
      }

    })

    const active = {
      apply: () => {
        operate.addContract({}, {
          title: '新建联系人',
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
      },
    };
  }

  exports('details', {
    getTabBarInfo,
  })
});
