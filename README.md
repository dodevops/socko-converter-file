# socko-converter-file - Converting file hierarchies to SOCKO! nodes

[![npm](https://img.shields.io/npm/v/socko-converter-file.svg)](https://www.npmjs.com/package/socko-converter-file)

## Introduction

This is a converter for the [SOCKO! api](https://github.com/dodevops/socko-api) converting file hierarchies to
SOCKO! nodes and vice versa.

It's used by the SOCKO! cli and grunt plugins as the main link to the SOCKO! api.

## Features

Currently the following features exist:

* Converting from a file hierarchy to a SOCKO! node hierarchy:
  * Identifies directories as SimpleNodeInterfaces
  * Identifies simple files as SimpleNodeInterfaces
  * Identifies SocketNodeInterfaces
  * Identifies CartridgeNodeInterfaces
  * Identifies BucketNodeInterfaces
* Converting from a SOCKO! output node hierarchy to a file hierarchy:
  * Converts BranchNodeInterface to directories
  * Converts OutputNodeInterface to files

All options for the conversion are encapsulated in an options object, that can be modified as fitting when running the conversion process. Its defaults match the older versions of SOCKO!.

### Socket nodes

Socket nodes are identified by a custom file prefix (defaulting to .socket). The prefix is removed and the rest is used as the name of the socket node.

To identify cartridge and cartridge collector slots, we support a variety of flavours in the content of the socket file. All supported flavours are checked in turn and all matching flavours are extracted and removed from the content in the SocketNodeInterface.

The following flavours are supported currently:

  * Hash: Documents suitable for source code with hash-style comments
    * Cartridge example: `# SOCKO: CARTRIDGE-NAME #`
    * Cartridge collector example: `# SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN #`
  * JSON: Flavour suitable for JSON documents. The trailing , is optional
    * Cartridge example: `"_SOCKO": "CARTRIDGE-NAME",`
    * Cartridge collector example: `"_SOCKO:COLLECT": "MAXIMUMDEPTH:PATTERNTYPE:PATTERN",`
  * Multiline-Slash: Flavour for source code with slash-comments, multiline option
    * Cartridge example: `/* SOCKO: CARTRIDGE-NAME */`
    * Cartridge collector example: `/* SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN */`
  * Native: SOCKO!'s own, native flavour
    * Cartridge example: `{{<< SOCKO: CARTRIDGE-NAME >>}}`
    * Cartridge collector example: `{{<< SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN >>}}`
  * Slash: Flavour for source code with slash-comment style
    * Cartridge example: `// SOCKO: CARTRIDGE-NAME //`
    * Cartridge collector example: `// SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN //`
  * XML: Flavour for documents, that need XML validity
    * Cartridge example: `<!-- SOCKO: CARTRIDGE-NAME -->`
    * Cartridge collector example: `<!-- SOCKO:COLLECT:MAXIMUMDEPTH:PATTERNTYPE:PATTERN -->`

`MAXIMUMDEPTH` matches the maxDepth property of SocketNodeInterface, the `PATTERNTYPE` can either be `G` for a glob pattern or `R` for a regexp pattern.

### Cartridge nodes

Cartridge nodes are identified by a custom file prefix (defaulting to .cartridge). The prefix is removed and the rest is used as the name of the cartridge node.

### Bucket nodes

A bucket node is identified by a directory, that holds a single file called '.socko.include'. The file content is then scanned for the bucket declaration in this pattern:

    MAXIMUMDEPTH:PATTERNTYPE:PATTERN


`MAXIMUMDEPTH` and `PATTERNTYPE` have the same meaning as in Cartridge flavours.

## Building

To test and build this package, simply use grunt:

    grunt test
