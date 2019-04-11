var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.transfering === undefined) {
            creep.memory.transfering = false
        }

        if(creep.memory.transfering && creep.carry.energy == 0) {
            creep.memory.transfering = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.transfering && creep.carry.energy == creep.carryCapacity) {
            creep.memory.transfering = true;
            creep.say('🚧 transfer');
        }

        if(!creep.memory.transfering) {
            let sources = creep.room.find(FIND_SOURCES);
            let sourceRand = creep.memory.harvest
            if(creep.harvest(sources[sourceRand]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceRand], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
        else {
            var targets = creep.room.find(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_EXTENSION ||
                         structure.structureType == STRUCTURE_SPAWN) &&
                        structure.energy < structure.energyCapacity;
                }
            });
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_CONTAINER &&
                            _.sum(structure.store) < structure.storeCapacity;
                    }
                });
            }
            if (targets.length === 0) {
                targets = creep.room.find(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN
                    }
                });
            }
            if(targets.length > 0) {
                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleHarvester;