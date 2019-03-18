import { BaseScene } from './BaseScene';
import { OrientationSensorPlugin } from '../plugins/OrientationSensorPlugin';

export class GameScene extends BaseScene {
	quaternion: Phaser.Math.Quaternion;
	positionText: Phaser.GameObjects.Text;
	angleText: Phaser.GameObjects.Text;
	gravityText: Phaser.GameObjects.Text;
	brick: Phaser.Physics.Matter.Image;

	// downAngle: Phaser.Math.

	constructor(key: string, options: any) {
		super('GameScene');
	}

	preload() {
		this.load.image('block', 'assets/img/block.png');
		this.load.image('platform', 'assets/img/platform.png');
	}

	init() { }

	create() {
		console.info('GameScene - create()');

		this.positionText = this.add.text(10, 10, 'Quaternion data', { fontSize: '10px' })
			.setScrollFactor(0)
			.setDepth(10);
		this.angleText = this.add.text(80, 10, 'Angle data', { fontSize: '10px' })
			.setScrollFactor(0)
			.setDepth(10);
		this.gravityText = this.add.text(160, 10, 'Gravity', { fontSize: '10px' })
			.setScrollFactor(0)
			.setDepth(10)
			.setText(`x: ${this.matter.world.localWorld.gravity.x.toFixed(2)}\ny: ${this.matter.world.localWorld.gravity.y.toFixed(2)}`);

		this.game.events.on('sensor:reading', (reading: Phaser.Math.Quaternion) => {
			this.quaternion = reading;

			const aa = quaternionToAxisAngle(this.quaternion);

			if (this.quaternion) {
				this.positionText
					.setText(`x: ${this.quaternion.x.toFixed(2)}\ny: ${this.quaternion.y.toFixed(2)}\nz: ${this.quaternion.z.toFixed(2)}\nw: ${this.quaternion.w.toFixed(2)}`);
				this.angleText.setText(`x: ${aa[0].x.toFixed(2)}\ny: ${aa[0].y.toFixed(2)}\nz: ${aa[0].z.toFixed(2)}\na: ${aa[1].toFixed(2)}`);
			} else {
				this.positionText.setText(this.game.registry.get('sensorError') || 'Could not get sensor data');
			}

		});

		this.input.on('pointerup', () => {
			if (this.scale.isFullscreen) {
				this.matter.world.setGravity(Phaser.Math.FloatBetween(0, 1) - .5, Phaser.Math.FloatBetween(0, 1) - .5);
				this.gravityText
					.setText(`x: ${this.matter.world.localWorld.gravity.x.toFixed(2)}\ny: ${this.matter.world.localWorld.gravity.y.toFixed(2)}`);
			} else {
				this.scale.startFullscreen();
				screen.orientation.lock('landscape-primary');
				(this.game.plugins.get('OrientationSensorPlugin') as OrientationSensorPlugin).resetSensor();
			}
		});

		this.matter.world.setBounds(0, 0, 1024, 1024, 10, true, true, true, true);

		this.brick = this.matter.add.image(200, 0, 'block')
			.setScale(.33)
			.setTint(new Phaser.Display.Color(255, 127, 127, 1).color);

		for (let i = 0; i < 10; i++) {
			this.matter.add.image(
				Phaser.Math.Between(10, 200),
				Phaser.Math.Between(10, 200),
				'block')
				.setScale(Phaser.Math.FloatBetween(.25, .5));
		}

		this.matter.add.image(340, 350, 'platform', null, { isStatic: true });
		this.matter.add.image(640, 650, 'platform', null, { isStatic: true });
		this.matter.add.image(240, 750, 'platform', null, { isStatic: true });

		this.cameras.main.setBounds(0, 0, 1024, 1024);
		this.cameras.main.startFollow(this.brick, true, .1, .1);

	}

	update(time: number, delta: number) {
		// console.log(this.cameras.main.rotation);
	}

}

function quaternionToAxisAngle(quaternion: Phaser.Math.Quaternion): [Phaser.Math.Vector3, number] {
	const targetAxis = new Phaser.Math.Vector3();
	const angle = 2 * Math.acos(quaternion.w);
	const s = Math.sqrt(1 - quaternion.w * quaternion.w);
	if (s < 0.001) {
		targetAxis.x = quaternion.x;
		targetAxis.y = quaternion.y;
		targetAxis.z = quaternion.z;
	} else {
		targetAxis.x = quaternion.x / s; // normalise axis
		targetAxis.y = quaternion.y / s;
		targetAxis.z = quaternion.z / s;
	}
	return [targetAxis, angle];
}
