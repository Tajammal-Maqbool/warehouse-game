import Phaser from "phaser";

export default class IconButton extends Phaser.GameObjects.Container {
    constructor(scene, x, y, key, keyOnDown, keyOnHover, icon, callback, checkOpenModal = true, scale = 1) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.key = key;
        this.keyOnDown = keyOnDown;
        this.keyOnHover = keyOnHover;
        this.checkOpenModal = checkOpenModal;
        this.isEnabled = true;

        this.button = this.scene.add.nineslice(0, 0, this.key, 0, 40 * scale, 40 * scale, 10, 10, 10, 10);
        this.button.setInteractive();
        this.icon = this.scene.add.image(2, 2, icon).setDisplaySize(20 * scale, 20 * scale).setSize(20 * scale, 20 * scale);
        Phaser.Display.Align.In.Center(this.icon, this.button);
        this.icon.setX(this.icon.x + 1 * scale);
        this.icon.setY(this.icon.y + 2 * scale);
        this.add(this.button);
        this.add(this.icon);

        this.button.on("pointerdown", () => {
            if (this.scene.isModalOpen && this.checkOpenModal) {
                return;
            }
            if (!this.isEnabled) return;

            this.button.setTexture(this.keyOnDown);
            if (callback) {
                callback();
            }
        });

        this.button.on("pointerover", () => {
            if (this.scene.isModalOpen && this.checkOpenModal) {
                return;
            }
            if (!this.isEnabled) return;

            this.button.setTexture(this.keyOnHover);
            this.scene.game.canvas.style.cursor = "pointer";
        });

        this.button.on("pointerout", () => {
            if (!this.isEnabled) return;

            this.button.setTexture(this.key);
            this.scene.game.canvas.style.cursor = "default";
        });
    }
}
