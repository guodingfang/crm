layui.define(['table', 'form', 'dropdown', 'element', 'laytpl', 'operate', 'info'], function(exports){
  const table = layui.table
    ,form = layui.form
    ,element = layui.element
    ,laytpl = layui.laytpl
    ,dropdown = layui.dropdown
    ,operate = layui.operate
    ,info = layui.info
    ,$ = layui.$;


  function getTabBarInfo(data) {
    const list = [
      { name: '潜在订单', type: 'potential-order', showTable: true },
      { name: '在手订单', type: 'hav-order', showTable: true },
      { name: '拜访记录', type: 'visit-record' },
      // { name: '竞争对手', type: 'competitor', showTable: true },
      // { name: '服务请求', type: 'service-request', showTable: true },
      // { name: '满意度调查', type: 'satisfy-survey', showTable: true },
      { name: '开票信息', type: 'billing-info', showTable: true }
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
      case 'potential-order':
        renderTable(tab.type, tableCols[tab.type], {
          toolbar: `#${tab.type}-toolbar`,
          defaultToolbar: ['filter', 'exports']
        }, data)
        renderDropdown()
        break
      case 'billing-info':
        renderTable(tab.type, tableCols[tab.type], {
          url: `${crmURL}/ticket/query?id=${id}`,
          toolbar: `#${tab.type}-toolbar`,
          defaultToolbar: ['filter', 'exports']
        }, data)
        break
      case 'visit-record':
        renderVisitRecord({
          id: data.id
        })
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
        if (el === 'billing-info') {
          operate.addBilling(customerData, {
            title: '新建票据',
            operate: 'apply',
            btn: [
              {type: 'save', name: '新建'},
              {type: 'cancel', name: '取消'}
            ]
          })
        }
      }
    };
  }

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

  const renderVisitRecord = ({ id }) => {
    const getVisitRecordList = (params) => {
      operate.ajaxGet('/visitLog/queryCustomerVisitP', {
        ...params,
      }, (data) => {
        const list = data
        laytpl(visitRecord.innerHTML).render(list, function (html) {
          document.getElementById('visitRecordContainer').innerHTML = html
        })
      })
    }

    form.on('submit(visit-record-search)', function(data) {
      const field = data.field;
      const { selectDate = '' } = field
      const [startDate, endDate] = getDateRange(selectDate)
      let params = { id }
      if (startDate) {
        params = {
          ...params,
          startDate,
          endDate,
        }
      }
      getVisitRecordList({
        ...params,
      })
      return false;
    });

    getVisitRecordList({ id })
  }

  exports('details', {
    getTabBarInfo,
  })
});
