"use strict";

let s = new sigma('container');
const NODENUM = 800;
const HEIGHT = 250;
const WIDTH = 500;
const SPARSITY = 15;
let nodes = [];
let data = { nodes: [], links: [] };
let threshold = 3;
let decayRate = 0.8;
// nodes.push(new VisNode(threshold, decayRate));
// s.graph.addNode({
//     // Main attributes:
//     id: 0,
//     label: 0,
//     // Display attributes:
//     x: -250,
//     y: -250,
//     size: 1,
//     color: '#000'
// });
// threshold = Math.random() * 30+1;
// nodes.push(new VisNode(threshold, decayRate, 1));
// s.graph.addNode({
//     // Main attributes:
//     id: 1,
//     label: 1,
//     // Display attributes:
//     x: 250,
//     y: 250,
//     size: 1,
//     color: '#000'
// });

for (let i = 0; i < NODENUM; i++) {
    // let threshold = Math.random() * 20+1;
    nodes.push(new VisNode(threshold, Math.random() * decayRate, 1));
    s.graph.addNode({
        // Main attributes:
        id: i,
        label: i,
        // Display attributes:
        x: Math.random() * 2 * WIDTH - WIDTH,
        y: Math.random() * 2 * HEIGHT - HEIGHT,
        size: 1,
        color: '#454eb5'
    });
}
s.refresh()
const graphNodes = s.graph.nodes();
const graphEdges = s.graph.edges();
const r = diff({x:WIDTH,y:WIDTH}, {x:-HEIGHT, y:-HEIGHT});
console.log(r);
console.log(graphNodes);
for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
        if (i !== j && Math.random() > diff(graphNodes[i], graphNodes[j])*SPARSITY/r) {
            let edgeWeight = Math.random() * 20;
            nodes[i].addConnection(nodes[j], edgeWeight);
            s.graph.addEdge({
                id: i + '-' + j,
                source: i,
                target: j,
                size: 1,
                color: '#45b5ac'
            });
        }
    }
}
const minNodeSize = 1;
const maxNodeSize = 5;
const minEdgeSize = 0.1;
const maxEdgeSize = 3;
s.settings({
    minNodeSize: minNodeSize,
    maxNodeSize: maxNodeSize,
    defaultNodeSize: 0,
    minEdgeSize: minEdgeSize,
    maxEdgeSize: maxEdgeSize,
    defaultEdgeSize: 0,
    autoRescale: false
})
s.refresh();
// function update() {
//     const graphNodes = s.graph.nodes().slice();
//     const graphEdges = s.graph.edges().slice();
//     for (let i = 0; i < graphNodes.length; i++) {
//         s.graph.addNode({
//             // Main attributes:
//             id: i,
//             label: i,
//             // Display attributes:
//             x: Math.random(),
//             y: Math.random(),
//             size: 1,
//             color: '#f00'
//         });
//     }
// }
// nodes[0].input(50);
// nodes[0].input(50);
// nodes[1].input(50);
const slowness = 10
let x = -slowness*2;
setInterval(() => {
    const graphNodes = s.graph.nodes()
    const graphEdges = s.graph.edges()
    let j = 0;
    for (let i = 0; i < graphNodes.length; i++) {
        graphNodes[i].size = clamp((nodes[i].charge + 1) * 0.5, minNodeSize, maxNodeSize);
        for (let k = 0; k < nodes[i].edges.length; k++) {
            graphEdges[j].size = clamp(nodes[i].edges[k] * 0.05, minEdgeSize, maxEdgeSize);
            j++;
        }
    }


    s.refresh();
    // const sin = (Math.sin(x/slowness)+1)*2;
    // const cos = (Math.cos(x++/slowness)+1)*2;
    // // console.log(sin);
    // // console.log(cos);
    // nodes[0].input(sin);
    // nodes[1].input(cos);
    // nodes.forEach(node => node.decay());
}, 100);

setInterval(() => {
    nodes.forEach(node => node.distributeCharge())
}, 50)


// setInterval(() => {

// }, 100)
// s.graph.nodes()[0].size = 10.3;
// s.refresh();

function diff(a, b) {
    return Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2))
}

function clamp(a, n, x) {
    return max(min(a, x), n);
}
