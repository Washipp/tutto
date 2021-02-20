import { Injectable } from '@angular/core';
import Dexie from 'dexie';

export interface Player {
  id?: number;
  name: string;
  score: number;
}


@Injectable({
  providedIn: 'root'
})
export class PlayerService extends Dexie {
  players: Dexie.Table<Player, number>;

  constructor() {
    super('tutto');
    this.version(1).stores({ // id is auto incremented and name is unique.
      players: '++id, name, score'
    });
    this.players = this.table('players');
  }

  getAll() {
    return this.players.toArray();
  }

  getById(id) {
    return this.players.get(id);
  }

  add(data) {
    return this.players.add(data);
  }

  update(id, data) {
    return this.players.update(id, data);
  }

  remove(id) {
    return this.players.delete(id);
  }

  dropTable() {
    return this.players.clear();
  }

  resetPoints() {
    return this.players.where('score').above(0).modify({'score': 0});
  }

}
