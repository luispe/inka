iru
===



[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/iru.svg)](https://npmjs.org/package/iru)
[![CircleCI](https://circleci.com/gh/LuisPe/iru/tree/master.svg?style=shield)](https://circleci.com/gh/LuisPe/iru/tree/master)
[![Codecov](https://codecov.io/gh/LuisPe/iru/branch/master/graph/badge.svg)](https://codecov.io/gh/LuisPe/iru)
[![Downloads/week](https://img.shields.io/npm/dw/iru.svg)](https://npmjs.org/package/iru)
[![License](https://img.shields.io/npm/l/iru.svg)](https://github.com/LuisPe/iru/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g iru
$ iru COMMAND
running command...
$ iru (-v|--version|version)
iru/0.0.0 linux-x64 node-v10.15.1
$ iru --help [COMMAND]
USAGE
  $ iru COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`iru hello [FILE]`](#iru-hello-file)
* [`iru help [COMMAND]`](#iru-help-command)
* [`iru new [FILE]`](#iru-new-file)

## `iru hello [FILE]`

describe the command here

```
USAGE
  $ iru hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ iru hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/LuisPe/iru/blob/v0.0.0/src/commands/hello.ts)_

## `iru help [COMMAND]`

display help for iru

```
USAGE
  $ iru help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.0/src/commands/help.ts)_

## `iru new [FILE]`

describe the command here

```
USAGE
  $ iru new [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/new.ts](https://github.com/LuisPe/iru/blob/v0.0.0/src/commands/new.ts)_
<!-- commandsstop -->
