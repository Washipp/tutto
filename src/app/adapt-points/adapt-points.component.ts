import { Component, OnInit } from '@angular/core';
import {Player, PlayerService} from '../player.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-adapt-points',
  templateUrl: './adapt-points.component.html',
  styleUrls: ['./adapt-points.component.css']
})
export class AdaptPointsComponent implements OnInit {

  selectedPlayer: Player;
  totalPoints: number;
  id: number;

  constructor(private playerService: PlayerService, private activatedRoute: ActivatedRoute) {
    this.id = Number(activatedRoute.snapshot.paramMap.get('playerId')); // TODO: check if it actually is a number
    this.totalPoints = 0;
    this.selectedPlayer = {name: '-', score: 0};
  }

  ngOnInit() {
    this.playerService.getById(this.id).then((playerFromDb) => { // load user with the provided id. is guaranteed to exist.
      this.selectedPlayer = playerFromDb;
    });
  }

  onIncreasePoints(points: number) {
    this.totalPoints += points;
  }

  onAdd() {
    this.playerService.getById(this.id)
      .then((playerFromDb) => { // load player from db
        const score = this.totalPoints + playerFromDb.score;
        this.playerService.update(this.id, {score})
          .then(() => {
            this.selectedPlayer.score = score;
            this.totalPoints = 0;
          });
      });
  }

  onDoubleScore() {
    this.totalPoints *= 2;
  }

  onCancel() {
    this.totalPoints = 0;
  }
}
