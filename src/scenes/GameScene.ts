import { BaseScene } from './BaseScene';
import { OrientationSensorPlugin } from '../plugins/OrientationSensorPlugin';
import { Scale } from 'phaser';

const fontStyle = {
	fontSize: '10px',
	fontFamily: 'Lucida Console, monospace',
};

export class GameScene extends BaseScene {
	fullScreen: boolean;
	oriented: boolean;
	orientation: number;

	rotationText: Phaser.GameObjects.Text;
	movementText: Phaser.GameObjects.Text;
	orientationText: Phaser.GameObjects.Text;
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

		this.rotationText = this.add.text(10, 10, 'Rotation', fontStyle)
							.setScrollFactor(0)
							.setDepth(10);
		this.movementText = this.add.text(80, 10, 'Movement', fontStyle)
							.setScrollFactor(0)
							.setDepth(10);
		this.orientationText = this.add.text(140, 10, 'Orientation', fontStyle)
							.setScrollFactor(0)
							.setDepth(10);
		this.gravityText = this.add.text(260, 10, 'Gravity', fontStyle)
							.setScrollFactor(0)
							.setDepth(10)
							.setText(`Gravity\nx: ${this.matter.world.localWorld.gravity.x.toFixed(2)}\ny: ${this.matter.world.localWorld.gravity.y.toFixed(2)}`);

		this.game.events.on('device:motion', (evt: DeviceMotionEvent) => {
			this.rotationText.setText(`Rotation\na: ${evt.rotationRate.alpha.toFixed(2)}\nb: ${evt.rotationRate.beta.toFixed(2)}\n\g: ${evt.rotationRate.gamma.toFixed(2)}`);
			this.movementText.setText(`Movement\nx: ${evt.accelerationIncludingGravity.x.toFixed(2)}\ny: ${evt.accelerationIncludingGravity.y.toFixed(2)}\nz: ${evt.accelerationIncludingGravity.z.toFixed(2)}`);
		});

		this.game.events.on('device:orientation', (evt: DeviceOrientationEvent) => {
			this.orientationText.setText(`Orientation\na: ${evt.alpha.toFixed(2)}\nb: ${evt.beta.toFixed(2)}\ng: ${evt.gamma.toFixed(2)}\nAbs: ${evt.absolute}`);
			this.matter.world.setGravity(evt.beta / 100, -evt.gamma / 100);
		});

		this.input.on('pointerup', () => {
			if (!this.scale.isFullscreen) {
				this.scale.startFullscreen();
				screen.orientation.lock('landscape-primary');
			}
		});

		this.scale.on(Scale.Events.ENTER_FULLSCREEN, () => {
			console.log('enter full screen');
			this.matter.resume();
		});

		this.scale.on(Scale.Events.LEAVE_FULLSCREEN, () => {
			console.log('leave full screen');
			this.matter.pause();
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
				.setScale(Phaser.Math.FloatBetween(.1, .3));
		}

		this.matter.add.image(340, 350, 'platform', null, { isStatic: true });
		this.matter.add.image(640, 650, 'platform', null, { isStatic: true });
		this.matter.add.image(240, 750, 'platform', null, { isStatic: true });

		this.cameras.main.setBounds(0, 0, 1024, 1024);
		this.cameras.main.startFollow(this.brick, true, .1, .1);

		this.matter.pause();

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
