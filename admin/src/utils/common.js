//防抖
export function debounce(fn, wait) {
  let timer = null;
  return function() {
    if (timer !== null) clearTimeout(timeout);
    timer = setTimeout(fn, wait);
  };
}
//节流
export function throttle(fn, delay) {
  let prev = Date.now();
  return function() {
    let now = Date.now();
    if (now - prev > delay) {
      fn();
      prev = Date.now();
    }
  };
}

export function toArray(_arr) {
  return _arr.length ? Array.prototype.concat.apply([], _arr) : false;
}

export function getTreeData(target_class, tag_lst) {
  tag_lst = tag_lst ? tag_lst : ["H1", "H2", "H3", "H4", "H5", "H6"];
  const doc_list = document.getElementsByClassName(target_class)[0].children;
  const _tree = [];
  let index = -1;
  for (let i = 0; i < doc_list.length; i++) {
    if (tag_lst.indexOf(doc_list[i].tagName) >= 0) {
      index++;
      _tree.push({
        id: doc_list[i].firstChild.id,
        deep: parseInt(doc_list[i].tagName.replace("H", "")),
        title: doc_list[i].innerText,
        index: index
      });
    }
  }
  return _tree;
}

export function treeify(_tree, tag) {
  let tree = [];
  let deep = 0;
  tag = tag ? tag : 0;
  _tree.forEach(node => {
    //为当前节点添加children属性
    node.children = [];
    //当前树的宽度为0
    if (tree.length == 0) {
      node.tag = tag + ++deep + ".";
      //将第一个节点直接添加进去
      tree.push(node);
    } else {
      //判断当前节点的深度是否小于等于当前树第一层最后节点的深度
      if (node.deep <= tree[tree.length - 1].deep) {
        node.tag = tag + ++deep + ".";
        //直接推入当前树的第一层
        tree.push(node);
      } else {
        //添加到当前树第一层最后节点下
        tree[tree.length - 1].children.push(node);
      }
    }
  });

  tree.forEach(node => {
    let ids = [];
    deep = 0;
    node.children.forEach(child => {
      child.tag = node.tag + ++deep + ".";
      if (ids.indexOf(child.deep) === -1) {
        ids.push(child.deep);
      }
    });
    //递归子节点
    if (ids.length > 1) {
      node.children = treeify(node.children, node.tag);
    }
  });
  return tree;
}
