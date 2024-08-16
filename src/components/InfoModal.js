import Phaser from "phaser";
import IconButton from "./IconButton";
import WindowPanel from "./WindowPanel";


export default class InfoModal extends Phaser.GameObjects.Container {
    constructor(scene, callback) {
        super(scene, scene.game.config.width / 2, scene.game.config.height / 2);
        this.scene = scene;
        this.scene.add.existing(this);

        this.setDepth(100);

        this.bg = this.scene.add.rectangle(0, 0, this.scene.game.config.width, this.scene.game.config.height, 0x000000, 0.5);
        this.add(this.bg);

        this.windowPanel = new WindowPanel(this.scene, -300, -300, 600, 400, "How To Play?", 32);
        this.add(this.windowPanel);

        this.text = this.scene.add.text(-270, -200, "1. Review how much inventory and labor you have in the facility. Notice that you only have 3 dock doors that you can operate at once!\n\n2. Look at all of the Shipments needing to ship and the inbounds needing to be unloaded. Be careful to review what inventory is on each. Click on the inbounds or outbounds you want to work to each lane\n\n3. Assign how many people you want to work each inbound or outbound The more people you assign, the faster they'll get the work done!\n\n4. Click the play button and let the site work! As each load completes, you can put another in the door and rebalance labor across all 3 loads! Play until all of the work is complete, and see your final score! The lower your score, the better you've done!", {
            font: "normal 22px VT323",
            fill: "#fff",
            wordWrap: {
                width: 510,
                useAdvancedWrap: true
            }
        }).setLetterSpacing(1);
        this.windowPanel.setSize(600, this.text.height + 70);
        this.add(this.text);

        this.windowPanel.y = -(this.text.height + 70) / 2;

        this.backButton = new IconButton(this.scene, 290, -(this.text.height + 55) / 2, "goldBtn", "goldBtnDown", "goldBtnHover", "x", () => {
            this.destroy();
            callback();
        }, false, 0.7);
        this.add(this.backButton);
    }
}