import {Component, OnInit} from '@angular/core';
import {Player, PlayerService} from '../player.service';
import {ActivatedRoute, Router} from '@angular/router';

export interface Transaction {
  stealingFrom: Player[];
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
  id: number;
  currentMaxScore = 0;

  constructor(private playerService: PlayerService, private activatedRoute: ActivatedRoute, private router: Router) {
    // loads id from URL.
    this.id = Number(activatedRoute.snapshot.paramMap.get('playerId')); // TODO: check if it actually is a number
    this.currentPoints = 0;
    this.selectedPlayer = {name: '-', score: 0};
  }

  ngOnInit() {
    // load user with the provided id. is guaranteed to exist.
    this.playerService.getById(this.id).then((playerFromDb) => {
      this.selectedPlayer = playerFromDb!;
    });

    this.playerService.getAll().then(((players: Array<Player>) => {
      players.forEach((p: Player) => {
        this.currentMaxScore = p.score > this.currentMaxScore ? p.score : this.currentMaxScore;
      })
    }))
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
      score += this.tuttoList.reduce(function (a, b) {
        return a + b;
      }); // add all points together
    }
    this.finishTransactions(); // finish potential open stealing transactions.
    this.playerService.update(this.id, {score})
      .then(() => {
        this.selectedPlayer.score = score;
        this.tuttoList = [];
        this.currentPoints = 0;
      });
    this.returnToLobby()
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
    this.returnToLobby()
  }

  onSteal() {
    if (this.selectedPlayer.score === this.currentMaxScore) return;
    let max = 0;
    let stealFrom: Player[] = [];

    // Load all players with the maximum score
    this.playerService.getAll().then((players: Array<Player>) => {
      players.forEach((p: Player) => {
        max = p.score > max ? p.score : max;
      })

      players.forEach((p: Player) => {
        if (p.score === max)stealFrom.push(p);
      })
    });

    // Add new transaction to array. If the player aborts, the transaction will not be executed
    const transaction = {
      stealingFrom: stealFrom,
      gaining: this.selectedPlayer
    };
    this.transactions.push(transaction);

    this.tuttoList.push(1000); // display '+ 1000' on app
  }

  finishTransactions() {
    this.transactions.forEach((t: Transaction) => {
      let score = t.gaining.score + 1000; // add points for winning player
      this.playerService.update(t.gaining.id!, {score}).then();
      t.stealingFrom.forEach((p: Player) => {
        // TODO: Stealing twice after a row results in only deducting 1000 points from the player(s)
        score = p.score - 1000;
        this.playerService.update(p.id!, {score}).then(); // decrease 1000 from player.
      })

    })
    this.transactions = []; // empty transaction list
  }

  private returnToLobby() {
    this.router.navigate([`./lobby`]).then();
  }
}
