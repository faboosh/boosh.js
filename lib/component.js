import { Bind } from './bind.js';
import { DOMNode } from './domnode.js';


export class Component {
    constructor({data, methods, template, components}) {
        this._data = data;
        this._methods = methods;
        this._template = template;
        this._vDom = null;
        this._realDom = null;
        this._components = components;
        this._binds = [];
        this._nodes = [];
        this._accessesData = [];
        this._realMount = document.createElement('component'); 
        this._virtualMount = document.createElement('component');
        this.mounted = false;

        //Bind methods to class instance
        for(const method in methods) {
            methods[method] = methods[method].bind(this);
        }

        this._realMount.addEventListener('methodCall', (e) => {
            const { name, rootEvent } = e.detail;
            this._methods[name](rootEvent);
        });
    }

    render() {  
        if(!this.mounted) {
            console.log('rendered');   
            this.createDom(this._template, this._realMount);
            this.mounted = true;
        }

        return this._realMount;
    }

    shouldComponentRender() {
        this._virtualMount = document.createElement('component');
        this.createDom(this._template, this._virtualMount);
        
        console.log(this._virtualMount.innerHTML == this._realMount.innerHTML);
    }

    createDom(template, mount) {
        template.forEach(component => {
            this.generateNodes(component, mount, mount);
        })
    }

    generateNodes(component, mount, root) {
        //Extract child elements and attributes from component
        const children = component[component.findIndex(val => Array.isArray(val))];
        const attributes = component[component.findIndex(val => !Array.isArray(val) && typeof(val) == 'object')];
        const node = this.createElement(component[0], component[1]);   

        if(attributes) this.addAttributes(attributes, root)
        
        if(children && children.length && children.length > 0) {
            children.forEach(child => {
                if(Array.isArray(child)) this.generateNodes(child, node, root);
            })
        }
        mount.appendChild(node);
    }

    getData(key, context) {
        //this._accessesData.push({key, context});
        //return this._data[key];

        console.log(Function.caller)
    }

    addChildren(children, elem, parentNode) {
        if(children && children.length && children.length > 0) {
            children.forEach(child => { 
                if(typeof this.methods[child] == 'function') {
                    child = this.methods[child]();
                }

                this.mount(child, elem, parentNode || null) 
            });
        }
    }

    addAttributes(attributes, elem) {
        for(const attribute in attributes) {
            if(this._methods[attributes[attribute]]) {
                const methodCall = function(e) {
                    const event = new CustomEvent('methodCall', { detail: { name: attributes[attribute], rootEvent: e }});
                    elem.dispatchEvent(event);
                }

                elem[attribute] = function(e) { methodCall(e) };
                
            } else {
                elem.setAttribute(attribute, attributes[attribute])
            }
        }
    }

    setData(newData) {
        /*for(const val in this._data) {
            if(JSON.stringify(this._data[val]) != JSON.stringify(newState[val])) {
                const bind = this._binds[this._binds.findIndex(bind => {return bind.data == val})];
                this._data[val] = newState[val];
                bind.update(newState[val]);
            }
        }*/

        this._data = newData;

        this.shouldComponentRender();
    }

    createElement(element, innerText) {
        let elementNode;

        if (this._components && this._components[element]) {
            elementNode = this._components[element].render();
        } else {
            elementNode = document.createElement(element);
            if(innerText) {
                const textNode = document.createElement('textnode');
                textNode.innerText = innerText;
                elementNode.appendChild(textNode);
            }
        }

        return elementNode;
    }
}