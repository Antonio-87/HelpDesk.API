class Task {
    constructor(id, name, status, created) {
        this.id = id;
        this.name = name;
        this.status = status;
        this.created = created;
    }
  
    // метод для изменения статуса
    changeStatus(newStatus) {
        this.status = newStatus;
    }
}

module.exports = Task;