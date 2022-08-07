const { ipcRenderer } = require('electron')
const { LGraph, LGraphCanvas, LiteGraph } = require('litegraph.js')
//Graph canvas elements
const main = document.getElementById('graph')
const title = document.getElementById('window-title')
var graph = new LGraph()
var canvas = new LGraphCanvas("#graph-view", graph)

const event_color = "#A70000"
const flow_color = "#CACACA"
const float_color = "#00A712"
const bool_color = "#FF0000"
//Events
function BeginProgram()
{
    this.addOutput("Exec", LiteGraph.EVENT)
}
BeginProgram.title = "Begin"
BeginProgram.title_color = event_color
BeginProgram.prototype.onExecute = function (){
    this.triggerSlot(0)
}
LiteGraph.registerNodeType("event/begin", BeginProgram)

function TickProgram(){
    this.addOutput("Exec", LiteGraph.EVENT)
    this.addOutput("deltaTime", "number")
    this.properties = { precision: 1}
}
TickProgram.title = "Tick"
TickProgram.title_color = event_color
TickProgram.prototype.onExecute = function (){
    this.triggerSlot(0)
    this.setOutputData(1, 1)
}
LiteGraph.registerNodeType("event/tick", TickProgram)

//Math
function sumMath(){
    this.addInput("A", "number")
    this.addInput("B", "number")
    this.addOutput("Output", "number")
    this.properties = { precision: 1 }
}
sumMath.title = "+"
sumMath.title = float_color
sumMath.prototype.onExecute = function (){
    let a = this.getInputData(0)
    let b = this.getInputData(1)
    if(a === undefined)
        a = 0
    if(b === undefined)
        b = 0
    this.setOutputData(0, a + b)
}
LiteGraph.registerNodeType("math/sum", sumMath)

function subMath(){
    this.addInput("A", "number")
    this.addInput("B", "number")
    this.addOutput("Output", "number")
    this.properties = { precision: 1 }
}
subMath.title = "-"
subMath.title_color = float_color
subMath.prototype.onExecute = function (){
    let a = this.getInputData(0)
    let b = this.getInputData(1)
    if(a === undefined)
        a = 0
    if(b === undefined)
        b = 0
    this.setOutputData(0, a - b)
}
LiteGraph.registerNodeType("math/subtract", subMath)

//Flow Control
function branchFlowControl(){
    this.addInput("Exec", LiteGraph.ACTION)
    this.addInput("Condition", "number")
    this.addOutput("True", LiteGraph.EVENT)
    this.addOutput("False", LiteGraph.EVENT)
    this.properties = { precision: 1 };
}
branchFlowControl.title = "Branch"
branchFlowControl.title_color = flow_color
branchFlowControl.prototype.onAction = function(action){
    let condition = this.getInputData(1)
    
    if(condition === undefined)
       condition = 0
    else if(condition == 0 && action == "Exec")
        this.triggerSlot(1)
    else
        this.triggerSlot(0)

} 
LiteGraph.registerNodeType("flow/branch", branchFlowControl)

function ForFlowControl(){
    this.addInput("Exec", LiteGraph.ACTION)
    this.addInput("Start", "number")
    this.addInput("End", "number")
    this.addOutput("Body", LiteGraph.EVENT)
    this.addOutput("Index", "number")
    this.addOutput("Completed", LiteGraph.EVENT)
    this.properties = { precision: 0 }
}
ForFlowControl.title = "For"
ForFlowControl.title_color = flow_color
ForFlowControl.prototype.onAction = function(action){
    
    let start = this.getInputData(1)
    let last = this.getInputData(2)

    if(action == "Exec")
    {
        for(let i = start; i < last; i++)
        {
            this.setOutputData(1, i)
            this.triggerSlot(0)
        }
        this.triggerSlot(2)
    }
}
LiteGraph.registerNodeType("flow/for", ForFlowControl)

function ForEachFlowControl()
{
    this.addInput("Exec", LiteGraph.ACTION)
    this.addInput("Array[i]", "array")
    this.addOutput("Body", LiteGraph.EVENT)
    this.addOutput("Element", "number")
    this.addOutput("Index", "number")
    this.addOutput("Completed", LiteGraph.EVENT)
    this.properties = { precision: 0 }
}
ForEachFlowControl.title = "For Each"
ForEachFlowControl.title_color = flow_color
ForEachFlowControl.prototype.onAction = function(action){
    
    if(action == "Exec")
    {
        let array = this.getInputData(1)
        for(let i = 0; i < array.length; i++)
        {
            this.setOutputData(1, array[i])
            this.setOutputData(2, i)
            this.triggerSlot(0)
        }

        this.triggerSlot(3)
    }
}
LiteGraph.registerNodeType("flow/foreach", ForEachFlowControl)


var node_const = LiteGraph.createNode("basic/const")
node_const.pos = [0, 0]
node_const.setValue(4.5)

var node_watch = LiteGraph.createNode("basic/watch")
node_watch.pos = [0, 200]

var n_branch = LiteGraph.createNode("flow/branch")
n_branch.pos = [20, 200]
var begin = LiteGraph.createNode("event/begin")
begin.pos = [0, 10]
var tick = LiteGraph.createNode("event/tick")
tick.pos = [0, 50]
var for_0 = LiteGraph.createNode("flow/for")
for_0.pos = [100, 200]
var foreach_0 = LiteGraph.createNode("flow/foreach")
foreach_0.pos = [200, 200]

graph.add(node_const)
graph.add(node_watch)
graph.add(begin)
graph.add(tick)
graph.add(n_branch)
graph.add(for_0)
graph.add(foreach_0)

graph.start()

ipcRenderer.on('new-script', function(event, data){
    main.innerHTML = data.content
    title.innerHTML = 'NGL | ' +  data.name 
 })