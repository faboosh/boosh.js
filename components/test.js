import { Component } from "../lib/component.js";

export const Test = new Component({
    data: {
        test: "this is a",
        test2: "child component"
    },
    methods: {
        funcTest() {
            return "with its own method"
        }
    },
    template:  [
        ['p', 'I am a child component'],
        ['p', 'funcTest'],
    ]
})