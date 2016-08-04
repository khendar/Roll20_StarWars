var eote = {};
eote.process = {};

eote.init = function () {
    eote.events();
    eote.process.logger("asd","asd");
};
eote.defaults = {
    regex: {
        cmd: /!eed/,
        characterID: /characterID\((.*?)\)/,
    }
};

eote.events = function () {
    eote.process.logger("events","what");
    //event listener Add character defaults to new characters
    on("add:character", function (characterObj) {
        eote.setCharacterDefaults(characterObj);
    });
    on("chat:message", function (msg) {

        if (msg.type != 'api') {
            return;
        }
        eote.process.setup(msg.content, msg.who, msg.playerid);
    });
};
 eote.process.setup = function (cmd, playerName, playerID) {
        eote.process.logger("setup",cmd);
        eote.process.logger("playerName",playerName);
        eote.process.logger("playerID",playerID);
        
        var characterID = cmd.match(eote.defaults.regex.characterID);
        if (characterID) {
            eote.process.logger(characterID);
            var characterID = characterID[1];
            var character = getObj("character", characterID);
            eote.process.logger("character",character.get("name"));
        }
            eote.process.createRepeating(
        /repeating_critical/,
        'repeating_reaction_%%RID%%_action',
        character,
        character.get("name"),
        "updateMsg"
        );
 }
 eote.process.logger = function (functionName, cmd) {
       log(functionName + ' : ' + cmd);
};
eote.process.createRepeating = function(nameRegex, actionPattern, character, characterName, updateMsg) {
    eote.process.logger("repeating","repeating");
    eote.process.logger("nameregex",nameRegex);
    eote.process.logger("actionPattern",actionPattern);
    eote.process.logger("character",character);
    eote.process.logger("characterName",characterName);
    eote.process.logger("updateMsg",updateMsg);
    updateMsg = [];
        var repeatingAttrs = filterObjs(function(o){
            return o.get('type')==='attribute' && o.get('characterid') === character.id && o.get('name').match(nameRegex);
        });
        eote.process.logger("Repeating",repeatingAttrs);
        
        var newId = generateRowID();
                
        var newType = "attribute";
        var newCharacterId = character.id;
        createObj(newType, {name: "repeating_critical_"+newId+"_character-critName", type: newType,id:newId, characterid: newCharacterId,current: "Winded!"});
        createObj(newType, {name: "repeating_critical_"+newId+"_character-critRange", type: newType,id:newId, characterid: newCharacterId,current: "1-10"});
        createObj(newType, {name: "repeating_critical_"+newId+"_character-critSummary", type: newType,id:newId, characterid: newCharacterId,current: "Increase difficulty of all skill checks by 1 Difficulty die until end of encounter.!"});
       
};


  var generateUUID = (function() {
    "use strict";

    var a = 0, b = [];
    return function() {
        var c = (new Date()).getTime() + 0, d = c === a;
        a = c;
        for (var e = new Array(8), f = 7; 0 <= f; f--) {
            e[f] = "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(c % 64);
            c = Math.floor(c / 64);
        }
        c = e.join("");
        if (d) {
            for (f = 11; 0 <= f && 63 === b[f]; f--) {
                b[f] = 0;
            }
            b[f]++;
        } else {
            for (f = 0; 12 > f; f++) {
                b[f] = Math.floor(64 * Math.random());
            }
        }
        for (f = 0; 12 > f; f++){
            c += "-0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz".charAt(b[f]);
        }
        return c;
    };
}()),

generateRowID = function () {
    "use strict";
    return generateUUID().replace(/_/g, "Z");
};      
on('ready', function() {
    eote.init();
});