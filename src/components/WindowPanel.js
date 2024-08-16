import Phaser from "phaser";


export default class WindowPanel extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, title = null, fontSize = 22) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.window = this.scene.add.nineslice(0, 0, "window", 0, width, height, 10, 10, 10, 10).setOrigin(0).setTint(0x304557);
        this.windowStroke = this.scene.add.nineslice(0, 0, "windowStroke", 0, width, height, 10, 10, 10, 10).setOrigin(0);
        this.cornersGold = this.scene.add.nineslice(0, 0, "cornersGold", 0, width, height, 16, 16, 16, 16).setOrigin(0);
        this.add([this.window, this.windowStroke, this.cornersGold]);

        if (title !== null) {
            this.titleBg = this.scene.add.nineslice(0, 0, "titleBarGoldBig", 0, width / 2, 30, 10, 10, 10, 10).setOrigin(0.5, 0);
            this.titleText = this.scene.add.text(width / 2, -6.5, title.toUpperCase(), {
                font: `bold ${fontSize}px BitCell`,
                fill: "#2E2511"
            }).setOrigin(0.5, 0);
            this.titleBg.setPosition(this.titleText.x, -12);
            this.titleBg.setSize(this.titleText.width + 40, this.titleText.height + 10);
            this.add([this.titleBg, this.titleText]);
        }
    }
    setSize(width, height) {
        this.window.setSize(width, height);
        this.windowStroke.setSize(width, height);
        this.cornersGold.setSize(width, height);
    }
    getSize() {
        return {
            width: this.window.width,
            height: this.window.height
        };
    }
}