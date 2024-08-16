import Phaser from "phaser";
import Button from "./Button";
import Input from "./Input";
import WindowPanel from "./WindowPanel";


export default class RegisterForm extends Phaser.GameObjects.Container {
    constructor(scene, callback) {
        super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(100);

        this.bg = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0.5);
        this.add(this.bg);

        this.windowPanel = new WindowPanel(this.scene, -200, -125, 400, 210, "Register!!!", 32);
        this.add(this.windowPanel);

        this.text = this.scene.add.text(0, -90, "Enter your username to register for leaderboard", {
            font: "normal 22px VT323",
            fill: "#fff",
            align: "center",
            wordWrap: {
                width: 360,
                useAdvancedWrap: true
            }
        }).setLetterSpacing(1).setOrigin(0.5, 0);
        this.add(this.text);

        this.usernameInput = new Input(this.scene, -180, -20, 355, 40, "text", "Username");
        this.add(this.usernameInput);

        this.registerButton = new Button(this.scene, 0, 50, "goldBtn", "goldBtnDown", "goldBtnHover", "Register", () => {
            callback(this.usernameInput.input.node.value);
        }, false);
        this.add(this.registerButton);
    }
}