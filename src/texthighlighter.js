// custom text highlighter
export class textHighlight {

    constructor(ele) {
        let styles = window.getComputedStyle(ele);
        this.origBkgColor = styles.backgroundColor;

        this.ele = ele;
        this.isTextArea = this.ele.tagName == 'TEXTAREA';
        this.searchArg = '';
        this.sensitive = false;
        this.ele_index = null;
        this.handlers = {
            input: this.#inputHandler.bind(this),
            scroll: this.#scrollHandler.bind(this)
        }

        this.ele.classList.add('htla-textarea');
        this.ele.addEventListener('input', this.handlers.input);
        this.ele.addEventListener('scroll', this.handlers.scroll);

        let nodeCont = document.createElement('div');
        nodeCont.classList.add('hlta-container');
        this.container = nodeCont;

        let nodeBack = document.createElement('div');
        nodeBack.classList.add('hlta-backdrop');    
        this.backdrop = nodeBack; 

        let nodeHilite = document.createElement('div');
        nodeHilite.classList.add('hlta-highlight');  
        this.hilite = nodeHilite;

        this.ele.parentNode.insertBefore(nodeCont, this.ele.nextSibling);
        this.backdrop.append(this.hilite);
        this.container.append(this.backdrop);
        this.container.appendChild(this.ele);   

        let obs = new ResizeObserver(this.#resizeObs.bind(this)).observe(this.ele);
        this.#inputHandler();
    }
    
    search(arg, sensitive, ele_index) {
        this.searchArg = arg;
        this.ele_index = ele_index;
        this.sensitive = !!sensitive;
        this.#inputHandler();
    }

    clear() { 
        this.searchArg  = '';
        this.hilite.innerHTML = this.hilite.textContent;
    }

    destroy() {
        this.ele.removeEventListener('input', this.handlers.input);
        this.ele.removeEventListener('scroll', this.handlers.scroll);

        this.container.parentNode.insertBefore(this.ele, this.container); 
        while (this.container.firstChild) {
            this.container.removeChild(this.container.lastChild);
        }
        this.container.remove();
    }

    #resizeObs() {
        let styles = window.getComputedStyle(this.ele);
        let width = this.ele.scrollWidth; 
        // Name :Lakshya Dujari
        // commented the console line
        // Date: 03.09.2023
        // console.log(this.ele.offsetWidth, ', ', this.ele.scrollWidth)
        let height = this.ele.offsetHeight;

        let css = `width: ${width}px; height: ${height}px; margin: ${styles.marginTop} ${styles.marginRight} ${styles.marginBottom} ${styles.marginLeft}; 
                    background-color: ${this.origBkgColor}`; 
        this.backdrop.style.cssText = css;
        this.#copyStyles(this.ele, this.hilite, ['width', 'paddingLeft', 'paddingRight', 'paddingTop', 'paddingBottom', 'borderTop', 'letterSpacing',
                                                'borderLeft', 'borderRight', 'borderBottom', 'lineHeight']);
        this.hilite.style.minHeight = styles.height;
        this.hilite.style.whiteSpace = this.isTextArea ? 'pre-wrap' : 'nowrap';
    }

    #inputHandler() {
        this.hilite.innerHTML = this.#markText();
        this.#scrollHandler();
    }

    #copyStyles(src, dest, styles2Copy) {
        let styles = window.getComputedStyle(src);
        styles2Copy.forEach((stl) => dest.style[stl] = styles[stl])
    }

    #markText() { 
        let txt = this.isTextArea ? this.ele.value : this.ele.textContent;
        if( this.ele_index != null ){
            txt = txt.replace(/</g, "&lt;").replace(/>/g,"&gt;");
            let txt_arr = txt.split(" ");
            txt_arr[this.ele_index] = txt_arr[this.ele_index].replace(/</g, "&lt;").replace(/>/g,"&gt;");
            let re = new RegExp('(' + this.#escapeString(txt_arr[this.ele_index]) + ')', 'g' + (this.sensitive ? '' : 'i'));
            txt_arr[this.ele_index] = txt_arr[this.ele_index].replace(re, '<mark>$1</mark>');
            txt = txt_arr.join(' ');
            return txt; 
        } else {
            if (this.searchArg) {
                let re = new RegExp('(' + this.#escapeString(this.searchArg) + ')', 'g' + (this.sensitive ? '' : 'i')); 
                return txt.replace(re, '<mark>$1</mark>');
            } else {
                return txt;
            }
        }
    }

    // Escape a string to be used in a Regex search (replace)
    #escapeString(txt) {
        let specials = ['-', '[', ']', '/', '{', '}', '(', ')', '*', '+', '?', '.', '\\', '^', '$', '|'];
        let regex = RegExp('[' + specials.join('\\') + ']', 'g'); 
        return txt.replace(regex, '\\$&'); 
    }

    #scrollHandler() { 
        this.backdrop.scrollTop = this.ele.scrollTop || 0; 
        let sclLeft = this.ele.scrollLeft;
        this.backdrop.style.transform = (sclLeft > 0) ? 'translateX(' + -sclLeft + 'px)' : '';
    }
}