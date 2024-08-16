import Phaser from "phaser";


export default class Panel extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, width, height, topBevel = null, bottomBevel = null) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.panel = this.scene.add.nineslice(0, 0, key, 0, width, height, 2, 2, 2, 2).setOrigin(0).setTint(0x202C3D);
        this.add(this.panel);

        if (topBevel !== null) {
            this.topBevel = this.scene.add.nineslice(0, 0, topBevel, 0, width, height, 2, 2, 2, 2).setOrigin(0).setTint(0x000000);
            this.add(this.topBevel);
        }
        if (bottomBevel !== null) {
            this.bottomBevel = this.scene.add.nineslice(0, 0, bottomBevel, 0, width, height, 2, 2, 2, 2).setOrigin(0).setTint(0x000000);
            this.add(this.bottomBevel);
        }
    }
    setSize(width, height) {
        this.panel.setSize(width, height);
        if (this.topBevel) {
            this.topBevel.setSize(width, height);
        }
        if (this.bottomBevel) {
            this.bottomBevel.setSize(width, height);
        }
    }
    changeTint(color1 = 0x202C3D, color2 = 0x000000, color3 = 0x00000) {
        if (color1 === null) color1 = 0x202C3D;
        if (color2 === null) color2 = 0x000000;
        if (color3 === null) color3 = 0x000000;

        this.panel.setTint(color1);
        if (this.topBevel) {
            this.topBevel.setTint(color2);
        }
        if (this.bottomBevel) {
            this.bottomBevel.setTint(color3);
        }
    }
}