export type Player = 'X' | 'O';
export type Cell = Player | null;
export type Board = Cell[];

export class TicTacToe {
  private board: Board;
  private currentPlayer: Player;
  private gameOver: boolean;
  private winner: Player | null;

  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameOver = false;
    this.winner = null;
  }

  getBoard(): Board {
    return [...this.board];
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  isGameOver(): boolean {
    return this.gameOver;
  }

  getWinner(): Player | null {
    return this.winner;
  }

  isDraw(): boolean {
    return this.gameOver && this.winner === null;
  }

  makeMove(position: number): boolean {
    if (position < 0 || position > 8) {
      return false;
    }

    if (this.gameOver || this.board[position] !== null) {
      return false;
    }

    this.board[position] = this.currentPlayer;

    if (this.checkWinner()) {
      this.gameOver = true;
      this.winner = this.currentPlayer;
    } else if (this.board.every(cell => cell !== null)) {
      this.gameOver = true;
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }

    return true;
  }

  private checkWinner(): boolean {
    const winPatterns = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    return winPatterns.some(pattern => {
      const [a, b, c] = pattern;
      return this.board[a] !== null &&
             this.board[a] === this.board[b] &&
             this.board[a] === this.board[c];
    });
  }

  displayBoard(): string {
    const display = this.board.map((cell, index) => {
      return cell || (index + 1).toString();
    });

    return `
 ${display[0]} | ${display[1]} | ${display[2]}
-----------
 ${display[3]} | ${display[4]} | ${display[5]}
-----------
 ${display[6]} | ${display[7]} | ${display[8]}
`;
  }
}
