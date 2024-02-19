const term = {
    namespace: "term",
    afterEnter(data) {
        console.log(`enter ${this.namespace}`);
    },
    beforeLeave(data) {
        console.log(`enter ${this.namespace}`);
    }
}

export default term;
