import Phaser from "phaser";
import IconButton from "./IconButton";
import WindowPanel from "./WindowPanel";


export default class Alert extends Phaser.GameObjects.Container {
    constructor(scene, titleStr, textStr, callback) {
        super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
        this.scene = scene;
        this.scene.add.existing(this);
        this.setDepth(100);

        this.bg = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0.5);
        this.add(this.bg);

        let windowPanel = new WindowPanel(this.scene, -300, -50, 600, 100);
        this.add(windowPanel);

        let title = this.scene.add.text(0, -40, titleStr.toUpperCase(), {
            font: "bold 42px VT323",
            fill: "#b3984f",
            align: "center"
        }).setLetterSpacing(1).setWordWrapWidth(320).setOrigin(0.5, 0);
        this.add(title);
        let text = this.scene.add.text(0, -40, textStr, {
            font: "normal 22px VT323",
            fill: "#fff",
            align: "center",
            wordWrap: {
                width: 320,
                useAdvancedWrap: true
            }
        }).setLetterSpacing(1).setOrigin(0.5, 0).setWordWrapWidth(320);
        this.add(text);

        let totalWidth = text.width + 80;
        let totalHeight = text.height + 90;
        windowPanel.setSize(totalWidth, totalHeight);
        windowPanel.x = -totalWidth / 2;
        windowPanel.y = -totalHeight / 2;
        title.y = -totalHeight / 2 + 20;
        text.y = -totalHeight / 2 + 70;

        this.backButton = new IconButton(this.scene, totalWidth / 2 - 10, -(totalHeight) / 2 + 10, "goldBtn", "goldBtnDown", "goldBtnHover", "x", () => {
            this.destroy();
            callback();
        }, false).setScale(0.8);
        this.add(this.backButton);
    }
}