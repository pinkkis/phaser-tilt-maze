import { BaseScene } from './BaseScene';

export class BootScene extends BaseScene{
	constructor(key: string, options: any) {
		super('BootScene');
	}

	preload() {}

	init() {}

	create() {
		console.info('BootScene - create()');

		// this.scene.start('LoadScene', {});

		this.add.text(100, 100, 'Boot Scene Loaded', { fontSize: '20px' });

		this.permission.permissions.then( (value: any) => {
			this.game.registry.set('permissions', value);
			if (value) {
				this.game.plugins.get('OrientationSensorPlugin', true);
			}
		})
		.finally( () => {
			this.scene.start('GameScene');
		});
	}

	update(time: number, delta: number) {}
}
