  // 1. 判定标签是否存在 id, 存在则停止
  // 2. 取标签, 如果是 body 则停止, 否则记录 tag
  // 2.1 如果标签为 img, 则记录 src -> 停止
  // 3. 取 classname -> tag.classname1.classname2
  // 4. 取 :nth-child, 同时记录是否存在和已记录的 tag.classname 匹配的节点以及节点索引(从 1 开始计数)
  // 5. 不存在时, 直接使用索引
  // 6. 向上查找 -> 执行 1 - 5, 直到到 body 为止

  function getSelector(x, y) {
    var node = document.elementFromPoint(x, y);
    var pathArr = [];
    walk(node, function(node) {
      if (node) {
        if (node.id) {
          pathArr.push('#' + node.id);
          return true;
        } else if (node.nodeName == 'IMG') {
          pathArr.push(node.src);
          return true;
        } else {
          pathArr.push(getPath(node));
        }
      }
    }, document.body);
    return pathArr.reverse().join(' > ');

    function walk(node, handle, context) {
      while (node) {
        if (handle(node) === true) {
          return node;
        }
        if (node === context) {
          break;
        } else {
          node = node.parentNode;
        }
      }
      return null;
    }

    function getPath(node) {
      var path;
      var info = getNodeInfo(node);
      var index = info.index;
      var sameClassName = info.sameToClass;
      var sameNodeName = info.sameToName;
      var nodeName = node.nodeName.toLowerCase();
      if (!sameNodeName) {
        path = nodeName;
      } else if (node.className && !sameClassName) {
        path = nodeName + '.' + [].join.call(node.classList, '.');
      } else {
        path = nodeName + ':nth-child(' + index + ')';
      }
      return path;
    }

    function hasSameClassName(curNode, node) {
      var className = node.className;
      if (curNode.className == className) {
        return true;
      } else if (curNode.classList.length > 1) {
        var arrCls = curNode.classList;
        for (var i = 0; i < arrCls.length; i++) {
          if (className.indexOf(arrCls[i]) > -1) {
            return true;
          }
        }
        return false;
      }
      return false;
    }

    function getNodeInfo(node) {
      var curNode = node.parentNode.firstChild;
      var n = 0;
      var i = 0;
      var classN = 0;
      var nameN = 0;
      while (curNode) {
        if (curNode.nodeType == 1) {
          n++;
          if (curNode === node) {
            i = n;
          } else {
            if (node.className && hasSameClassName(curNode, node)) {
              classN++;
            }
            if (curNode.nodeName == node.nodeName) {
              nameN++;
            }
          }
        }
        curNode = curNode.nextSibling;
      }
      return {
        sameToClass: classN,
        sameToName: nameN,
        count: n,
        index: i
      }
    }

  }
