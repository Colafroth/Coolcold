var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.repairing === undefined) {
            creep.memory.repairing = false
        }       

        if(creep.memory.repairing && creep.carry.energy == 0) {
            creep.memory.repairing = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.repairing && creep.carry.energy == creep.carryCapacity) {
            creep.memory.repairing = true;
            creep.say('🚧 repair');
        }
        
        if(creep.memory.repairing) {
            const targets = creep.room.find(FIND_STRUCTURES, {
                filter: object => object.hits < object.hitsMax
            });
            
            targets.sort((a,b) => a.hits - b.hits);
            
            if(targets.length > 0) {
                if(creep.repair(targets[0]) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets[0]);
                }
            } 
        }
        else {
            let sources = creep.room.find(FIND_SOURCES);
            let sourceRand = creep.memory.harvest
            if(creep.harvest(sources[sourceRand]) == ERR_NOT_IN_RANGE) {
                creep.moveTo(sources[sourceRand], {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        }
    }
};

module.exports = roleRepairer;