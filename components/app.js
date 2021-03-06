import { Component } from "../lib/component.js";
import { Fragment } from "../lib/core.js";
import { Test } from "./test.js";

export const App = new Component({
    components: {
        Test
    },
    data: {
        test: "wow, templating",
        test2: "bad boi templating",
        arrayTest: [
            'this is an array',
            'it has multiple items'
        ]
    },
    methods: {
        funcTest() {
            return "this one even renders from a method in the parent, after the child component"
        },
        eventTest(e) {
            let newState = {...this.data};
            newState.test = "Someone just clicked a button!";
            this.setState(newState);
        },
        templateThing() {
            return Fragment(
                this.data.arrayTest.map(
                    item => 
                        [
                            'p', 
                            item, 
                            {
                                style: 
                                    `
                                        background: hotpink; 
                                        color: white;
                                        padding: 10px; 
                                        border-radius: 5px
                                    `
                            }
                        ]
                    )
                );
        }
    },
    template:  [
        'templateThing',
        ['Test']
    ]
})


