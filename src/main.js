var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    // var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    // console.log('Harvesters: ' + harvesters.length);
    
    let genValue = Object.keys(Game.creeps).length
    let result
    let sources = Game.rooms['W13N3'].find(FIND_SOURCES);
    let randomHarvest = Math.floor(Math.random() * sources.length, sources.length)

    if (genValue <= 18) {
        if (genValue % 3 == 0) {
            var newName = 'Upgrader' + Game.time;
            result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
                {memory: {role: 'upgrader', harvest: randomHarvest}}); 
        } else if(genValue % 3 == 1) {
            var newName = 'Builder' + Game.time;
            result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
                {memory: {role: 'builder'}}); 
        } else {
            var newName = 'Harvester' + Game.time;
            result = Game.spawns['Spawn1'].spawnCreep([WORK, WORK, CARRY, MOVE, MOVE], newName,
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