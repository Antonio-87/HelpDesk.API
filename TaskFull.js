const Task = require('./Task');

class TaskFull extends Task {
    constructor(id, name, description, status, created) {
        super(id, name, status, created);
        this.description = description;
    }
} 

module.exports = TaskFull;