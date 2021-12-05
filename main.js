const htmlEventHandlers = new Set(['onabort', 'onanimationcancel', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onauxclick', 'onblur', 'onerror', 'onfocus', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onformdata', 'ongotpointercapture', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadend', 'onloadstart', 'onlostpointercapture', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onwheel', 'onpause', 'onplay', 'onplaying', 'onpointerdown', 'onpointermove', 'onpointerup', 'onpointercancel', 'onpointerover', 'onpointerout', 'onpointerenter', 'onpointerleave', 'onpointerlockchange', 'onpointerlockerror', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onsecuritypolicyviolation', 'onseeked', 'onseeking', 'onselect', 'onselectstart', 'onselectionchange', 'onshow', 'onslotchange', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'onvolumechange', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart', 'ontransitioncancel', 'ontransitionend', 'ontransitionrun', 'ontransitionstart', 'onwaiting', ])
const fixedAttributes = new Set(['accept', 'accept-charset', 'accesskey', 'action', 'align', 'allow', 'alt', 'async', 'autocapitalize', 'autocomplete', 'autofocus', 'autoplay', 'background', 'bgcolor', 'border', 'buffered', 'capture', 'challenge', 'charset', 'checked', 'cite', 'class', 'code', 'codebase', 'color', 'cols', 'colspan', 'content', 'contenteditable', 'contextmenu', 'controls', 'coords', 'crossorigin', 'csp', 'data', 'datetime', 'decoding', 'default', 'defer', 'dir', 'dirname', 'disabled', 'download', 'draggable', 'enctype', 'enterkeyhint', 'for', 'form', 'formaction', 'formenctype', 'formmethod', 'formnovalidate', 'formtarget', 'headers', 'height', 'hidden', 'high', 'href', 'hreflang', 'http-equiv', 'icon', 'id', 'importance', 'integrity', 'intrinsicsize', 'inputmode', 'ismap', 'itemprop', 'keytype', 'kind', 'label', 'lang', 'language', 'loading', 'list', 'loop', 'low', 'manifest', 'max', 'maxlength', 'minlength', 'media', 'method', 'min', 'multiple', 'muted', 'name', 'novalidate', 'open', 'optimum', 'pattern', 'ping', 'placeholder', 'poster', 'preload', 'radiogroup', 'readonly', 'referrerpolicy', 'rel', 'required', 'reversed', 'rows', 'rowspan', 'sandbox', 'scope', 'scoped', 'selected', 'shape', 'size', 'sizes', 'slot', 'span', 'spellcheck', 'src', 'srcdoc', 'srclang', 'srcset', 'start', 'step', 'style', 'summary', 'tabindex', 'target', 'title', 'translate', 'type', 'usemap', 'value', 'width', 'wrap', ...htmlEventHandlers]) 
const isAnHtmlAttribute = (string) => {
    if (fixedAttributes.has(string)) {
        return true
    } else if (string.startsWith('data-')) {
        return true
    }
    return false
}

const cssHmtlOverlap = new Set(['width', 'height', 'background', 'border', 'color'])
const splitHtmlCssAttributes = (object)=> {
    const htmlAttributes = {}
    const cssAttributes = {}
    for (const [key, value] of Object.entries(object)) {
        if (cssHmtlOverlap.has(key)) {
            htmlAttributes[key] = value
            cssAttributes[key] = value
        } else if (isAnHtmlAttribute(key)) {
            htmlAttributes[key] = value
        } else {
            cssAttributes[key] = value
        }
    }
    return [htmlAttributes, cssAttributes]
}

const computeDirection = (row, column, reverse) => {
    const output = row ? 'row' : 'column'
    if (!reverse) {
        return output
    } else {
        return `${output}-reverse`
    }
}

const humanPositionToCssPosition = (humanPosition) => {
    if (humanPosition === 'relativeToParent') {
        return 'absolute'
    } else if (humanPosition === 'relativeToSelf') {
        return 'relative'
    } else if (humanPosition === 'relativeToWindow') {
        return 'fixed'
    } else if (humanPosition === 'sticky') {
        return 'sticky'
    } else if (typeof humanPosition === 'string') {
        console.warn(`positionSelf needs to be one of [ 'relativeToParent', 'relativeToSelf', 'relativeToWindow', 'sticky' ]\nbut instead it was: '${humanPosition}'`)
    }
    return undefined
}

