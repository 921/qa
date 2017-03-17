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

// 如果是img 返回src
function getSelector(node) {
  var pathArr = [];
  walk(node, function(node) {
    if (node) {
      if (node.id) {
        pathArr.push('#' + node.id);
        return true;
      } else {
        pathArr.push(getPath(node));
      }
    }
  }, document.body);
  return pathArr.reverse().join(' > ');
}

function getPath(node) {
  var path;
  var info = getNodeInfo(node);
  var index = info.index;
  var sameClassName = info.sameToClass;
  var sameNodeName = info.sameToName;
  var nodeName = node.nodeName.toLowerCase();
  if (nodeName == 'img') {
    path = node.src;
  } else if (!sameNodeName) {
    path = nodeName;
  } else if (node.className) {
    if (!sameClassName) {
      path = nodeName + '.' + [].join.call(node.classList, '.');
    } else {
      path = nodeName + ':nth-child(' + index + ')';
    }
  } else if (index > 0) {
    path = nodeName + ':nth-child(' + index + ')';
  } else {
    path = nodeName;
  }
  return path;
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
        if (curNode.className == node.className) {
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
