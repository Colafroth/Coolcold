var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (creep.memory.upgrading === undefined) {
            creep.memory.upgrading = false
        }

        if(creep.memory.upgrading && creep.carry.energy == 0) {
            creep.memory.upgrading = false;
            creep.say('🔄 harvest');
        }
        if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
            creep.say('⚡ upgrade');
        }

        if(creep.memory.upgrading) {
            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleUpgrader;