const express = require('express');

const server = express();

server.use(express.json());
let quantity = 0;

server.use((req, res, next) =>{
    quantity++;

    console.time('Request');

    console.log(`Metodos: ${req.method}; URL: ${req.url}`);

    next();

    console.timeEnd('Request');
    console.log(`Number of requests requested for this application ${quantity}`);
});

function checkProjectInArray(req, res, next){
    const project = projects[req.params.id];
    if(!project){
        return res.status(400).json({ error: 'Project not found'});
    }

    return next();
}

const projects = [];

server.post('/projects', (req, res)=>{
    let item = {};
    const { id, title, task } = req.body;
    
    item.id = id;
    item.title = title;
    item.task = task;
    
    projects.push(item);
    return res.send();
});

server.get('/projects', (req, res)=> {
    return res.json(projects);
});

server.put('/projects/:id', checkProjectInArray, (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    
    projects.map(item => {
        if(item.id === id) item.title = title;
    });

    return res.json(projects);
});

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
    const { id } = req.params;
    projects.splice(id, 1);

    return res.json(projects);
});

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) =>{
    const {id} = req.params;
    const {tasks} = req.query;

    projects[id].task = tasks;
    return res.json(projects);
});

server.listen(3000); 