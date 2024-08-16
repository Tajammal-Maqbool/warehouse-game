import Phaser from "phaser";
import Button from "./Button";
import WindowPanel from "./WindowPanel";


export default class TutorialStep extends Phaser.GameObjects.Container {
    constructor(scene, x, y, maskConfig = null, titleStr, textStr, btn1Str, btn2Str, callback1, callback2) {
        super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(100);

        this.bg = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0.5);
        this.add(this.bg);

        if (maskConfig !== null) {
            let graphics = this.scene.make.graphics({
                x: 0,
                y: 0,
                add: false,
            });

            graphics.fillStyle(0xffffff);
            graphics.fillRect(maskConfig.x, maskConfig.y, maskConfig.width, maskConfig.height);

            if (maskConfig.mask2) {
                graphics.fillRect(maskConfig.x2, maskConfig.y2, maskConfig.width2, maskConfig.height2);
            }

            let mask = graphics.createGeometryMask();
            mask.invertAlpha = true;
            this.bg.setMask(mask);
        }

        this.windowPanel = new WindowPanel(this.scene, x, y, 300, 400, titleStr, 32);
        this.add(this.windowPanel);

        this.text = this.scene.add.text(150, 25, textStr, {
            font: "normal 22px VT323",
            fill: "#fff",
            align: "center",
            wordWrap: {
                width: 250,
                useAdvancedWrap: true
            }
        }).setLetterSpacing(1).setOrigin(0.5, 0);
        this.windowPanel.setSize(300, this.text.height + 80);
        this.windowPanel.add(this.text);

        if (btn1Str !== null) {
            this.actionButton1 = new Button(this.scene, btn2Str === null ? 150 : 110, this.text.height + 50, "goldBtnOutlined", "goldBtnOutlinedDown", "goldBtnOutlinedHover", btn1Str.toUpperCase(), () => {
                this.destroy();
                callback1();
            }, false);
            this.windowPanel.add(this.actionButton1);
        }

        if (btn2Str !== null) {
            this.actionButton2 = new Button(this.scene, btn1Str === null ? 150 : 190, this.text.height + 50, "greenBtn", "greenBtnDown", "greenBtnHover", btn2Str.toUpperCase(), () => {
                this.destroy();
                callback2();
            }, false);
            this.windowPanel.add(this.actionButton2);
        }
    }
}