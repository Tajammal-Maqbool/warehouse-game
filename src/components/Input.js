import Phaser from "phaser";


export default class Input extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, type, textStr) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.bg = this.scene.add.graphics();
        this.bg.fillStyle(0xffffff, 1);
        this.bg.fillRoundedRect(0, 0, width, height, 10);
        this.add(this.bg);

        this.input = this.scene.add.dom(width / 2, height / 2, "input", {
            width: width + "px",
            height: height + "px",
            fontSize: "18px",
            padding: "10px",
            color: "#2E2511",
            fontFamily: 'VT323',
            backgroundColor: "transparent",
            border: "none",
            outline: "none"
        }).setOrigin(0.5);
        this.input.node.setAttribute("type", type);
        this.input.node.setAttribute("placeholder", textStr);
        this.add(this.input);
    }
}