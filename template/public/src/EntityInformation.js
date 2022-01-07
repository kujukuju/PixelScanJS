class EntityInformation {
    static entities = {};

    static update() {
        for (const name in EntityInformation.entities) {
            EntityInformation.entities[name].update();
        }
    }

    static addEntity(name, entity) {
        entity.__name = name;
        EntityInformation.entities[name] = entity;
    }
    
    static silentRemoveEntity(entity) {
        delete EntityInformation.entities[entity.__name];
    }
}