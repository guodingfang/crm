layui.define(['upload', 'form', 'table', 'util', 'info'], function (exports) {
  const upload = layui.upload,
    form = layui.form,
    table = layui.table,
    util = layui.util,
    info = layui.info;

  // 表单搜索
  const searchForm = (configs = {}, cb) => {
    form.on('submit(list-search)', function(data) {
      const field = data.field;
      delete field.select
      const xmlSelect = info.getXmSelect()
      for(const item in xmlSelect) {
        if (xmlSelect[item]) {
          if (item === 'deptDom') {
            field['deptCode'] = xmlSelect[item].getValue('valueStr')
          } else {
            field[mapKeyVal[item + 'Name']] = xmlSelect[item].getValue('nameStr')
          }
        }
      }
      let _field = paramsCodeAndValueSplit(field)

      // params重新组合
      _field = configs.paramsRegroup ? configs.paramsRegroup(_field) : _field

      // page
      const page = configs.notPage ? false : {
        current: 1 //重新从第 1 页开始
      }

      // params
      let params = {
        where: _field,
        page
      }

      if (configs.url) {
        params = {
          ...params,
          url: configs.url,
        }
      }

      cb && cb(_field)
      // 执行重载
      table.reload('table-list', {
        ...params,
      });
      return false;
    });
  }

  // 表单验证
  const formVerify = () => {
    form.verify({
      radioReq: function (value, item) {
        var verifyName = $(item).attr('name'),
          verifyType = $(item).attr('type'),
          formElem = $(item).parents('.layui-form'),
          verifyElem = formElem.find(`input[name=${verifyName}]`),
          isTrue = verifyElem.is(':checked'),
          focusElem = verifyElem.next().find('i.layui-icon');
        if (!isTrue || !value) {
          focusElem.css(verifyType === 'radio' ? {
            "color": "#FF5722"} : {"border-color": "#FF5722"});
          //对非输入框设置焦点
          focusElem.first().attr("tabIndex", "1").css("outline", "0")
            .blur(function () {
              focusElem.css(verifyType === 'radio' ? {
                "color": ""
              } : {
                "border-color": ""
              });
            }).focus();
          return '必填项不能为空';
        }
      },
      notNegative: [
        /^([1-9][0-9]*(\.\d{1,2})?)|(0\.\d{1,2})$/,
        '不能输入负数'
      ]
    });
  }

  // ajax-post请求
  const ajaxPost = (url = '', params = {}, options = {}, cb) => {
    const {
      prefix = crmURL,
      success
    } = options
    $.ajax({
      type:'POST',
      url: `${prefix}/${url}`,
      dataType: 'json',
      contentType: 'application/json',
      data: JSON.stringify(params),
      success: function ({ code, data, msg }) {
        if (success) {
          success({ code, data, msg })
        } else {
          if(code !== 0){
            layer.msg(msg);
          } else {
            cb && cb()
            setTimeout(function () {
              const index = layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
              opener.layui.table.reload('table-list'); //重载表格
              layui.layer.close(index); //再执行关闭
            }, 1000)
          }
        }
      }
    })
  }

  // ajax-get请求
  const ajaxGet = (url, params, cb) => {
    let paramsStr = paramsStringSplit(params)
    $.get(`${crmURL}/${url}?${paramsStr}`, function ({ code, msg, data }) {
      if(code !== 0){
        layer.msg(msg);
      } else {
        cb && cb(data);
      }
    })
  }

  // 上传文件
  function updateFiles(el, cb, configs = {}) {
    //指定允许上传的文件类型
    upload.render({
      elem: el
      ,url: `${uploadURL}/fileUpload.action`
      ,accept: 'file'
      ,multiple: true
      ,auto: true
      ,field:'files'
      ,size: 100*1024
      ,data: {
        'modelPath':'cm'
      }
      ,before: function(obj){ //obj参数包含的信息，跟 choose回调完全一致，可参见上文。
        layer.load(); //上传loading
      }
      ,choose: function(obj){

      }
      ,done: function(res, index, upload){ //成功的回调
        layer.closeAll('loading'); //关闭loading
        if(res.message === '1'){ //上传成功
          cb && cb(res.datas)
        }
        this.error(index, upload);
      }
      ,allDone: function(obj){ //多文件上传完毕后的状态回调
        layer.closeAll('loading'); //关闭loading
        var total = obj.total;
        var successful = obj.successful;
        layer.msg("上传文件总数"+total +"个,成功"+successful+"个");
      }
      ,error: function(index, upload){ //错误回调
      }
    });
  }

  /**
   * 联系人变动
   * @param type  add 新增联系人 del 删除联系人 必填
   * @param data  联系人数据
   * @param cb  回调
   * @param configs 配置文件
   */
  const contactChange = (type, data = {}, cb, configs = {}) => {
    const {
      el = 'contact-list',
    } = configs
    if (type === 'add') {
      const oldData = table.cache[el];
      const newData = [...oldData, {
        id: "",
        customerId: "",
        job: "",
        name: "",
        notes: "",
        orgName: "",
        phoneNum: "",
        mainContact: oldData.length ? 1 : 0,
        createDate: util.toDateString(new Date(), "yyyy-MM-dd HH:mm:ss"),
        creater: window.user ?  window.user.name || '' : '',
        uploadDate: util.toDateString(new Date(), "yyyy-MM-dd HH:mm:ss"),
      }]
      cb && cb()
      table.reload(el, {
        url: '',
        data: newData
      })
    } else if (type === 'del') {
      layer.confirm('确定删除联系人？', function(index) {
        if (!data.id) {
          cb && cb()
          layer.close(index);
          return
        }
        if (data.mainContact === 0) {
          layer.msg('无法删除主要联系人');
          return
        }
        ajaxGet('customerLiaison/remove', { id: data.id }, () => {
          cb && cb()
          layer.close(index);
        })
      });
    } else if (type === 'selectMain') {
      const oldData = table.cache[el];
      const newData = oldData.map((item, index) => data.index.toString() === index.toString() ? { ...item, mainContact: 0 } : { ...item, mainContact: 1 })
      table.reload(el, {
        url: '',
        data: newData
      })
    }
  }

  // layer模板
  const layerLayout = (data = null, configs = null, params = null) => {
    const {
      title = '',
      prefixPath = '/plugins/crm/components',
      path = '',
      operate = '',
      isFooter = true,
      btn = [
        {type: 'submit', name: '提交'},
        {type: 'save', name: '保存'},
        {type: 'cancel', name: '取消'}
      ],
      area = ['700px', '550px'],
      source = '',
      isTop = true,
      maxmin = true
    } = configs
    const {
      yes,
      btn2,
      btn3,
      success
    } = params
    const _layer = isTop ? layui.layer : layer
    _layer.open({
      type: 2
      ,title: title
      ,content: `..${prefixPath}${path}`
      ,maxmin
      ,area
      ,btn: isFooter && btn.length ? btn.map(item => item.name) : false
      ,btnAlign: 'l'
      ,yes: function(index, layero) {
        if (!yes) {
          //点击确认触发 iframe 内容中的按钮提交
          const submit = layero.find('iframe').contents().find(`#layuiadmin-app-form-${btn[0].type}`);
          submit && submit.click();
        } else {
          yes(index, layero)
        }
      }
      ,btn2: function (index, layero) {
        if (!btn2) {
          if (btn[1].type !== 'cancel') {
            const submit = layero.find('iframe').contents().find(`#layuiadmin-app-form-${btn[1].type}`);
            submit && submit.click();
            return false
          }
        } else {
          btn2(index, layero)
        }
      }
      ,btn3: function (index, layero) {
        console.log('取消')
        btn3 && btn3(layero, index)
      }
      ,success: function(layero, index) {
        success && success(layero, index)
      }
    });
  }

  // 打开客户报备
  const openClientRecords = (data = null, configs, readOnly) => {
    const { operate = '' } = configs
    layerLayout(data, {
      ...configs,
      path: '/clientRecords/records.html'
    }, {
      success: (layero, index) => {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        if (operate === 'edit') {
          iframeWin.edit(data, readOnly)
        } else if (operate === 'apply') {
          iframeWin.apply(data)
        }
      }
    })
  }

  // 报备意见
  const openRecordsArgument = (data = null, configs, type) => {
    layerLayout(data, {
      ...configs,
      path: '/clientRecords/recordsArgument.html'
    }, {
      success: (layero, index) => {
        const parentIndex = layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.init(data, parentIndex, type)
      }
    })
  }

  // 打开客户详情
  const openClientDetails = (data = null, configs) => {
    layerLayout(data, {
      ...configs,
      path: '/clientDetails/details.html',
      area: ['100vw', '100vh'],
      maxmin: false,
      isFooter: false
    }, {
      success: (layero, index) => {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.init(data)
      }
    })
  }

  // 打开联系人名单
  const openContactModel = (data, configs) => {
    layerLayout(data, {
      ...configs,
      path: '/contactModel/contact.html'
    }, {
      yes: function(index, layero) {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.save(data)
      },
      success: function(layero, index) {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.init(data)
      }
    })
  }

  // 新建联系人
  const addContact = (data, configs) => {
    const { operate = '' } = configs
    layerLayout(data, {
      ...configs,
      path: '/contactModel/addContact.html'
    }, {
      success: function(layero, index) {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        if (operate === 'edit') {
          iframeWin.edit(data)
        } else if (operate === 'apply') {
          iframeWin.apply(data)
        }
      }
    })
  }

  // 新建票据
  const addBilling = (data, configs) => {
    const { operate = '' } = configs
    layerLayout(data, {
      ...configs,
      path: '/billingModel/addBilling.html'
    }, {
      success: (layero, index) => {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        if (operate === 'edit') {
          iframeWin.edit(data)
        } else if (operate === 'apply') {
          iframeWin.apply(data)
        }
      }
    })
  }

  // 申请项目立项
  const approvalProject = (data, configs) => {
    layerLayout(data, {
      ...configs,
      path: '/projectApply/apply.html',
      area: ['100vw', '100vh'],
    }, {
      success: (layero, index) => {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.init(data)
      }
    })
  }

  // 打开客户详情
  const openProjectDetails = (data = null, configs) => {
    layerLayout(data, {
      ...configs,
      path: '/projectDetails/details.html',
      area: ['100vw', '100vh'],
      maxmin: false,
      isFooter: false
    }, {
      success: (layero, index) => {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.init(data)
      }
    })
  }

  // 新建合同
  const addContract = (data, configs) => {
    const { operate = '' } = configs
    layerLayout(data, {
      ...configs,
      path: '/contractModel/addContract.html'
    }, {
      success: function(layero, index) {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        if (operate === 'edit') {
          iframeWin.edit(data)
        } else if (operate === 'apply') {
          iframeWin.apply(data)
        }
      }
    })
  }

  // 打开合同详情
  const openContractDetails = (data = null, configs) => {
    layerLayout(data, {
      ...configs,
      path: '/contractModel/details.html',
      area: ['100vw', '100vh'],
      maxmin: false,
      isFooter: false
    }, {
      success: (layero, index) => {
        const iframeWin = layero.find('iframe')[0].contentWindow;
        iframeWin.opener=window
        iframeWin.init(data)
      }
    })
  }

  exports('operate', {
    searchForm,
    formVerify,
    ajaxPost,
    ajaxGet,
    updateFiles,
    contactChange,
    layerLayout,
    openClientRecords,
    openClientDetails,
    openRecordsArgument,
    openContactModel,
    addContact,
    addBilling,
    approvalProject,
    openProjectDetails,
    addContract,
    openContractDetails
  })
})
