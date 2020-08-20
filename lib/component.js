import { Bind } from './bind.js';
import { DOMNode } from './domnode.js';


export class Component {
    constructor({data, methods, template, components}) {
        this.data = data;
        this.methods = methods;
        this.template = template;
        this.components = components;
        this.binds = [];
        this.nodes = [];

        //Bind methods to class instance
        for(const method in methods) {
            methods[method] = methods[method].bind(this);
        }
    }

    render() {
        const _mount = document.createElement('component'); 

        this.template.forEach(component => { this.mount(component, _mount); })

        return _mount;
    }

    mount(component, mount, parentNode) {

        //If component is function, evaluate function
        let renderFunction;
        if(typeof this.methods[component] == 'function') {
            renderFunction = this.methods[component];
            component = this.methods[component]();
        }

        let node = new DOMNode({
            innerText: component[1],
            name: component[0]
        });

        //Render child component if name is present in component list
        if(this.components && this.components[node.name]) {
            node.from(this.components[node.name].render());
        
        //Else treat name as element
        } else {
            node.from(node.name);

            if(this.methods[node.innerText]) {
                node.innerText = this.methods[node.innerText]();
            }
            else if(this.data[node.innerText]) {            
                this.binds.push(
                    new Bind({
                        attribute: 'innerText',
                        elem: node.textNode,
                        innerText: node.innerText
                    })
                )
                node.innerText = this.data[node.innerText];
            }

            node.textNode.innerText = node.innerText;

            if(node.innerText) {
                node.elem.appendChild(node.textNode);
            }
        }

        //Extract child elements and attributes from component
        const children = component[component.findIndex(val => Array.isArray(val))];
        const attributes = component[component.findIndex(val => !Array.isArray(val) && typeof(val) == 'object')];

        //Add child components to parent element
        this.addChildren(children, node.elem, node);      

        //Set attributes
        this.addAttributes(attributes, node.elem);

        mount.appendChild(node.elem);

        node.elem.addEventListener('methodCall', (e) => {
            const { name, rootEvent } = e.detail;
            this.methods[name](rootEvent);
        });

        if(parentNode) {
            node.parentNode = parentNode;
        }

        this.nodes.push(node);

        console.log(this.nodes);
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
            if(this.methods[attributes[attribute]]) {
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

    setState(newState) {
        for(const val in this.data) {
            if(JSON.stringify(this.data[val]) != JSON.stringify(newState[val])) {
                const bind = this.binds[this.binds.findIndex(bind => {return bind.data == val})];
                this.data[val] = newState[val];
                bind.update(newState[val]);
            }
        }
    }
}