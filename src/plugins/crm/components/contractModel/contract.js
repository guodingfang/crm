layui.define(['table', 'form', 'util', 'element', 'operate', 'info'], function(exports){
  const table = layui.table
    ,form = layui.form
    ,element = layui.element
    ,util = layui.util
    ,operate = layui.operate
    ,info = layui.info
    ,$ = layui.$;


  const renderTable = (el) => {
    const url = el === 'returned-price' ? '/project/pro/payment/getPayInfolist' : ''
    table.render({
      elem: `#${el}-table`
      ,url:`../../../../mock/contractManage.json`

      ,cellMinWidth: 80
      ,height: 'full-430'
      // ,parseData: function(res) {
      //   return {
      //     code: 0,
      //     msg: res.msg,
      //     count: res.total || 0,
      //     data: res.data
      //   }
      // }
      ,cols: [
        tableCols[el]
      ]
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
  }

  let uploadFiles = []
  const renderFiles = () => {
    table.render({
      elem: '#files-table'
      ,id: 'files-table'
      ,cellMinWidth: 80 //全局定义常规单元格的最小宽度，layui 2.2.1 新增
      ,cols: [[
        {width:40,align:'center', title: '序号', type: 'numbers'}
        ,{field:'contentType',width:100, title: '文件类型'}
        ,{field:'fileName',width:100, edit: 'text',  title: '文件名', templet: function (d) {
            return `<div class="cell-text-container" title="${d.fileName}">${d.fileName}</div>`
          }}
        ,{field:'fileSize', width:100,align:'center', title: '文件大小', templet: function (d) {
            return `<div class="cell-text-container" title="${d.fileSize}">${d.fileSize}B</div>`
          }}
        ,{field:'status', width:50,align:'center', title: '状态'}
        ,{field:'createDate', title: '上传时间', templet: function (d) {
            return `<div class="cell-text-container" title="${d.createDate}">${d.createDate}</div>`
          }}
        ,{title: '操作', width: 110, align: 'center', toolbar: '#files-table-operation'}
      ]]
      ,data: []
      ,limit: 1000
      ,done: function(res, curr, count) {
        console.log('res', res)
        uploadFiles = res.data.map(function(item) {
          delete item.LAY_TABLE_INDEX;
          return item;
        });
      }
    })

  }

  // 图片上传成功回调
  const uploadSuccee = (id, files) => {
    var oldData = table.cache[id];
    var tableData = [];   //定义一个空数组,用来存储之前编辑过的数据已经存放新数据
    for (var i = 0; i < oldData.length; i++) {
      tableData.push(oldData[i]);      //将之前的数组备份
    }

    files.forEach(function(file) {
      tableData.unshift({
        contentType: file.contentType,
        extName: file.extName,
        fileName: file.fileName,
        fileSize: file.fileSize,
        fileUrl: file.url,
        status: '成功',
        createDate: util.toDateString(new Date(), "yyyy-MM-dd HH:mm:ss"),
        createUser: window.user ?  window.user.name || '' : '',
        uploadUser: window.user ?  window.user.name || '' : '',
        uploadDate: util.toDateString(new Date(), "yyyy-MM-dd HH:mm:ss"),
      })
    })
    table.reload(id, {
      data: tableData,
    })
  }

  const updateFiles = (el, cb) => {
    operate.updateFiles(el, cb)
  }

  const saveContract = (params) => {
    operate.ajaxPost('/project/pro/contract/save', {
      ...params,
      attachPath: JSON.stringify(uploadFiles)
    }, {
      prefix: projectUrl,
      success: ({ data }) => {
        if (data === 'success') {
          const index = layui.layer.getFrameIndex(window.name); //先得到当前iframe层的索引
          opener.layui.table.reload('table-list'); //重载表格
          layui.layer.close(index); //再执行关闭
        }
        console.log('data', data)
      }
    })

  }

  exports('contract', {
    renderTable,
    renderFiles,
    uploadSuccee,
    updateFiles,
    saveContract,

  })
});
