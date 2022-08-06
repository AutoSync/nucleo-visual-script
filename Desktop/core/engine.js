const { ipcRenderer } = require('electron')
const { LGraph, LGraphCanvas, LiteGraph } = require('litegraph.js')

//Main elements

const main = document.getElementById('graph')
const title = document.getElementById('window-title')

var graph = new LGraph()
var canvas = new LGraphCanvas("#graph-view", graph)
var node_const = LiteGraph.createNode("basic/const")
node_const.pos = [0, 0]
graph.add(node_const)
node_const.setValue(4.5)

var node_watch = LiteGraph.createNode("basic/watch")
node_watch.pos = [0, 200]
graph.add(node_watch)
node_const.connect(0, node_watch, 0)

graph.start()


ipcRenderer.on('new-script', function(event, data){
    main.innerHTML = data.content
    title.innerHTML = 'NGL | ' +  data.name 
 })