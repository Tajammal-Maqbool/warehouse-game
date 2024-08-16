import Phaser from "phaser";

export default class ScrollBarContent extends Phaser.GameObjects.Container {
    constructor(scene, x, y, width, height, parentPosition, contentContainer, scrollWidth = 6) {
        super(scene, x, y);
        this.scene = scene;
        this.scene.add.existing(this);

        this.width = width;
        this.height = height;
        this.scrollWidth = scrollWidth;
        this.parentPosition = parentPosition;
        this.contentContainer = contentContainer;
        this.add(this.contentContainer);

        this.handleBg = this.scene.add.nineslice(this.width, 0, "universalPanel1", 0, this.scrollWidth, this.height, 2, 2, 2, 2).setTint(0x202C3D).setOrigin(1, 0);
        this.add(this.handleBg);

        this.handleHeight = this.height / this.contentContainer.getBounds().height * this.height;
        this.handle = this.scene.add.nineslice(this.width, 0, "scrollBarVertical", 0, this.scrollWidth, this.handleHeight, 1, 1, 1, 1).setOrigin(1, 0);
        this.add(this.handle);

        const maskRect = this.scene.add.rectangle(this.parentPosition.x + this.x + this.width / 2, this.parentPosition.y + this.y + this.height / 2, this.width, this.height, 0x000000).setVisible(false);
        const mask = maskRect.createGeometryMask();
        this.setMask(mask);

        this.setupEvents();
    }

    setupEvents() {
        this.handle.setInteractive({ draggable: true });

        let lastY = 0;
        this.handle.on("dragstart", (pointer, dragX, dragY) => {
            if (this.scene.isModalOpen) {
                return;
            }
            lastY = dragY;
        });
        this.handle.on("pointerover", () => {
            if (this.scene.isModalOpen) {
                return;
            }
            this.scene.game.canvas.style.cursor = "grabbing";
        });
        this.handle.on("pointerout", () => {
            if (this.scene.isModalOpen) {
                return;
            }
            this.scene.game.canvas.style.cursor = "default";
        });

        this.handle.on("drag", (pointer, dragX, dragY) => {
            if (this.scene.isModalOpen) {
                return;
            }
            const delta = dragY - lastY;
            const newY = Phaser.Math.Clamp(this.handle.y + delta, 0, this.height - this.handleHeight);
            this.handle.y = newY;
            lastY = dragY;
            this.updateContentPosition();
        });

        this.scene.input.on("wheel", (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
            if (this.scene.isModalOpen) {
                return;
            }
            if (pointer.x > this.parentPosition.x + this.x && pointer.x < this.parentPosition.x + this.x + this.width && pointer.y > this.parentPosition.y + this.y && pointer.y < this.parentPosition.y + this.y + this.height) {
                const newY = Phaser.Math.Clamp(this.handle.y + deltaY / 30, 0, this.height - this.handleHeight);
                this.handle.y = newY;
                this.updateContentPosition();
            }
        });

        let pointerDown = false;
        let pointerPosition = { x: 0, y: 0 };

        this.scene.input.on("pointerdown", (pointer) => {
            if (this.scene.isModalOpen) {
                return;
            }
            if (pointer.x > this.parentPosition.x + this.x && pointer.x < this.parentPosition.x + this.x + this.width - this.scrollWidth && pointer.y > this.parentPosition.y + this.y && pointer.y < this.parentPosition.y + this.y + this.height) {
                pointerDown = true;
                pointerPosition = { x: pointer.x, y: pointer.y };
            }
        });

        this.scene.input.on("pointerup", () => {
            if (this.scene.isModalOpen) {
                return;
            }
            pointerDown = false;
        });

        this.scene.input.on("pointermove", (pointer) => {
            if (this.scene.isModalOpen) {
                return;
            }
            if (pointerDown) {
                const deltaY = pointer.y - pointerPosition.y;
                const newY = Phaser.Math.Clamp(this.handle.y - deltaY, 0, this.height - this.handleHeight);
                this.handle.y = newY;
                this.updateContentPosition();
                pointerPosition = { x: pointer.x, y: pointer.y };

                // if pointer goes out then up the pointer
                if (pointer.y < this.parentPosition.y + this.y || pointer.y > this.parentPosition.y + this.y + this.height) {
                    pointerDown = false;
                }
            }
        });
    }

    updateContentPosition() {
        const contentRatio = this.handle.y / (this.height - this.handleHeight);
        const newY = -contentRatio * (this.contentContainer.getBounds().height - this.height);
        this.contentContainer.y = newY;
    }
}