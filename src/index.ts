#!/usr/bin/env node

import { Command } from 'commander';
import * as readline from 'readline';
import { TicTacToe } from './game';

const program = new Command();

program
  .name('tictactoe')
  .description('CLI-based Tic Tac Toe game')
  .version('1.0.0');

program
  .command('play')
  .description('Start a new game of Tic Tac Toe')
  .action(async () => {
    await playGame();
  });

program.parse();

async function playGame(): Promise<void> {
  const game = new TicTacToe();
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('\n=== Tic Tac Toe ===\n');
  console.log('Enter a number (1-9) to place your mark:\n');
  console.log(game.displayBoard());

  const askForMove = (): Promise<void> => {
    return new Promise((resolve) => {
      rl.question(`Player ${game.getCurrentPlayer()}'s turn (1-9): `, (answer) => {
        const position = parseInt(answer) - 1;

        if (isNaN(position) || position < 0 || position > 8) {
          console.log('\nInvalid input! Please enter a number between 1 and 9.\n');
          resolve();
          return;
        }

        if (!game.makeMove(position)) {
          console.log('\nInvalid move! That position is already taken.\n');
          resolve();
          return;
        }

        console.clear();
        console.log('\n=== Tic Tac Toe ===\n');
        console.log(game.displayBoard());

        if (game.isGameOver()) {
          if (game.getWinner()) {
            console.log(`\n🎉 Player ${game.getWinner()} wins!\n`);
          } else if (game.isDraw()) {
            console.log('\n🤝 It\'s a draw!\n');
          }
          rl.close();
          return;
        }

        resolve();
      });
    });
  };

  while (!game.isGameOver()) {
    await askForMove();
  }
}

// If no command is provided, default to play
if (process.argv.length === 2) {
  playGame();
}
