"use strict";

let s = new sigma('container');
const NODENUM = 1500;
const HEIGHT = 250;
const WIDTH = 400;
const EDGE_LEN_REDUCTION = 22;
let nodes = [];
let data = { nodes: [], links: [] };
let threshold = 2;
let decayRate = 0.9;
const colorspread = 1;
const colorstart = 0;
const edgeDecayRate = 200;
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
    nodes.push(new VisNode(threshold, Math.random() * decayRate, 1, edgeDecayRate));
    s.graph.addNode({
        // Main attributes:
        id: i,
        label: i,
        // Display attributes:
        x: Math.random() * 2 * WIDTH - WIDTH,
        y: Math.random() * 2 * HEIGHT - HEIGHT,
        size: 1,
        color: toColor(i*colorspread+ colorstart)
    });
}
s.refresh()
const graphNodes = s.graph.nodes();
const graphEdges = s.graph.edges();
const r = diff({x:WIDTH,y:WIDTH}, {x:-HEIGHT, y:-HEIGHT});
// console.log(r);
// console.log(graphNodes);
for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
        const distModifier = diff(graphNodes[i], graphNodes[j])*EDGE_LEN_REDUCTION/r;
        if (i !== j && Math.random() > distModifier) {
            let edgeWeight = Math.random() * 50 * distModifier;
            nodes[i].addConnection(nodes[j], edgeWeight);
            s.graph.addEdge({
                id: i + '-' + j,
                source: i,
                target: j,
                size: 1,
                color: nodes[i].color
            });
        }
    }
}
const minNodeSize = 0.5;
const maxNodeSize = 5;
const minEdgeSize = 0.2;
const maxEdgeSize = 1.5;
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

let x = 0;
const decayInterval = Math.round(Math.pow(nodes.length, 1/4));
console.log(decayInterval, "decayInterval");
s.bind('clickNode',(e) => {
    nodes[e.data.node.id].input(10);
});
const nodeMult = ((minNodeSize + maxNodeSize)/4);
const edgeMult = ((minEdgeSize + maxEdgeSize)/40);
s.myUpdate = () => {
    const graphNodes = s.graph.nodes()
    const graphEdges = s.graph.edges()
    let j = 0;
    for (let i = 0; i < graphNodes.length; i++) {
        graphNodes[i].size = clamp((nodes[i].charge + 1)*nodeMult, minNodeSize, maxNodeSize);
        for (let k = 0; k < nodes[i].edges.length; k++) {
            graphEdges[j].size = clamp(nodes[i].edges[k] *edgeMult, minEdgeSize, maxEdgeSize);
            j++;
        }
    }
}
// setInterval(() => {
//     const graphNodes = s.graph.nodes()
//     const graphEdges = s.graph.edges()
//     let j = 0;
//     for (let i = 0; i < graphNodes.length; i++) {
//         graphNodes[i].size = clamp((nodes[i].charge + 1) * 0.5, minNodeSize, maxNodeSize);
//         for (let k = 0; k < nodes[i].edges.length; k++) {
//             graphEdges[j].size = clamp(nodes[i].edges[k] * 0.05, minEdgeSize, maxEdgeSize);
//             j++;
//         }
//     }

//     if (x++ % decayInterval == 0) nodes.forEach(node => node.decay());
//     nodes.forEach(node => node.distributeCharge());
//     s.refresh();
//     // const sin = (Math.sin(x/slowness)+1)*2;
//     // const cos = (Math.cos(x++/slowness)+1)*2;
//     // // console.log(sin);
//     // // console.log(cos);
//     // nodes[0].input(sin);
//     // nodes[1].input(cos);
//     // nodes.forEach(node => node.decay());
// }, 100);

// setInterval(() => {
//     nodes.forEach(node => node.distributeCharge())
// }, 100)


// setInterval(() => {

// }, 100)
// s.graph.nodes()[0].size = 10.3;
// s.refresh();

function diff(a, b) {
    return Math.sqrt(Math.pow(a.x-b.x, 2)+Math.pow(a.y-b.y, 2))
}


function toColor(num) {
    const val = 200 * num / NODENUM;
    console.log(val)
    const h= Math.floor((200 - val) * 240 / 200);
    const s = Math.abs(val - 100)/100;
    const v = 5;
    return hsv2rgb(h, s, v);
}

function hsv2rgb(h, s, v) {
    // adapted from http://schinckel.net/2012/01/10/hsv-to-rgb-in-javascript/
    var rgb, i, data = [];
    if (s === 0) {
      rgb = [v,v,v];
    } else {
      h = h / 60;
      i = Math.floor(h);
      data = [v*(1-s), v*(1-s*(h-i)), v*(1-s*(1-(h-i)))];
      switch(i) {
        case 0:
          rgb = [v, data[2], data[0]];
          break;
        case 1:
          rgb = [data[1], v, data[0]];
          break;
        case 2:
          rgb = [data[0], v, data[2]];
          break;
        case 3:
          rgb = [data[0], data[1], v];
          break;
        case 4:
          rgb = [data[2], data[0], v];
          break;
        default:
          rgb = [v, data[0], data[1]];
          break;
      }
    }
    return '#' + rgb.map(function(x){
      return ("0" + Math.round(x*255).toString(16)).slice(-2);
    }).join('');
  };
