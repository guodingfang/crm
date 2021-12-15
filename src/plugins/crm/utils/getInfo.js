
layui.define(['xmSelect', 'transfer', 'util'], function (exports) {
  var $ = layui.$,
    util = layui.util,
    transfer = layui.transfer,
    xmSelect = layui.xmSelect;

  function _xmSelectRender(el, data, options = null) {
    const required = options ?  options.required === 'no' ? '' : 'required' : 'required'
    const disabled = options ? options.disabled : false
    const radio = options ? options.radio : true
    const tips = options ? options.tips || '请选择' : '请选择'
    const searchTips = options ? options.searchTips || '请选择' : '请选择'
    const initValue = options ? options.initValue || [] : []
    let xmDom = null
    let params = null
    params = {
      el: el,
      style: {
        width: '190px',
      },
      language: 'zn',
      filterable: true,
      autoRow: false,
      data,
      disabled,
      direction: 'down',
      layVerify: required,
      radio,
      tips,
      searchTips,
      initValue,
      on: function (data) {
        if (options && options.selectSuccess) {
          const selectProduct = data.arr[0]
          options && options.selectSuccess && options.selectSuccess(selectProduct)
        }
      },
      create: function(val, arr){
        if (options && options.notDataCreate) {
          if(arr.length === 0) {
            return {
              name: val,
              value: val
            }
          }
        }
      },
    }

    if (options && options.isTemplate) {
      params = {
        ...params,
        template({ item, sels, name, value }){
          return item.name  + '<span style="position: absolute; right: 10px; color: #8799a3">'+value+'</span>'
        },
      }
    }

    // 穿梭框配置
    if (options && options.transfer) {
      const mainSelectValue = options.mainSelectValue || ''
      const transferDefaultSelect = options.transferDefaultSelect || []
      params = {
        ...params,
        initValue: transferDefaultSelect,
        height: 300,
        model: {
          label: {
            type: 'text'
          },
          block: {
            showIcon: false,
          }
        },
        content: `<div id="transfer" class="transfer-container"></div>`,
        on: function(data){
          if(!data.isAdd){
            layui.transfer.reload('transfer', {
              value: xmDom.getValue('value')
            })
          }
        }
      }
      setTimeout(() => {
        transfer.render({
          id: 'transfer',
          elem: '#transfer',  //绑定元素
          title: ['待选人', '客户经理'],
          height: 250,
          showSearch: true,
          showSelectMain: true,
          data,
          value: transferDefaultSelect,
          parseData: function(res){
            return {
              ...res,
              "value": res.value,
              "title": res.name,
              "disabled": res.disabled,
              "checked": res.checked,
            }
          },
          onchange: function(data, index) {
            if(index === 0){
              xmDom.append(data.map(item => ({ name: item.title, value: item.value, ...item, })))
            }else{
              xmDom.delete(data.map(item => ({ name: item.title, value: item.value, ...item })))
            }
            if (options && options.selectSuccess) {
              options && options.selectSuccess && options.selectSuccess(data, 'transfer', index === 0 ? 'append' : 'delete')
            }
            selectTransferMain(mainSelectValue)
            options.selectMainSuccess()
          }
        });
        selectTransferMain(mainSelectValue)
      }, 0)
    }
    if (options && options.tree) {
      params = {
        ...params,
        tree: {
          show: true,
          strict: false,

        },
      }
    }
    xmDom = xmSelect.render({
      ...params
    });

    return xmDom
  }

  /**
   * 获取员工
   * @type {null}
   */
  var users = null
  var usersDom = null
  function getUsers(el, cb, options) {
    if(users) {
      usersDom = _xmSelectRender(el, users, options);
      cb && cb(usersDom)
      return usersDom;
    }
    $.ajax({
      url: `${hrURL}/user/queryForName?name=`,
      success:function(res){
        var data = res.data ? res.data.map(function(item) {
          return {
            ...item,
            value: item.userno,
            name: item.name,
          }
        }) : []
        users = data;
        getUsers(el, cb, options);
      }
    })
  }

  /**
   * 获取公司
   * @type {null}
   */
  var company = null;
  var companyDom = null;
  function getCompany(el, cb, options) {
    if(company) {
      companyDom = _xmSelectRender(el, company, options);
      cb && cb(companyDom)
      return companyDom;
    }

    $.get(ipmURL + '/dic/getDic?typeCode=QDZT', function (res) {
      var data = res.data.map(function(item) {
        return {
          value: item.dicCode,
          name: item.dicName,
        }
      })
      company = data;
      getCompany(el, cb, options)
    })
  }

  /**
   * 获取项目
   * @type {null}
   */
  var projectData = null;
  var projectDom = null;
  function getProject(el, cb, options) {
    if(projectData) {
      projectDom = _xmSelectRender(el, projectData, options);
      cb && cb(projectDom)
      return projectDom;
    }
    $.get(`${projectUrl}/project/pro/projects/getAllProject`, function (res) {
      const data = res.data.map(function(item) {
        return {
          value: item.projectCode,
          name: item.projectName,
        }
      })
      projectData = data;
      getProject(el, cb, options)
    })
  }

  /**
   * 获取客户信息
   * @type {null}
   */
  let customerData = null;
  let customerDom = null;
  const getCustomer = (el, cb, options) => {
    if(customerData) {
      customerDom = _xmSelectRender(el, customerData, options);
      cb && cb(customerDom)
      return customerDom;
    }
    $.get(`${crmURL}/customer/getAllSimpleCustomer`, function (res) {
      const data = res.data.map(function(item) {
        return {
          value: item.id,
          name: item.customerName,
        }
      })
      customerData = data;
      getCustomer(el, cb, options)
    })
  }

  /**
   * 获取组织架构
   * @type {null}
   */
  var deptData = null;
  var deptDom = null;
  const getOrganizationTree = (el, params, cb, options) => {
    if(deptData) {
      deptDom = _xmSelectRender(el, deptData, {
        tree: true,
        ...options
      });
      cb && cb(deptDom, deptData)
      return deptDom;
    }
    $.get(`${crmURL}/user/getUserTree`, function (res) {
      const data = getRestTree(res.data)
      deptData = [...data];
      getOrganizationTree(el, params, cb, options)
    })
  }

  // 获取xmSelect数据
  const getXmSelect = () => {
    return {
      companyDom,
      projectDom,
      usersDom,
      deptDom,
    }
  }

  // 清空xmSelect数据
  const clearXmSelect = () => {
    setTimeout(() => {
      companyDom && companyDom.setValue([])
      projectDom && projectDom.setValue([])
      usersDom && usersDom.setValue([])
    }, 0)
  }

  // 设置默认选中选项
  const _setDefaultSelect = (el, data, option = {}) => {
    const { way = 'codeValue', clearData = false, code = 'dicCode', value = 'dicName' } = option
    $(el).children('.option-item').remove()
    if (clearData) {
      layui.form.render("select");
      return
    }
    data.forEach(function(item) {
      const _code = item[`${code}`]
      const _value = item[`${value}`]
      if (way === 'codeValue') {
        $(el).append(`<option class='option-item' value='${_code}|${_value}'>${_value}</option>`);
      } else {
        $(el).append(`<option class='option-item' value='${_code}'>${_value}</option>`);
      }
    })
    layui.form.render("select");
  }

  // 获取地址信息
  const getRegionInfo = (el, option, cb) => {
    const { params } = option
    let paramsStr = paramsStringSplit(params)
    $.get(`${crmURL}/region/query?${paramsStr}`, function (res) {
      const data = res.data;
      if(el) {
        _setDefaultSelect(el, data, {
          ...option,
          code: 'regionCode',
          value: 'regionName'
        })
      }
      cb && cb()
    })
  }

  // 模糊查询客户名称
  const getCustomerByNameList = (el, option, cb) => {
    const { params } = option
    if (!params.keywords) {
      const parent = $(el).parent()
      parent.children('.customer-name-list').remove()
      return
    }
    let paramsStr = paramsStringSplit(params)
    $.get(`${crmURL}/cmInfo/queryCustomerByName?${paramsStr}`, function (res) {
      const data = res.data;
      const parent = $(el).parent()
      parent.children('.customer-name-list').remove()
      const dom = $(`<ul class="customer-name-list"></ul>`)
      data.forEach(function(item) {
        dom.append(`<li class='customer-name-item' >${item.clientName}</li>`);
      })
      parent.append(dom)
      cb && cb()
    })
  }

  // 获取客户性质
  const getCustomerCharacter = (el, option, cb) => {
    $.get(`${crmURL}/dic/getDic?typeCode=KHXZ`, function (res) {
      var data = res.data;
      if(el) {
        _setDefaultSelect(el, data, option)
      }
      cb && cb()
    })
  }

  // 获取客户类型
  const getCustomerType = (el, option, cb) => {
    $.get(`${crmURL}/dic/getDic?typeCode=CRM_CUSTOMER_TYPE`, function (res) {
      var data = res.data;
      if(el) {
        _setDefaultSelect(el, data, option)
      }
      cb && cb()
    })
  }



  exports('info', {
    getUsers,
    getCompany,
    getProject,
    getCustomer,
    getOrganizationTree,
    clearXmSelect,
    getXmSelect,

    // 获取地址
    getRegionInfo,
    // 获取客户列表
    getCustomerByNameList,

    // 获取字典项
    getCustomerCharacter,
    getCustomerType,
  })
})
