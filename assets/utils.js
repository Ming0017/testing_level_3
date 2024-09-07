window.$ = Document.prototype.$ = Element.prototype.$ = $
window.$$ = Document.prototype.$$ = Element.prototype.$$ = $$

function $(selector) {
  const _this = Element.prototype.isPrototypeOf(this) ? this : document
  const sel = String(selector).trim();

  const id = /^#([^ +>~\[:]*)$/.exec(sel)?.[1]
  return (id && _this === document) ? _this.getElementById(id) : _this.querySelector(sel)
}

function $$(selector) {
  const _this = Element.prototype.isPrototypeOf(this) ? this : document
  return Array.from(_this.querySelectorAll(selector))
}

function setStyle() {
  [[Map, () => {
    const styleMap = arguments[0]
    for (const [el, styleObj] of styleMap) {
      !Array.isArray(el) ? setStyleObj(el, styleObj) : el.forEach((el) => setStyleObj(el, styleObj))
    }
  }], [Element, () => {
    const [el, styleObj] = arguments
    setStyleObj(el, styleObj)
  }], [Array, () => {
    const [els, styleObj] = arguments
    els.forEach((el) => setStyleObj(el, styleObj))
  }]].some(([O, fn]) => O.prototype.isPrototypeOf(arguments[0]) ? (fn(), true) : false)

  function setStyleObj(el, styleObj) {
    for (const attr in styleObj) {
      if (el.style[attr] !== undefined) {
        el.style[attr] = styleObj[attr]
      } else {
        //将key转为标准css属性名
        const formatAttr = attr.replace(/[A-Z]/, match => `-${match.toLowerCase()}`)
        console.error(el, `的 ${formatAttr} CSS属性设置失败!`)
      }
    }
  }
}

function createEl(elName, options) {
  const el = document.createElement(elName)
  for(let opt in options) {
    if(opt !== 'style') {
      el[opt] = options[opt]
    } else {
      let styles = options[opt]
      setStyle(el, styles)
    }
  }
  return el
}