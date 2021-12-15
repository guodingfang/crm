layui.define(['table', 'form', 'dropdown', 'element', 'laytpl', 'util', 'operate', 'info'], function(exports){
  const info = layui.info
  const table = layui.table
  const form = layui.form
  const operate = layui.operate
  const util = layui.util

  let managerList = []

  // 获取客户信息
  const getCustomerInfo = (id, cb) => {
    operate.ajaxGet('customer/queryCustomer', { id }, (data) => {
      cb && cb(data[0])
    })
  }

  const renderForm = (data) => {
    managerList = data.managerList
    renderFormInput(data)
    renderFormVal(data)
    renderSubmit(data)
  }

  const renderFormInput = (data) => {
    const { managerList = [], liaisonList = [] } = data
    form.val('layuiadmin-app-form', {
      ...data,
      orgName: managerList.find(item => item.owner === 0).orgName
    })

    geManager('#manager', data)
    getCustomerCharacter('#character', data)
    getCustomerType('#type', data, { notSelectOption: true })
    getRegionInfo('#province', data, {
      params: {
        regionLevel: 0,
      }
    })
    if (data.city && data.provinceCode) {
      $('#city').removeAttr('disabled')
      getRegionInfo('#city', data, {
        clearData: !data.provinceCode,
        params: {
          regionLevel: 1,
          parentCode: data.provinceCode,
        }
      })
    }

    // form表单监控
    form.on('select(layuiadmin-province)', (data) => {
      const [code] = data.value.split('|')
      if (code) {
        $('#city').removeAttr('disabled')
      } else {
        $('#city').attr('disabled', true)
      }
      getRegionInfo('#city', data, {
        clearData: !code,
        params: {
          regionLevel: 1,
          parentCode: code,
        }
      })
    })

    table.render({
      elem: '#contact-list'
      ,cellMinWidth: 80
      ,data: [...liaisonList]
      ,cols: [[
        {field: 'name', width: 160, edit: true, align: 'center', title: '联系人姓名'},
        {field: 'mainContact', width: 80, type:'radio', align: 'center', title: '主要联系人'},
        {field: 'phoneNum', width: 120, edit: true, align: 'center', title: '联系方式'},
        {field: 'orgName', width: 120, edit: true,  align: 'center', title: '部门'},
        {field: 'job', width: 120, edit: true,  align: 'center', title: '职务'},
        {title: '操作', width: 80, align: 'center', toolbar: `#contact-operation-list`}
      ]]
      ,limit: 100000
      ,done: function ({ data }) {
        let mainIndex = 0
        data.map((item, index) => {
          if (item.mainContact === 0) {
            mainIndex = index
          }
        })
        $(`.layui-table-view[lay-id='contact-list'] .layui-table-body tr[data-index = ${mainIndex} ] .layui-form-radio`).click();
      }
    })
    // 新增联系人
    $('#add-btn-contact').on('click', () => {
      operate.contactChange('add')
    })
    // table表格操作监控
    table.on('tool(contact-list)', function(obj) {
      const data = obj.data;
      if (obj.event === 'del') {  // 删除
        operate.contactChange('del', data, () => {
          obj.del();
        })
      }
    })
    table.on('radio(contact-list)', function(obj) {
      const index = obj.tr.attr('data-index')
      operate.contactChange('selectMain', { ...data, index })
    });
  }

  // 渲染 render Form
  const renderFormVal = () => {
    $('.input-show-val').attr('disabled', true)
    $('.mask').css('display', 'block')
    $('.add-button').css('display', 'none')
  }

  const isOpenEdit = (isOpen) => {
    $('.mask')
      .css('display', `${isOpen ? 'none': 'block'}`)

    if (isOpen) {
      $('.input-show-val').removeAttr('disabled')
      layui.form.render("select");
    } else {
      $('.input-show-val').attr('disabled', true)
      layui.form.render("select");
    }


    $('#footer-btn-edit')
      .css('display', `${isOpen ? 'none' : 'inline-block'}`)

    $('#footer-btn-save')
      .css('display', `${isOpen ? 'inline-block' : 'none'}`)

    $('#footer-btn-back')
      .css('display', `${isOpen ? 'none' : 'inline-block'}`)

    $('#footer-btn-cancel')
      .css('display', `${isOpen ? 'inline-block' : 'none'}`)

    $('.add-button')
      .css('display', `${isOpen ? 'inline-block' : 'none'}`)
  }

  // 渲染操操作按钮
  const renderSubmit = (renderData) => {
    $('.layuiadmin-btn-list').on('click', (e) => {
      const type = $(e.target).attr('data-type')
      if (type === 'edit') {
        isOpenEdit(true)
      } else if (type === 'cancel') {
        isOpenEdit(false)
      } else if (type === 'save') {
        $('#layuiadmin-app-form-save').click();
      } else if (type === 'back') {
        const index = layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        opener.layui.table.reload('table-list'); //重载表格
        layui.layer.close(index); //再执行关闭
      }
    })

    // 更新用户信息
    form.on('submit(layuiadmin-app-form-save)', function(formData) {
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
        managerList,
      }

      operate.ajaxPost('customer/update', {
        ..._params,
      }, {
        success: ({ code, data, msg }) => {
          if (code !== 0) {
            layer.msg(msg)
            return
          }
          getCustomerInfo(data, (result) => {
            renderFormVal(result)
            isOpenEdit(false)
          })
        }
      })
    })
  }

  // 打开更多
  let openMore = false
  $('#more-btn').on('click', (e) => {
    if(openMore) {
      $('#more-btn').html('更多信息')
      $('#moreFormDetails').css('display', 'none')
    } else {
      $('#more-btn').html('收起')
      $('#moreFormDetails').css('display', 'block')
    }
    openMore = !openMore
  })

  const geManager = (el, renderData) => {
    const defaultSelect = renderData.managerList.map(item => item.managerCode)
    if (renderData.typeCode === 'CRM_ZBS') {
      // 获取客户经理
      info.getUsers(el, (userDom) => {
        setTimeout(() => {
          addSelectMainClick()
        }, 2500)
      }, {
        transfer: true,
        transferDefaultSelect: defaultSelect,
        mainSelectValue: renderData.managerList.find(item => item.owner === 0).managerCode,
        radio: false,
        selectMainSuccess: () => {
          addSelectMainClick()
        },
        selectSuccess: (data, source, type) => {
          if (source === 'transfer') {
            if (type === 'append') {
              changeManagerList(data, renderData.id, type)
            } else if (type === 'delete') {
              const deleteList = data.map(item => item.userno)
              managerList = managerList.filter(item => !deleteList.find(code => code === item.managerCode))
              // 清空后可以切换客户经理
              if (managerList.length === 1) {
                getCustomerType('#type', renderData, { notSelectOption: false })
              }
            }
          }
        }
      })

      // 添加按钮点击事件
      function addSelectMainClick() {
        $('.transfer-btn-select-main').on('click', function () {
          const mainSelectValue = $(this).siblings('input').attr('value') || ''
          selectTransferMain(mainSelectValue)
          let selectItem = null
          managerList = managerList.map(item => {
            if (item.managerCode === mainSelectValue.toString()) {
              selectItem = item
              layer.msg(`已选中${selectItem.managerName}为主要客户经理`)
              return { ...item, owner: 0 }
            } else {
              return { ...item, owner: 1 }
            }
          })
          form.val('layuiadmin-app-form', {
            orgName: selectItem.orgName
          })
          addSelectMainClick()
        })
      }
    } else {
      info.getUsers(el, (usersDom) => {
        usersDom.setValue([...defaultSelect])
      }, {
        required: 'no',
        radio: true,
        selectSuccess: (selectUser) => {
          changeManagerList([selectUser], renderData.id, 'radio')
        }
      })
    }
  }

  const changeManagerList = (data, customerId, type) => {
    data.map(item => {
      managerList = [...(type === 'radio' ? [] : managerList), {
        create: window.user.name || '',
        customerId,
        managerCode: item.userno,
        managerName: item.name,
        orgCode: item.dept,
        orgName: item.userdept,
        owner: type === 'radio' ? 0 : 1,
        notes: "",
        groupName: ""
      }]
    })
    form.val('layuiadmin-app-form', {
      orgName: managerList.find(item => item.owner === 0).orgName
    })
  }

  // 获取select数据
  const _getSelectData = (el, property, operation, option = {}) => {
    const { notSelectOption = false, ...args } = option
    info[operation](el, {
      way: 'codeValue',
      ...args,
    }, () => {
      $(el).children().each(function() {
        if($(this).attr('value') === property) {
          $(this).attr("selected", true)
          layui.form.render("select");
        } else if (notSelectOption) {
          $(this).attr('disabled', true)
        }
      })
    })
  }

  // 获取客户性质
  const getCustomerCharacter = (el, { character, characterCode }) => {
    const property = `${characterCode}|${character}`
    _getSelectData(el, property, 'getCustomerCharacter')
  }

  const getCustomerType = (el, data, { notSelectOption }) => {
    const property = `${data.typeCode}|${data.type}`
    _getSelectData(el, property, 'getCustomerType', { notSelectOption })
  }

  // 获取省/市
  const getRegionInfo = (el, { province, provinceCode, city, cityCode }, option) => {
    const property = el === '#province' ? `${provinceCode}|${province}` : `${cityCode}|${city}`
    _getSelectData(el, property, 'getRegionInfo', option)
  }


  exports('detailsForm', {
    getCustomerInfo,
    renderForm,
    geManager,
    getCustomerCharacter,
    getCustomerType,
    getRegionInfo,
  })
})
