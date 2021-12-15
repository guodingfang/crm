layui.define(['form', 'util', 'info', 'operate', 'table'],function (exports) {
  const $ = layui.$,
    table = layui.table,
    info = layui.info,
    operate = layui.operate,
    util = layui.util;

  const renderTable = (type, data) => {
    table.render({
      elem: `#contact-list`
      ,data: [...data]
      ,width: 616
      ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      ,cols: [[
        {field: 'name', width: 150, unresize: true, edit: true, align: 'center', title: '联系人姓名'},
        {field: 'phoneNum', width: 120, unresize: true, edit: true, align: 'center', title: '联系电话'},
        {field: 'orgName', width: 120, unresize: true, edit: true,  align: 'center', title: '部门'},
        {field: 'job', width: 120, unresize: true, edit: true,  align: 'center', title: '职务'},
        {title: '操作', minWidth: 80, unresize: true, align: 'center', fixed: 'right', toolbar: `#contact-operation-list`}
      ]],
      done: function (res) {
        console.log('res', res)
      }
    });

    // 新增联系人
    $('#add-btn-contact').on('click', () => {
      operate.contactChange('add')
    })

    // table表格操作监控
    table.on(`tool(contact-list)`, function(obj) {
      const data = obj.data;
      if (obj.event === 'del') {  // 删除
        operate.contactChange('del', data, () => {
          obj.del();
        })
      }
    })
  }


  // 获取select数据
  const _getSelectData = (el, type, property, operation, option = {}) => {
    if(type === 'edit') {
      info[operation](el, {
        way: 'codeValue',
        ...option,
      }, () => {
        $(el).children().each(function() {
          if($(this).attr('value') === property) {
            $(this).attr("selected", true)
            layui.form.render("select");
          }
        })
      })
    } else if (type === 'apply') {
      info[operation](el, {
        way: 'codeValue',
        ...option,
      })
    }
  }

  // 获取客户性质
  const getCustomerCharacter = (el, type, { character, characterCode }) => {
    const property = `${characterCode}|${character}`
    _getSelectData(el, type, property, 'getCustomerCharacter')
  }

  const getCustomerType = (el, type, data) => {
    const property = `${data.typeCode}|${data.type}`
    _getSelectData(el, type, property, 'getCustomerType')
  }

  // 获取省/市
  const getRegionInfo = (el, type, { province, provinceCode, city, cityCode }, option) => {
    const property = el === '#province' ? `${provinceCode}|${province}` : `${cityCode}|${city}`
    _getSelectData(el, type, property, 'getRegionInfo', option)
  }

  // 关闭弹窗
  const closeModel = () => {
    const index = layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
    opener.layui.table.reload('table-list'); //重载表格
    layui.layer.close(index); //再执行关闭
  }

  // 客户保存
  const save = (formData, renderData = {}) => {
    const field = formData.field
    const params = paramsCodeAndValueSplit(field)
    const liaisonList = table.cache['contact-list'] || []
    // 判断联系人是否填写
    const judge = judgeContactList(liaisonList)
    if (!judge) return

    const _params = {
      ...renderData,
      ...params,
      liaisonList,
      creater: window.user.name || ''
    }
    operate.ajaxPost('/customer/save', _params, {}, () => {
      layer.msg('保存成功');
    })
  }


  // 客户报备
  const create = (formData, renderData = {}) => {

    const field = formData.field
    const params = paramsCodeAndValueSplit(field)
    const liaisonList = table.cache['contact-list'] || []
    // 判断联系人是否填写
    const judge = judgeContactList(liaisonList)
    if (!judge) return

    const _params = {
      ...renderData,
      ...params,
      liaisonList,
      creater: window.user.name || ''
    }

    operate.ajaxPost('/customer/create', _params, {}, () => {
      layer.msg('报备成功');
    })
  }

  const update = (formData, renderData = {}) => {

    const field = formData.field
    const params = paramsCodeAndValueSplit(field)
    const liaisonList = table.cache['contact-list'] || []
    // 判断联系人是否填写
    const judge = judgeContactList(liaisonList)
    if (!judge) return

    const _params = {
      ...renderData,
      ...params,
      liaisonList
    }

    operate.ajaxPost('/customer/resetCustomer', _params, {}, () => {
      layer.msg('报备成功');
    })
  }

  // 客户报备删除
  const remove = (params, cb) => {
    const { id } = params
    operate.ajaxGet('customer/delete', { customerId: id }, () => {
      layer.msg('报备删除');
      closeModel()
    })
  }

  // 打开报备信息输入model
  const openRejectArgument = (data, configs = {}, type) => {
    operate.openRecordsArgument(data, {
      btn: [
        {type: 'submit', name: '确定'},
        {type: 'cancel', name: '取消'}
      ],
      area: ['400px', '330px'],
      maxmin: false,
      ...configs,
    }, type)
  }

  exports('records', {
    renderTable,
    getCustomerCharacter,
    getCustomerType,
    getRegionInfo,

    // --- ---
    save,
    create,
    update,
    remove,
    openRejectArgument
  })
})
