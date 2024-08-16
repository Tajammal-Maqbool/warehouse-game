import Phaser from "phaser";


export default class Button extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, keyOnDown, keyOnHover, text, callback, checkOpenModal = true) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.key = key;
        this.keyOnDown = keyOnDown;
        this.keyOnHover = keyOnHover;
        this.checkOpenModal = checkOpenModal;

        this.button = this.scene.add.nineslice(0, 0, this.key, 0, 200, 40, 10, 10, 10, 10);
        this.button.setInteractive();
        this.text = this.scene.add.text(0, 0, text.toUpperCase(), {
            font: "20px VT323",
            fill: "#fff"
        });
        Phaser.Display.Align.In.Center(this.text, this.button);
        this.button.setSize(this.text.width + 30, this.text.height + 10);
        this.add(this.button);
        this.add(this.text);

        this.button.on("pointerdown", () => {
            if (this.scene.isModalOpen && this.checkOpenModal) {
                return;
            }

            this.button.setTexture(this.keyOnDown);
            if (callback) {
                callback();
            }
        });
        this.button.on("pointerover", () => {
            if (this.scene.isModalOpen && this.checkOpenModal) {
                return;
            }
            this.button.setTexture(this.keyOnHover);
            this.scene.game.canvas.style.cursor = "pointer";
        });
        this.button.on("pointerout", () => {
            this.button.setTexture(this.key);
            this.scene.game.canvas.style.cursor = "default";
        });
    }
}