import Phaser from "phaser";
import Button from "./Button";
import WindowPanel from "./WindowPanel";


export default class WelcomeModal extends Phaser.GameObjects.Container {
    constructor(scene, callback) {
        super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(100);

        this.bg = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0.5);
        this.add(this.bg);

        this.windowPanel = new WindowPanel(this.scene, -300, -100, 600, 200);
        this.add(this.windowPanel);

        this.title = this.scene.add.text(0, -90, "WAREHOUSE", {
            font: "bold 64px VT323",
            fill: "#fff",
            align: "center"
        }).setLetterSpacing(1).setOrigin(0.5, 0);
        this.add(this.title);

        this.text = this.scene.add.text(-270, -20, "Welcome to the Warehouse! This is a game where you manage a warehouse and try to get the lowest score possible. The lower your score, the better you've done! Click the play button to start the game.", {
            font: "normal 22px VT323",
            fill: "#fff",
            align: "center",
            wordWrap: {
                width: 510,
                useAdvancedWrap: true
            }
        }).setLetterSpacing(1);
        this.windowPanel.setSize(600, this.text.height + 150);
        this.add(this.text);

        this.playButton = new Button(this.scene, 0, 105, "greenBtn", "greenBtnDown", "greenBtnHover", "PLAY", () => {
            this.destroy();
            callback();
        }, false);
        this.add(this.playButton);
    }
}