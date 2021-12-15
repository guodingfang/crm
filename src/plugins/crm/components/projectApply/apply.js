layui.define(['table', 'form', 'operate', 'laytpl', 'info'], function(exports){
  const table = layui.table
    ,form = layui.form
    ,operate = layui.operate
    ,laytpl = layui.laytpl
    ,info = layui.info
    ,$ = layui.$;

  operate.formVerify()

  const renderFormItem = (el, cb) => {
    const id = $(el).attr('id')
    const html = laytpl(el.innerHTML).render({})
    document.getElementById(`${id}Container`).innerHTML = html
    cb && cb()
  }

  // 附件
  table.render({
    elem: '#accessory-list'
    ,cellMinWidth: 80
    ,data: []
    ,cols: [[
      {width:60,align:'center', title: '序号', type: 'numbers'},
      {field: 'name', width: 160, edit: true, align: 'center', title: '名称'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '大小'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '备注'},
      {title: '操作', width: 80, align: 'center', toolbar: `#accessory-operation-list`}
    ]]
    ,limit: 100000
    ,done: function ({ data }) {

    }
  })

  // 客户维护情况
  table.render({
    elem: '#maintain-list'
    ,cellMinWidth: 80
    ,data: []
    ,cols: [[
      {width:60,align:'center', title: '序号', type: 'numbers'},
      {field: 'name', width: 160, edit: true, align: 'center', title: '角色'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '姓名'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '职务'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '联系方式'},
      {title: '操作', width: 80, align: 'center', toolbar: `#accessory-operation-list`}
    ]]
    ,limit: 100000
    ,done: function ({ data }) {

    }
  })

  // 设计单位
  table.render({
    elem: '#design-list'
    ,cellMinWidth: 80
    ,data: []
    ,cols: [[
      {width:60,align:'center', title: '序号', type: 'numbers'},
      {field: 'name', width: 160, edit: true, align: 'center', title: '单位名称'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '姓名'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '职务'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '联系方式'},
      {title: '操作', width: 80, align: 'center', toolbar: `#accessory-operation-list`}
    ]]
    ,limit: 100000
    ,done: function ({ data }) {

    }
  })

  // 招标公司
  table.render({
    elem: '#tendering-list'
    ,cellMinWidth: 80
    ,data: []
    ,cols: [[
      {width:60,align:'center', title: '序号', type: 'numbers'},
      {field: 'name', width: 160, edit: true, align: 'center', title: '名称'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '大小'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '备注'},
      {title: '操作', width: 80, align: 'center', toolbar: `#accessory-operation-list`}
    ]]
    ,limit: 100000
    ,done: function ({ data }) {

    }
  })

  // 竞争对手情况
  table.render({
    elem: '#competitor-list'
    ,cellMinWidth: 80
    ,data: []
    ,cols: [[
      {width:60,align:'center', title: '序号', type: 'numbers'},
      {field: 'name', width: 160, edit: true, align: 'center', title: '公司名称'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '说明'},
      {title: '操作', width: 80, align: 'center', toolbar: `#accessory-operation-list`}
    ]]
    ,limit: 100000
    ,done: function ({ data }) {

    }
  })

  // 合作伙伴
  table.render({
    elem: '#cooperation-list'
    ,cellMinWidth: 80
    ,data: []
    ,cols: [[
      {width:60,align:'center', title: '序号', type: 'numbers'},
      {field: 'name', width: 160, edit: true, align: 'center', title: '设备（外包工程)名称'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '合作伙伴或渠道供应商'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '市场价优惠比率'},
      {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '联系方式'},
      {field: 'orgName', width: 120, edit: true,  align: 'center', title: '联系人'},
      {title: '操作', width: 80, align: 'center', toolbar: `#accessory-operation-list`}
    ]]
    ,limit: 100000
    ,done: function ({ data }) {

    }
  })


  exports('apply', {
    renderFormItem
  })
});
