import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChessService {

  private socket: Socket;


  constructor() {

    this.socket = io(
      'http://localhost:3000'
    );

  }


  createRoom(
    roomId: string
  ): void {

    this.socket.emit(
      'createRoom',
      roomId
    );

  }


  joinRoom(
    roomId: string
  ): void {

    this.socket.emit(
      'joinRoom',
      roomId
    );

  }


  makeMove(
    roomId: string,
    from: any,
    to: any
  ): void {

    this.socket.emit(
      'move',
      {
        roomId,
        from,
        to
      }
    );

  }


  resetGame(
    roomId: string
  ): void {

    this.socket.emit(
      'resetGame',
      roomId
    );

  }


  roomCreated(): Observable<any> {

    return new Observable(
      observer => {

        this.socket.on(
          'roomCreated',
          data => {
            observer.next(data);
          }
        );

      }
    );

  }


  roomJoined(): Observable<any> {

    return new Observable(
      observer => {

        this.socket.on(
          'roomJoined',
          data => {
            observer.next(data);
          }
        );

      }
    );

  }


  gameStarted(): Observable<any> {

    return new Observable(
      observer => {

        this.socket.on(
          'gameStarted',
          data => {
            observer.next(data);
          }
        );

      }
    );

  }


  boardUpdated(): Observable<any> {

    return new Observable(
      observer => {

        this.socket.on(
          'boardUpdated',
          data => {
            observer.next(data);
          }
        );

      }
    );

  }


  gameReset(): Observable<any> {

    return new Observable(
      observer => {

        this.socket.on(
          'gameReset',
          data => {
            observer.next(data);
          }
        );

      }
    );

  }


  errorMessage(): Observable<string> {

    return new Observable(
      observer => {

        this.socket.on(
          'errorMessage',
          message => {
            observer.next(message);
          }
        );

      }
    );

  }


  playerDisconnected(): Observable<any> {

    return new Observable(
      observer => {

        this.socket.on(
          'playerDisconnected',
          data => {
            observer.next(data);
          }
        );

      }
    );

  }

}