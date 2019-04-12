let roleHarvester = require('role.harvester');
let roleUpgrader = require('role.upgrader');
let roleBuilder = require('role.builder');
let roleRepairer = require('role.repairer');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var repairers = _.filter(Game.creeps, (creep) => creep.memory.role == 'repairer');
    
    let genValue = Object.keys(Game.creeps).length
    let result
    let sources = Game.rooms['W13N3'].find(FIND_SOURCES);
    let randomRole = Math.floor(Math.random() * 3, 3)
    let randomHarvest = Math.floor(Math.random() * sources.length, sources.length)

    if (genValue <= 18) {
        if (repairers.length == 0) {
            var newName = 'Repairer' + Game.time;
            result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                {memory: {role: 'repairer', harvest: randomHarvest}});  
        } else if (randomRole == 0) {
            var newName = 'Upgrader' + Game.time;
            result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                {memory: {role: 'upgrader', harvest: randomHarvest}}); 
        } else if(randomRole == 1) {
            var targets = creep.room.find(FIND_CONSTRUCTION_SITES);
            if (targets.length > 0) {
                var newName = 'Builder' + Game.time;
                result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                    {memory: {role: 'builder', harvest: randomHarvest}});                 
            }
        } else {
            var newName = 'Harvester' + Game.time;
            result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], newName,
                {memory: {role: 'harvester', harvest: randomHarvest}});
        }
    }

    if (result == 0) {
        console.log('Spawning new screep: ' + newName);
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    // createRoad()

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
        if(creep.memory.role == 'repairer') {
            roleRepairer.run(creep);
        }
    }
}

function createRoad() {
    var sources = Game.spawns['Spawn1'].room.find(FIND_SOURCES);
        for (var j = 0; j < sources.length; j++)
        {
            var chemin = Game.spawns['Spawn1'].pos.findPathTo(sources[j].pos);
            for (var i = 0; i < chemin.length; i++) 
            {
                Game.spawns['Spawn1'].room.createConstructionSite(chemin[i].x,chemin[i].y, STRUCTURE_ROAD);
            }
        }
}