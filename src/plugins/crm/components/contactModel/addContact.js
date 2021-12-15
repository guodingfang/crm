layui.define(['form', 'util', 'info', 'table', 'operate'],function (exports) {
  const table = layui.table
  const util = layui.util
  const operate = layui.operate

  const renderTable = (selectCustomer) => {
    const data = selectCustomer.liaisonList || []
    table.render({
      elem: `#contact-list`
      ,data: [...data]
      // ,height: 234
      ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      ,cols: [[
        {width:60,align:'center', title: '序号', type: 'numbers'},
        {field: 'name', width: 80, edit: true, align: 'center', title: '联系人姓名'},
        {field: 'mainContact', type:'radio',  width: 100, title: '主要联系人'},
        {field: 'phoneNum', width: 100, edit: true, align: 'center', title: '联系方式'},
        {field: 'orgName', width: 100, edit: true,  align: 'center', title: '部门'},
        {field: 'job', width: 100, edit: true,  align: 'center', title: '职务'},
        {title: '操作', minWidth: 80, align: 'center', fixed: 'right', toolbar: `#contact-operation-list`}
      ]],
      limit: 100000,
      done: function ({ data }) {
        let mainIndex = 0
        data.map((item, index) => {
          if (item.mainContact === 0) {
            mainIndex = index
          }
        })
        $(`.layui-table-view[lay-id='contact-list'] .layui-table-body tr[data-index = ${mainIndex} ] .layui-form-radio`).click();
      }
    });

    $('#add-btn-contact').on('click', () => {
      operate.contactChange('add')
    })

    // 监听table操作
    table.on('tool(contact-list)', function(obj) {
      const data = obj.data;
      if (obj.event === 'del') {  // 删除
        operate.contactChange('del', data, () => {
          obj.del();
        })
      }
    })
    table.on(`radio(contact-list)`, function(obj) {
      const index = obj.tr.attr('data-index')
      operate.contactChange('selectMain', { ...data, index })
    })
  }

  const save = (selectCustomer) => {
    const list = table.cache['contact-list'] || []
    let liaisonList = []
    list.map(item => {
      const {LAY_TABLE_INDEX, LAY_CHECKED, ...args} = item
      liaisonList.push({
        ...args
      })
    })
    const params = {
      id: selectCustomer.id,
      liaisonList
    }
    operate.ajaxPost('customerLiaison/create', params, {}, () => {
      layer.msg(`保存成功`,{time:2000});
    })
  }

  exports('addContact', {
    renderTable,
    save
  })
})
