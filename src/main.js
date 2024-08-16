import Phaser from "phaser";
import Game from "./scenes/game";
import Loading from "./scenes/loading";

window.addEventListener('load', function () {
    try {
        const config = {
            type: Phaser.WEBGL,
            width: 1200,
            height: 800,
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            parent: "game-container",
            dom: {
                createContainer: true
            },
            pixelArt: true,
            backgroundColor: "#202C3D",
            scene: [Loading, Game]
        }

        const game = new Phaser.Game(config);

    }
    catch (e) {
        console.error("Error starting game:", e);
    }
});