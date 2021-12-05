const elementSymbol = Symbol.for("element")
// expand the HTML element ability
Object.defineProperties(window.HTMLElement.prototype, {
    // setting styles through a string
    css: { set: Object.getOwnPropertyDescriptor(window.HTMLElement.prototype, 'style').set },
    // allow setting of styles through string or object
    style: {
        set: function (styles) {
            if (typeof styles == "string") {
                this.css = styles
            } else {
                Object.assign(this.style, styles)
            }
        }
    },
    // allow setting of children directly
    children: {
        set: function(newChilden) {
            // remove all children
            while (this.firstChild) {
                this.removeChild(this.firstChild)
            }
            // add new child nodes
            for (let each of newChilden) {
                this.add(each)
            }
        },
        get: function() {
            return this.childNodes
        }
    },
    class: {
        set: function(newClass) {
            this.className = newClass
        },
        get: function() {
            return this.className
        }
    }
})
// add()
window.HTMLElement.prototype.add = window.SVGElement.prototype.add = window.HTMLSelectElement.prototype.add = function (...inputs) {
    for (let each of inputs) {
        if (typeof each == 'string') {
            this.appendChild(new window.Text(each))
        } else if (each instanceof Function) {
            this.add(each())
        } else if (each instanceof Array) {
            this.add(...each)
        } else if (each instanceof Object && each[elementSymbol]) {
            this.add(each[elementSymbol])
        } else {
            this.appendChild(each)
        }
    }
    return this
}

// addClass()
window.HTMLElement.prototype.addClass = function (...inputs) {
    return this.classList.add(...inputs)
}

// for (let eachChild of elemCollection)
window.HTMLCollection.prototype[Symbol.iterator] = function* () {
    let index = 0
    let len = this.length
    while (index < len) {
        yield this[index++]
    }
}
// for (let eachChild of elem)
window.HTMLElement.prototype[Symbol.iterator] = function* () {
    let index = 0
    let len = this.childNodes.length
    while (index < len) {
        yield this.childNodes[index++]
    }
}
// create a setter/getter for <head>
const originalHead = document.head
// add a setter to document.head
Object.defineProperty(document,"head", { 
    set: (element) => {
        document.head.add(...element.childNodes)
    },
    get: ()=>originalHead
})

// 
// add all the dom elements
// 
const elements = {}
const tagNames = ["a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "big", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hr", "html", "i", "iframe", "img", "input", "ins", "kbd", "label", "legend", "li", "link", "main", "map", "mark", "meta", "meter", "nav", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "script", "section", "select", "small", "source", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]
for (const each of tagNames) {
    elements[each.toUpperCase()] = function(properties, ...children) {
        // if only given children
        if (properties instanceof window.Node || typeof properties == 'string') {
            children.unshift(properties)
            properties = null
        }
        // create either an html element or an svg element
        const element = document.createElement(each)
        if (properties instanceof Object) {
            for (const [key, value] of Object.entries(properties)) {
                try {
                    element.setAttribute(key, value)
                } catch (error) {
                }
                element[key] = value
            }
        }
        return element.add(...children)
    }
}
// 
// add all the (exclusively) svg elements (because <a> tags are both SVG and Dom *facepalm*)
// 
const exclusivelySvgElements = [ "svg", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "discard", "ellipse", "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence", "filter", "foreignObject", "g", "hatch", "hatchpath", "image", "line", "linearGradient", "marker", "mask", "mesh", "meshgradient", "meshpatch", "meshrow", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "set", "stop", "switch", "symbol", "text", "textPath", "tspan", "unknown", "use", "view",]
for (const each of tagNames) {
    elements[each.toUpperCase()] = function(properties, ...children) {
        // if only given children
        if (properties instanceof window.Node || typeof properties == 'string') {
            children.unshift(properties)
            properties = null
        }
        // create either an html element or an svg element
        const element = document.createElementNS('http://www.w3.org/2000/svg', each)
        if (properties instanceof Object) {
            for (const [key, value] of Object.entries(properties)) {
                try {
                    element.setAttribute(key, value)
                } catch (error) {
                }
                element[key] = value
            }
        }
        return element.add(...children)
    }
}

function makeGlobal() {
    Object.assign(window, elements)
}

// if there is no exporting system
if(typeof exports == "undefined"){
    // put everything in the window scope
    makeGlobal()
// if there is an export system
} else {
    // give the user the choice of local or window
    module.exports = elements
    module.exports.global = makeGlobal
}
