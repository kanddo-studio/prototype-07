import Phaser from "phaser";

import { Entity } from "kanji-ecs/core";

import {
  PositionComponent,
  VelocityComponent,
  InputComponent,
} from "kanji-ecs/components";

import { MovementSystem } from "../systems/MovementSystem";
import { KeyboardSystem } from "../systems/KeyboardSystem";

import * as Utils from "../utils";
import { PhysicsComponent } from "../components/PhysicsComponent";
import { PhysicsSystem } from "../systems/PhysicsSystem";

export class GameScene extends Phaser.Scene {
  player!: Entity;
  movementSystem!: MovementSystem;
  keyboardSystem!: KeyboardSystem;
  physicsSystem!: PhysicsSystem;

  constructor() {
    super("game-scene");
  }

  preload() {
    this.load.spritesheet("player", "assets/images/game/player/idle.png", {
      frameWidth: 80,
      frameHeight: 80,
    });
  }

  create() {
    // World Building
    const worldSize = 400;
    this.physics.world.setBounds(0, 0, worldSize, worldSize);
    Utils.createGrid(this, worldSize);

    // Physics Sprites
    const sprite = this.physics.add.sprite(0, 0, "player", 0);
    sprite.setScale(4);

    sprite.body.setSize(16, 16);
    sprite.body.setOffset(32, 32);

    this.anims.create({
      key: "idle",
      frames: this.anims.generateFrameNumbers("player", { start: 0, end: 3 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-down",
      frames: this.anims.generateFrameNumbers("player", { start: 4, end: 7 }),
      frameRate: 8,
      repeat: -1,
    });

    this.anims.create({
      key: "idle-up",
      frames: this.anims.generateFrameNumbers("player", { start: 8, end: 11 }),
      frameRate: 8,
      repeat: -1,
    });

    sprite.anims.play("idle");

    // Entities
    this.player = new Entity();

    // Components
    const positionComponent = new PositionComponent(200, 200);
    const velocityComponent = new VelocityComponent(400);
    const inputComponent = new InputComponent();
    const physicsComponent = new PhysicsComponent(
      sprite,
      positionComponent.x,
      positionComponent.y,
    );

    // Add Components to Player
    this.player.add("velocity", velocityComponent);
    this.player.add("position", positionComponent);
    this.player.add("input", inputComponent);
    this.player.add("physics", physicsComponent);

    // Systems
    this.movementSystem = new MovementSystem();
    this.keyboardSystem = new KeyboardSystem(this);
    this.physicsSystem = new PhysicsSystem();
  }

  update(_time: number) {
    this.movementSystem.update([this.player]);
    this.keyboardSystem.update([this.player]);
    this.physicsSystem.update([this.player]);
  }
}
