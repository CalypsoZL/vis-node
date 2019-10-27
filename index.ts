import { VisNode } from "./visnode";
const sigma = require("./sigma.min.js");
const s = new sigma('container');
const NODENUM = 5
const nodes:VisNode[] = [];
const data = {nodes:[], links:[]}

for (let i = 0; i < NODENUM; i++) {
    const threshold = Math.random() * 50;
    const decayRate = 0.5;
    nodes.push(new VisNode(threshold, decayRate))
    s.graph.addNode({
        // Main attributes:
        id: i,
        label: i,
        // Display attributes:
        x: Math.random(),
        y: Math.random(),
        size: 1,
        color: '#f00'
      })
}

for (let i = 0; i < nodes.length; i++) {
    for (let j = 0; j < nodes.length; j++) {
        if (i !== j && Math.random() > 0.5) {
            const edgeWeight = Math.random() * 20;
            nodes[i].addConnection(nodes[j], edgeWeight);
            s.graph.addEdge({
                id: i + '-' + j,
                source: i,
                target: j
            })
        }
    }
}

