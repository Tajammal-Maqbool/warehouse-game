import Phaser from "phaser";
import Button from "./Button";
import WindowPanel from "./WindowPanel";


export default class GameOverModal extends Phaser.GameObjects.Container {
    constructor(scene, titleStr, textStr) {
        super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(100);

        this.bg = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0.5);
        this.add(this.bg);

        let windowPanel = new WindowPanel(this.scene, -200, -150, 400, 300);
        this.add(windowPanel);

        let title = this.scene.add.text(0, -130, titleStr.toUpperCase(), {
            font: "bold 42px VT323",
            fill: "#b3984f",
            align: "center"
        }).setLetterSpacing(1).setWordWrapWidth(320).setOrigin(0.5, 0);
        this.add(title);
        let text = this.scene.add.text(0, -80, textStr, {
            font: "normal 22px VT323",
            fill: "#fff",
            align: "center",
            wordWrap: {
                width: 350,
                useAdvancedWrap: true
            }
        }).setLetterSpacing(1).setOrigin(0.5, 0);
        windowPanel.setSize(400, text.height + 130);
        this.add(text);

        this.restartBtn = new Button(this.scene, 0, text.y + text.height + 25, "goldBtn", "goldBtnDown", "goldBtnHover", "Restart", () => {
            this.scene.scene.restart();
        }, false);
        this.add(this.restartBtn);
    }
}