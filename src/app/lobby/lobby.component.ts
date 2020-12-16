import { Component, OnInit } from '@angular/core';
import { Player, PlayerService } from '../player.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements OnInit {

  title = 'tutto';
  newPlayerName: string;
  playersList: Array<Player> = [];

  ngOnInit() {
    this.playerService.getAll().then((players: Array<Player>) => { // load all players.
      this.playersList = players;
    });
  }

  constructor(private playerService: PlayerService) {}

  onAddPlayer() {
    const name = (this.newPlayerName === undefined || this.newPlayerName === '') ? 'SP ' + this.playersList.length : this.newPlayerName;
    const player: Player = {
      name,
      score: 0,
    };
    this.playerService.add(player)
      .then((id) => {
        this.playersList = [...this.playersList, Object.assign({}, player, {id})]; // add new player to list.
      });
    this.newPlayerName = '';
  }

  onDeletePlayer(id: number) {
    if (confirm('Diesen Spieler entfernen?')) {
      this.playerService
        .remove(id)
        .then(() => {
          this.playersList = this.playersList.filter((player) => player.id !== id);
        });
    }
  }

  createNewGame () {
    if (confirm('Alle Spieler und Punkte löschen?')) {
      this.playerService.dropTable().
      then(() => {
        this.playersList = [];
      });
    }
  }

}
