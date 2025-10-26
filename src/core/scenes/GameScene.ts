import Phaser from "phaser";

import { Entity } from "kanji-ecs/core";

import { MovementSystem } from "../systems/MovementSystem";
import { KeyboardSystem } from "../systems/KeyboardSystem";

import * as Utils from "../utils";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { AnimationSystem } from "../systems/AnimationSystem";
import { PlayerFactory } from "../factories/Player/PlayerFactory";

export class GameScene extends Phaser.Scene {
  player!: Entity;
  movementSystem!: MovementSystem;
  keyboardSystem!: KeyboardSystem;
  physicsSystem!: PhysicsSystem;
  animationSystem!: AnimationSystem;

  constructor() {
    super("game-scene");
  }

  preload() {
    PlayerFactory.preload(this);
  }

  create() {
    // World Building
    const worldSize = 800;
    this.physics.world.setBounds(0, 0, worldSize, worldSize);
    Utils.createGrid(this, worldSize);

    // Entities
    this.player = PlayerFactory.create(this);

    // Systems
    this.keyboardSystem = new KeyboardSystem(this);
    this.movementSystem = new MovementSystem();
    this.physicsSystem = new PhysicsSystem();
    this.animationSystem = new AnimationSystem();
  }

  update(_time: number) {
    this.keyboardSystem.update([this.player]);
    this.movementSystem.update([this.player]);
    this.physicsSystem.update([this.player]);
    this.animationSystem.update([this.player]);
  }
}
