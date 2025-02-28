# Seismic
Seismic is a Log Parser for server logs of the game Quake 3 Arena. Make your data easy to read and manipulate by exporting it to JSON or pretty-printing it to the terminal!

## Installation
```
$ git clone https://github.com/elimarp/seismic.git
$ cd seismic
$ npm install
$ npm run build
```
Now that you've downloaded the project and its dependencies and built it, you're good to go!

## Usage
Seismic has an interactive CLI so you don't have to bother writing long commands. Try `npm start` or `node dist/src`  
![demo](https://s3.amazonaws.com/elimarp.github/seismic-demo.gif)  
The Interactive CLI first lists the logs files available in `./gamelogs`, so you can either add log files to this folder or select `Use another file` to input any other path.  
You can find you're generated **report outputs** at `./reports`

## How It Works
Some things are important to notice. The most important of them are the **log events**:
- **ClientUserInfoChanged**: Called from ClientConnect when the player first connects and directly by the server system when the
player updates a userinfo variable.
- **ClientConnect**: Called when a player begins connecting to the server. Called again for every map change or tournament restart.
- **ClientBegin**: Called when a client has finished connecting, and is ready to be placed into the level. This will happen every level load, and on transition between teams, but doesn't happen on respawns.
- **ClientDisconnect**: Called when a player drops from the server. Will not be called between levels.
- **Kill**: Called when a player gets killed. Either by another player or \<world\>, which is always gonna be identified `1022`, as says the game source code [here](https://github.com/id-Software/Quake-III-Arena/blob/master/code/game/q_shared.h#L1102).
- **Item**: Called when an item gets touched by a player.
- **InitGame**: Called when a game is started.
- **ShutdownGame**: Called when a game is shut down.
- **Exit**: Append information about this game to the log file.

Seismic creates a read stream to iterate through the lines of your log file and relies on these log events to group data correctly for each map.

## Developer Notes
This project was **Test-Driven Developed (TDD)** following the **Clean Architecture** principles in order to maintain its structure independent of frameworks, databases, and external dependencies of any kind. It also follows the [Semantic Versioning](https://semver.org/) and [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) guides to maintain a semantic changelog and commit history.
> _"It is not enough for code to work."_  
> -- Robert C. Martin

## Running Tests
You can run the unit tests in this project by running `npm test` in your terminal. You can also collect coverage information with `npm run test:coverage`. A `./test/coverage` folder will be generated by [Jest](https://github.com/jestjs/jest) containing the coverage information.