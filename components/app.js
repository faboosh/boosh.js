import { Component } from "../lib/component.js";
import { Test } from "./test.js";

export const App = new Component({
    components: {
        Test
    },
    data: {
        test: "wow, templating",
        test2: "bad boi templating"
    },
    methods: {
        funcTest() {
            return "this one even renders from a method in the parent, after the child component"
        },
        eventTest(e) {
            console.log('I am bound to a button');
            let newState = {...this.data};
            
            console.log(this.setState());
        }
    },
    template:  [
        ['p', 'test',
            [
                ['br'],
                ['b', 'test2'],
                ['br'],
                ['Test'],
                ['br'],
                ['p', 'funcTest'],
                ['button', 'Click me', 
                    {
                        onclick: "eventTest", 
                        style: 
                            `
                                background: #2222dd; 
                                color: white; 
                                border: none; 
                                padding: 10px; 
                                border-radius: 5px
                            `
                    }
                ]
            ]
        ]
    ]
})


