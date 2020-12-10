import {Component, OnInit} from '@angular/core';
import {Player, PlayerService} from '../player.service';
import {ActivatedRoute} from '@angular/router';

export interface Transaction {
  stealingFrom: Player;
  gaining: Player;
}

@Component({
  selector: 'app-adapt-points',
  templateUrl: './adapt-points.component.html',
  styleUrls: ['./adapt-points.component.css']
})
export class AdaptPointsComponent implements OnInit {
  transactions: Array<Transaction> = [];
  selectedPlayer: Player;
  currentPoints: number;
  tuttoList: Array<number> = [];
  playersList: Array<Player> = []; // this list is used to steal points.
  stealingFrom: Player;
  id: number;
  modal: any;

  constructor(private playerService: PlayerService, private activatedRoute: ActivatedRoute) {
    // loads id from URL.
    this.id = Number(activatedRoute.snapshot.paramMap.get('playerId')); // TODO: check if it actually is a number
    this.currentPoints = 0;
    this.selectedPlayer = {name: '-', score: 0};
    this.stealingFrom = {name: '-', score: 0};
  }

  ngOnInit() {
    this.playerService.getById(this.id).then((playerFromDb) => { // load user with the provided id. is guaranteed to exist.
      this.selectedPlayer = playerFromDb;
    });
  }

  onIncreasePoints(points: number) {
    this.currentPoints += points;
  }

  onTutto() {
    if (this.currentPoints !== 0) {
      this.tuttoList.push(this.currentPoints);
      this.currentPoints = 0;
    }
  }

  onAdd() {
    let score = this.selectedPlayer.score + this.currentPoints;
    if (this.tuttoList.length !== 0) {
      score += this.tuttoList.reduce(function (a, b) { return a + b; });
    }
    this.playerService.update(this.id, {score})
      .then(() => {
        this.selectedPlayer.score = score;
        this.tuttoList = [];
        this.currentPoints = 0;
      });
    this.finishTransactions(); // finish potential open stealing transactions.
  }

  onDoubleScore() {
    this.currentPoints *= 2;
  }

  onReset() {
    this.currentPoints = 0;
  }

  onCancel() {
    this.tuttoList = [];
    this.currentPoints = 0;
    this.transactions = [];
  }

  onSteal() {
    this.loadPlayers();
    this.loadModal();
  }

  loadPlayers() {
    this.playerService.getAll().then((players: Array<Player>) => { // load all players and delete the current from the list
      this.playersList = players;
      this.filterPlayersList();
    });
  }

  // Filter players to steal from such that no player with score 0 or the player itself gets display
  filterPlayersList() {
    let index = this.playersList.findIndex(player => player.id === this.id); // remove own id
    this.playersList.splice(index, 1);
    // remove all players with score = 0
    index = this.playersList.findIndex(player => player.score === 0);
    while (index !== -1) {
      this.playersList.splice(index, 1);
      index = this.playersList.findIndex(player => player.score === 0);
    }
  }

  loadModal() {
    // @ts-ignore
    this.modal = M.Modal.init(document.querySelectorAll('.modal'));
  }

  stealPoints(stealingFrom: Player) {
    this.stealingFrom = stealingFrom;
  }

  onModalConfirm() {
    // TODO: if currentPlayer has the most points, can't steal points.
    if (this.stealingFrom.score > 0) { // no points means, you can't steal or no player is selected
      const transaction = { // add new transaction to array, such that it can get added after "On Add" Button event
        stealingFrom: this.stealingFrom,
        gaining: this.selectedPlayer
      };
      this.transactions.push(transaction);
      this.tuttoList.push(1000); // display '+ 1000' on app
    }
  }

  finishTransactions() {
    for (const tran of this.transactions) {
      let score = tran.gaining.score + 1000; // add points for winning player
      this.playerService.update(tran.gaining.id, {score}).then();
      score = tran.stealingFrom.score - 1000;
      this.playerService.update(tran.stealingFrom.id, {score}).then(); // decrease 1000 from player.
    }
    this.transactions = []; // empty transaction list
  }
}
