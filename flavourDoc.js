"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var HashFlavourFactory_1 = require("./lib/flavours/HashFlavourFactory");
var JsonFlavourFactory_1 = require("./lib/flavours/JsonFlavourFactory");
var MultilineSlashFlavourFactory_1 = require("./lib/flavours/MultilineSlashFlavourFactory");
var NativeFlavourFactory_1 = require("./lib/flavours/NativeFlavourFactory");
var SlashFlavourFactory_1 = require("./lib/flavours/SlashFlavourFactory");
var XmlFlavourFactory_1 = require("./lib/flavours/XmlFlavourFactory");
var flavours = [
    new HashFlavourFactory_1.HashFlavourFactory().create(),
    new JsonFlavourFactory_1.JsonFlavourFactory().create(),
    new MultilineSlashFlavourFactory_1.MultilineSlashFlavourFactory().create(),
    new NativeFlavourFactory_1.NativeFlavourFactory().create(),
    new SlashFlavourFactory_1.SlashFlavourFactory().create(),
    new XmlFlavourFactory_1.XmlFlavourFactory().create()
];
console.log('The following flavours are supported currently:\n');
for (var _i = 0, flavours_1 = flavours; _i < flavours_1.length; _i++) {
    var flavour = flavours_1[_i];
    console.log("  * " + flavour.name + ": " + flavour.description);
    console.log('    * Cartridge example: `' + flavour.example + '`');
    console.log('    * Cartridge collector example: `' + flavour.collectorExample + '`');
}
