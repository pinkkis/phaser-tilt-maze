import { BaseScene } from './BaseScene';

export class GameScene extends BaseScene {
	quaternion: Phaser.Math.Quaternion;
	positionText: Phaser.GameObjects.Text;
	titleText: Phaser.GameObjects.Text;

	constructor(key: string, options: any) {
		super('GameScene');
	}

	preload() { }

	init() { }

	create() {
		console.info('GameScene - create()');

		this.titleText = this.add.text(10, 10, 'Game Scene', { fontSize: '20px' });
		this.positionText = this.add.text(10, 50, 'foo', { fontSize: '20px' });
		this.game.events.on('sensor:reading', (q: Phaser.Math.Quaternion) => { this.quaternion = q; });

		this.input.on('pointerup', () => {
			if (this.scale.isFullscreen) {
				this.scale.stopFullscreen();
			} else {
				this.scale.startFullscreen();
				screen.orientation.lock('landscape-primary');
			}
		});
	}

	update(time: number, delta: number) {
		if (this.quaternion) {
			this.positionText.setText(`x: ${this.quaternion.x}\ny: ${this.quaternion.y}\nz: ${this.quaternion.z}\nw: ${this.quaternion.w}`);
		} else {
			this.positionText.setText(this.game.registry.get('sensorError') || 'Could not get sensor data');
		}

	}
}
