# Tic Tac Toe Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERACTION LAYER                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  CLI INTERFACE (index.ts)                    │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Commander.js                                         │  │
│  │  • program.command('play')                            │  │
│  │  • Default behavior: runs playGame()                  │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Readline Interface                                   │  │
│  │  • User input capture (1-9)                           │  │
│  │  • Input validation                                   │  │
│  │  • Position translation (user → zero-indexed)         │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Display Logic                                        │  │
│  │  • console.clear()                                    │  │
│  │  • Board rendering                                    │  │
│  │  • Game status messages                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Method Calls
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   GAME LOGIC (game.ts)                       │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              TicTacToe Class                         │   │
│  │                                                      │   │
│  │  STATE:                                              │   │
│  │  • board: Cell[] (9 elements)                       │   │
│  │  • currentPlayer: Player ('X' | 'O')                │   │
│  │  • gameOver: boolean                                │   │
│  │  • winner: Player | null                            │   │
│  │                                                      │   │
│  │  PUBLIC METHODS:                                     │   │
│  │  • makeMove(position: number): boolean              │   │
│  │  • getBoard(): Board                                │   │
│  │  • getCurrentPlayer(): Player                       │   │
│  │  • isGameOver(): boolean                            │   │
│  │  • getWinner(): Player | null                       │   │
│  │  • isDraw(): boolean                                │   │
│  │  • displayBoard(): string                           │   │
│  │                                                      │   │
│  │  PRIVATE METHODS:                                    │   │
│  │  • checkWinner(): boolean                           │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Data Flow Diagram

```
User Input (1-9)
      │
      ▼
┌─────────────────┐
│  Input Parser   │  Convert to 0-8, validate numeric range
└─────────────────┘
      │
      ▼
┌─────────────────┐
│  makeMove(pos)  │  Validate position, check game state
└─────────────────┘
      │
      ├─ false → Display "Invalid move"
      │
      ├─ true → Update board state
      │          │
      │          ▼
      │    ┌──────────────┐
      │    │ checkWinner()│  Check 8 win patterns
      │    └──────────────┘
      │          │
      │          ├─ Winner found → Set gameOver, winner
      │          ├─ Board full → Set gameOver (draw)
      │          └─ Continue → Switch player
      │
      ▼
Display Updated Board
      │
      ▼
Check Game State
      │
      ├─ Winner → Display winner message, exit
      ├─ Draw → Display draw message, exit
      └─ Continue → Prompt next player
```

## Type System

```typescript
┌──────────────────────────────────────────────────────────┐
│                    TYPE DEFINITIONS                       │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  Player = 'X' | 'O'                                      │
│    ↓                                                     │
│  Represents the two players in the game                  │
│                                                          │
│  Cell = Player | null                                    │
│    ↓                                                     │
│  Represents a single board position:                     │
│    • 'X' = Player X has marked                           │
│    • 'O' = Player O has marked                           │
│    • null = Empty position                               │
│                                                          │
│  Board = Cell[]                                          │
│    ↓                                                     │
│  Array of 9 cells representing the game board            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

## State Machine

```
                    ┌─────────────┐
                    │   INITIAL   │
                    │  board: []  │
                    │ player: 'X' │
                    └──────┬──────┘
                           │
                           ▼
              ┌────────────────────────┐
              │      PLAYER TURN       │
              │  Awaiting valid move   │
              └────────────────────────┘
                           │
                    makeMove(pos)
                           │
          ┌────────────────┼────────────────┐
          │                │                │
          ▼                ▼                ▼
    ┌─────────┐      ┌─────────┐    ┌──────────┐
    │ WINNER  │      │  DRAW   │    │ CONTINUE │
    │ FOUND   │      │  FOUND  │    │  GAME    │
    └─────────┘      └─────────┘    └──────────┘
          │                │                │
          │                │                │
          └────────────────┴────────────────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  GAME OVER  │
                    │ gameOver: T │
                    └─────────────┘
```

## Win Detection Algorithm

```
Board Positions:        Win Patterns (8 total):
┌───┬───┬───┐
│ 0 │ 1 │ 2 │          Rows:
├───┼───┼───┤          [0,1,2]  [3,4,5]  [6,7,8]
│ 3 │ 4 │ 5 │
├───┼───┼───┤          Columns:
│ 6 │ 7 │ 8 │          [0,3,6]  [1,4,7]  [2,5,8]
└───┴───┴───┘
                       Diagonals:
                       [0,4,8]  [2,4,6]

Algorithm:
  For each pattern [a, b, c]:
    if board[a] !== null AND
       board[a] === board[b] AND
       board[a] === board[c]
    then: WINNER FOUND
```

## Position Mapping

```
User View (1-9):        Internal (0-8):
┌───┬───┬───┐          ┌───┬───┬───┐
│ 1 │ 2 │ 3 │          │ 0 │ 1 │ 2 │
├───┼───┼───┤   ═══>   ├───┼───┼───┤
│ 4 │ 5 │ 6 │          │ 3 │ 4 │ 5 │
├───┼───┼───┤          ├───┼───┼───┤
│ 7 │ 8 │ 9 │          │ 6 │ 7 │ 8 │
└───┴───┴───┘          └───┴───┴───┘

