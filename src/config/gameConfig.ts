import { OrientationSensorPlugin } from '../plugins/OrientationSensorPlugin';
import { PermissionPlugin } from '../plugins/PermissionPlugin';

// phaser game config
export const gameConfig: GameConfig = {
	type: Phaser.AUTO,
	parent: 'game-container',
	scale: {
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		width: 360,
		height: 240,
	},
	render: {
		pixelArt: true,
	},
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 },
			debug: true,
		},
	},
	plugins: {
		global: [
			{
				key: 'PermissionPlugin',
				plugin: PermissionPlugin,
				start: true,
				mapping: 'permission',
				data: {},
			},
			{
				key: 'OrientationSensorPlugin',
				plugin: OrientationSensorPlugin,
				start: false,
				mapping: null,
				data: {},
			},
		],
	},
};
