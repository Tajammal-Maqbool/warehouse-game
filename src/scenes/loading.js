import Phaser from "phaser";

export default class Loading extends Phaser.Scene {
    constructor() {
        super({
            key: "Loading"
        });
    }

    preload() {
        // Load images directly from the public directory
        this.load.image("bg", "Images/BG.png");
        this.load.image("mask", "Images/Mask.png");
        this.load.image("item", "Images/Item.png");
        this.load.image("goldBtn", "Images/Buttons/Gold.png");
        this.load.image("goldBtnDown", "Images/Buttons/GoldDown.png");
        this.load.image("goldBtnHover", "Images/Buttons/GoldHover.png");
        this.load.image("goldBtnOutlined", "Images/Buttons/GoldOutlined.png");
        this.load.image("goldBtnOutlinedDown", "Images/Buttons/GoldOutlinedDown.png");
        this.load.image("goldBtnOutlinedHover", "Images/Buttons/GoldOutlinedHover.png");
        this.load.image("greenBtn", "Images/Buttons/Green.png");
        this.load.image("greenBtnDown", "Images/Buttons/GreenDown.png");
        this.load.image("greenBtnHover", "Images/Buttons/GreenHover.png");
        this.load.image("window", "Images/Panels/Window.png");
        this.load.image("windowStroke", "Images/Panels/WindowStroke.png");
        this.load.image("cornersGold", "Images/Panels/CornersGold2.png");
        this.load.image("titleBarGoldBig", "Images/Panels/TitleBarGoldBig.png");
        this.load.image("universalPanel1", "Images/Panels/UniversalPanel1.png");
        this.load.image("universalPanel1TBevel", "Images/Panels/UniversalPanel1TBevel.png");
        this.load.image("universalPanel1BBevel", "Images/Panels/UniversalPanel1BBevel.png");
        this.load.image("scrollBarVertical", "Images/Bars/ScrollBarVertical.png");
        this.load.image("play", "Images/Icons/8/Play.png");
        this.load.image("pause", "Images/Icons/8/Pause.png");
        this.load.image("x", "Images/Icons/8/XBrown.png");
        this.load.image("infoBrown", "Images/Icons/8/InfoBrown.png");
        this.load.image("clock", "Images/Icons/8/Clock.png");
        this.load.image("plus", "Images/Icons/8/Plus.png");
        this.load.image("minus", "Images/Icons/8/Minus.png");
        this.load.image("check", "Images/Icons/8/CheckGold.png");

        // Load web Font
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');

        this.add.dom(this.game.config.width / 2, this.game.config.height / 2).createFromHTML(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width: 60px; height: 60px;">
                <radialGradient id="a12" cx=".66" fx=".66" cy=".3125" fy=".3125" gradientTransform="scale(1.5)">
                    <stop offset="0" stop-color="#ffffff"></stop><stop offset=".3" stop-color="#ffffff" stop-opacity=".9"></stop>
                    <stop offset=".6" stop-color="#ffffff" stop-opacity=".6"></stop><stop offset=".8" stop-color="#ffffff" stop-opacity=".3"></stop>
                    <stop offset="1" stop-color="#ffffff" stop-opacity="0"></stop>
                </radialGradient>
                <circle transform-origin="center" fill="none" stroke="url(#a12)" stroke-width="15" stroke-linecap="round" stroke-dasharray="200 1000" stroke-dashoffset="0" cx="100" cy="100" r="70">
                    <animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="360;0" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform>
                </circle>
                <circle transform-origin="center" fill="none" opacity=".2" stroke="#ffffff" stroke-width="15" stroke-linecap="round" cx="100" cy="100" r="70"></circle>
            </svg>`
        );
    }

    create() {
        WebFont.load({
            custom: {
                families: ['BitCell', "VT323"],
            },
            active: function () {
                this.time.addEvent({
                    delay: 1000,
                    callback: () => {
                        this.scene.start("Game");
                    },
                    callbackScope: this
                })
            }.bind(this)
        });
    }

    update() {

    }
}