Conversion: internal_pos = user_input - 1
```

## Module Dependencies

```
┌──────────────────┐
│   package.json   │
└────────┬─────────┘
         │
         ├─── commander@^11.1.0 (CLI framework)
         ├─── @types/node@^20.10.0 (TypeScript definitions)
         └─── typescript@^5.3.0 (Compiler)

┌──────────────────┐
│    index.ts      │  Entry point, CLI interface
└────────┬─────────┘
         │
         ├─── import { Command } from 'commander'
         ├─── import * as readline from 'readline'
         └─── import { TicTacToe } from './game'

┌──────────────────┐
│     game.ts      │  Core game logic (no external deps)
└──────────────────┘
```

## Build Pipeline

```
┌──────────────┐
│   src/*.ts   │  TypeScript source files
└──────┬───────┘
       │
       ▼
┌──────────────┐
│     tsc      │  TypeScript compiler
└──────┬───────┘  (tsconfig.json: target=ES2020, module=commonjs)
       │
       ▼
┌──────────────┐
│  dist/*.js   │  Compiled JavaScript
└──────┬───────┘
       │
       ▼
┌──────────────┐
│  node dist/  │  Node.js execution
│   index.js   │
└──────────────┘
```

## Key Design Principles

```
┌────────────────────────────────────────────────────────┐
│  SEPARATION OF CONCERNS                                │
├────────────────────────────────────────────────────────┤
│  • Game logic NEVER does I/O                           │
│  • CLI NEVER implements game rules                     │
│  • Each layer has single responsibility                │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  IMMUTABILITY                                          │
├────────────────────────────────────────────────────────┤
│  • getBoard() returns copy, not reference              │
│  • Prevents external mutation of game state            │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  VALIDATION LAYERS                                     │
├────────────────────────────────────────────────────────┤
│  1. CLI validates numeric input (1-9)                  │
│  2. Game validates position availability               │
│  3. Game validates game-over state                     │
└────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────┐
│  TESTABILITY                                           │
├────────────────────────────────────────────────────────┤
│  • TicTacToe class can be tested in isolation          │
│  • No console.log in game logic                        │
│  • Pure functions for win checking                     │
└────────────────────────────────────────────────────────┘
```

## Extension Points

```
Current Architecture:
┌─────────┐
│   CLI   │
└────┬────┘
     │
     ▼
┌─────────┐
│  Game   │
└─────────┘

Potential Expansions:

1. Multiple Interfaces:
┌─────┐  ┌─────┐  ┌─────┐
│ CLI │  │ Web │  │ GUI │
└──┬──┘  └──┬──┘  └──┬──┘
   └────────┼────────┘
            ▼
       ┌─────────┐
       │  Game   │
       └─────────┘

2. AI Players:
┌─────────┐
│   CLI   │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Player Interface│
├─────────────────┤
│ • Human         │
│ • AI (Minimax)  │
│ • AI (Random)   │
└────┬────────────┘
     │
     ▼
┌─────────┐
│  Game   │
└─────────┘

3. Game Variants:
┌─────────┐
│   CLI   │
└────┬────┘
     │
     ▼
┌─────────────────┐
│ Game Interface  │
├─────────────────┤
│ • TicTacToe     │
│ • ConnectFour   │
│ • Gomoku        │
└─────────────────┘
```

## Critical Implementation Details

### Move Validation
```typescript
makeMove(position: number): boolean {
  // 1. Range check (0-8)
  if (position < 0 || position > 8) return false;

  // 2. Game state check
  if (this.gameOver) return false;

  // 3. Position availability check
  if (this.board[position] !== null) return false;

  // 4. Apply move
  this.board[position] = this.currentPlayer;

  // 5. Check end conditions
  if (checkWinner()) {
    this.gameOver = true;
    this.winner = this.currentPlayer;
  } else if (board full) {
    this.gameOver = true;
  } else {
    this.currentPlayer = toggle;
  }

  return true;
}
```

### Display Logic
```typescript
displayBoard(): string {
  // Maps each cell:
  // • If occupied (X/O): show player mark
  // • If empty (null): show position number (1-9)

  Example outputs:

  Start:            Mid-game:         End:
   1 | 2 | 3         X | 2 | O         X | X | O
  -----------       -----------       -----------
   4 | 5 | 6         4 | X | 6         O | X | 6
  -----------       -----------       -----------
   7 | 8 | 9         7 | 8 | O         X | O | X
}
```

## File Structure
```
project/
├── src/
│   ├── game.ts         # Core game logic (89 lines)
│   └── index.ts        # CLI interface (79 lines)
├── dist/               # Compiled output (generated)
├── package.json        # Dependencies & scripts
├── tsconfig.json       # TypeScript config
├── CLAUDE.md           # Development guidance
└── README.md           # User documentation
```