const humanPositionToCssFlexbox = (humanWord) => {
    if (humanWord.match(/^(top|left)$/i)) {
        return 'flex-start'
    } else if (humanWord.match(/^(bottom|right)$/i)) {
        return 'flex-end'
    } else {
        return humanWord
    }
}

const columnAlignment = (horizontalAlignment, verticalAlignment, innerAlignment, wrap) => {
    if (!wrap) {
        return {
            justifyContent: verticalAlignment,
            alignItems: horizontalAlignment,
        }
    } else {
        return {
            // still just vertical space between
            justifyContent: verticalAlignment,
            // when wrapped this becomes the inner item alignment
            alignItems: innerAlignment,
            // when wrapped this becomes the horizontal space between
            alignContent: horizontalAlignment,
        }
    }
}

const rowAlignment = (horizontalAlignment, verticalAlignment, innerAlignment, wrap) => {
    if (!wrap) {
        return {
            justifyContent: horizontalAlignment,
            alignItems: verticalAlignment,
        }
    } else {
        return {
            // still just horizontal space between
            justifyContent: horizontalAlignment,
            // when wrapped this becomes the inner item alignment
            alignItems: innerAlignment,
            // when wrapped this becomes the vertical space between
            alignContent: verticalAlignment,
        }
    }
}

const computeFlexAlignmentAttributes = (directionIsRow, horizontalAlignment, verticalAlignment, innerAlignment, wrap) => {
    // convert to css form
    horizontalAlignment = humanPositionToCssFlexbox(horizontalAlignment)
    verticalAlignment = humanPositionToCssFlexbox(verticalAlignment)
    // then pick the correct one
    if (directionIsRow) {
        return rowAlignment(horizontalAlignment, verticalAlignment, innerAlignment, wrap)
    } else {
        return columnAlignment(horizontalAlignment, verticalAlignment, innerAlignment, wrap)
    }
}

const setProperties = (element, properties)=>{
    for (const [key, value] of Object.entries(properties)) {
        try {
            const kebabCase = key.replace(/(?<=[a-z])([A-Z])(?=[a-z])/g, (each)=>`-${each.toLowerCase()}`)
            element.setAttribute(kebabCase, value)
        } catch (error) {
        }
        element[key] = value
    }
}

const elementSymbol = Symbol.for("element")
function appendChildren(element, ...children) {
    for (const each of children) {
        if (typeof each == 'string') {
            element.appendChild(new window.Text(each))
        } else if (each == null) {
            // empty node
            element.appendChild(new window.Text(""))
        } else if (!(each instanceof Object)) {
            element.appendChild(new window.Text(`${each}`))
        } else if (each[elementSymbol]) {
            element.appendChild(each[elementSymbol])
        } else if (each instanceof Node) {
            element.appendChild(each)
        } else if (each instanceof Array) {
            appendChildren(element, ...each)
        } else if (each instanceof Function) {
            // recursively
            appendChildren(element, each())
        } else if (each instanceof Promise) {
            const elementPromise = each
            const placeholder = elementPromise.placeholder || document.createElement("div")
            setTimeout(async () => placeholder.replaceWith(await elementPromise), 0)
            element.appendChild(placeholder)
        // some elements are not HTML nodes and are still valid
        } else if (each != null && each instanceof Object) {
            element.appendChild(each)
        }
    }
    return element
}

module.exports = ({ row, column, reverse, wrap, positionSelf='relativeToSelf', verticalAlignment='top', horizontalAlignment='left', innerAlignment='center', textWrapAlignment, children, ...props })=>{
    const [htmlAttributes, cssAttributes] = splitHtmlCssAttributes(props)
    const element = document.createElement("div")
    // 
    // style
    // 
    Object.assign(element.style, {
        position: humanPositionToCssPosition(positionSelf) || 'relative',
        display: 'flex',
        flexDirection: computeDirection(row, column, reverse),
        flexWrap: wrap === 'reverse' ? 'wrap-reverse' : (wrap&&'wrap'),
        // text-align (effects how text will look when wrapped)
        textAlign: textWrapAlignment || horizontalAlignment,
        // handle the justifyContent/alignContent attributes
        ...computeFlexAlignmentAttributes(
            row,
            horizontalAlignment,
            verticalAlignment,
            innerAlignment,
            wrap,
        ),
        ...cssAttributes,
    })
    // 
    // attributes
    // 
    setProperties(element, {name: "positioner", ...htmlAttributes})
    appendChildren(element, children)
    return element
}