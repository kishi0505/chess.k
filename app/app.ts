import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChessService } from './service/chess.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  roomId: string = '';

  myColor: string = '';

  gameStarted: boolean = false;

  turn: string = 'white';

  message: string = 'Create a room or join a room';

  board: string[][] = [];

  selected: {
    row: number;
    col: number;
  } | null = null;


  constructor(
    private chessService: ChessService
  ) {}


  ngOnInit(): void {

    // ROOM CREATED

    this.chessService.roomCreated()
      .subscribe((data: any) => {

        this.roomId = data.roomId;

        this.myColor = data.color;

        this.board = data.board;

        this.message =
          'Room created. Waiting for opponent...';

      });


    // ROOM JOINED

    this.chessService.roomJoined()
      .subscribe((data: any) => {

        this.roomId = data.roomId;

        this.myColor = data.color;

        this.board = data.board;

        this.message =
          'Joined room. Waiting for opponent...';

      });


    // GAME STARTED

    this.chessService.gameStarted()
      .subscribe((data: any) => {

        this.board = data.board;

        this.turn = data.turn;

        this.gameStarted = true;

        this.message = 'Game started!';

      });


    // BOARD UPDATED

    this.chessService.boardUpdated()
      .subscribe((data: any) => {

        this.board = data.board;

        this.turn = data.turn;

        this.selected = null;

        if (this.turn === this.myColor) {

          this.message = 'Your turn';

        } else {

          this.message = "Opponent's turn";

        }

      });


    // GAME RESET

    this.chessService.gameReset()
      .subscribe((data: any) => {

        this.board = data.board;

        this.turn = data.turn;

        this.selected = null;

        this.gameStarted = true;

        this.message = 'New game started!';

      });


    // SERVER ERROR

    this.chessService.errorMessage()
      .subscribe((message: string) => {

        this.message = message;

      });


    // PLAYER DISCONNECTED

    this.chessService.playerDisconnected()
      .subscribe(() => {

        this.gameStarted = false;

        this.message =
          'Opponent disconnected';

      });

  }


  // =========================================
  // CREATE ROOM
  // =========================================

  createRoom(): void {

    const id =
      Math.random()
        .toString(36)
        .substring(2, 8)
        .toUpperCase();

    this.chessService.createRoom(id);

  }


  // =========================================
  // JOIN ROOM
  // =========================================

  joinRoom(): void {

    const id =
      this.roomId
        .trim()
        .toUpperCase();

    if (!id) {

      this.message =
        'Please enter Room ID';

      return;

    }

    this.chessService.joinRoom(id);

  }


  // =========================================
  // CLICK CHESS SQUARE
  // =========================================

  clickSquare(
    row: number,
    col: number
  ): void {

    if (!this.gameStarted) {

      this.message =
        'Game has not started';

      return;

    }


    // CHECK TURN

    if (this.turn !== this.myColor) {

      this.message =
        "It's opponent's turn";

      return;

    }


    const piece =
      this.board[row][col];


    // FIRST CLICK

    if (!this.selected) {

      if (!piece) {

        return;

      }


      // WHITE PLAYER

      if (
        this.myColor === 'white' &&
        !this.isWhitePiece(piece)
      ) {

        this.message =
          'You are playing White';

        return;

      }


      // BLACK PLAYER

      if (
        this.myColor === 'black' &&
        !this.isBlackPiece(piece)
      ) {

        this.message =
          'You are playing Black';

        return;

      }


      this.selected = {
        row,
        col
      };

      this.message =
        'Select destination';

      return;

    }


    // SAME SQUARE

    if (
      this.selected.row === row &&
      this.selected.col === col
    ) {

      this.selected = null;

      this.message =
        'Selection cancelled';

      return;

    }


    // SEND MOVE

    this.chessService.makeMove(
      this.roomId,
      this.selected,
      {
        row,
        col
      }
    );

    this.selected = null;

  }


  // =========================================
  // RESET GAME
  // =========================================

  resetGame(): void {

    if (!this.roomId) {

      return;

    }

    this.chessService.resetGame(
      this.roomId
    );

  }


  // =========================================
  // SELECTED SQUARE
  // =========================================

  isSelected(
    row: number,
    col: number
  ): boolean {

    return (
      this.selected?.row === row &&
      this.selected?.col === col
    );

  }


  // =========================================
  // WHITE PIECE
  // =========================================

  isWhitePiece(
    piece: string
  ): boolean {

    return [
      '♙',
      '♖',
      '♘',
      '♗',
      '♕',
      '♔'
    ].includes(piece);

  }


  // =========================================
  // BLACK PIECE
  // =========================================

  isBlackPiece(
    piece: string
  ): boolean {

    return [
      '♟',
      '♜',
      '♞',
      '♝',
      '♛',
      '♚'
    ].includes(piece);

  }


  // =========================================
  // PIECE CLASS
  // =========================================

  getPieceClass(
    piece: string
  ): string {

    if (this.isWhitePiece(piece)) {

      return 'white-piece';

    }

    if (this.isBlackPiece(piece)) {

      return 'black-piece';

    }

    return '';

  }

}