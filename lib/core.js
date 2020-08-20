export class Boosh {
    constructor(mountpoint, root) {
        this._mountpoint = document.querySelector(mountpoint);
        this.root = root;
        this.render();
    }

    render() {
        this._mountpoint.appendChild(this.root.render())
    }
}

export const Fragment = (array) => {
    return ['fragment', '', array]
}