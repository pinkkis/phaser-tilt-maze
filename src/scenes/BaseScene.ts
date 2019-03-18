import { KokoGame } from '../game';
import { PermissionPlugin } from '../plugins/PermissionPlugin';

export class BaseScene extends Phaser.Scene {
	game: KokoGame;
	permission: PermissionPlugin;

	constructor(key: string, options?: any) {
		super(key);

		this.game = this.sys.game as KokoGame;
	}

	preload() {}

	resize() {}

	setTimerEvent(timeMin: number, timeMax: number, callback: () => void, params?: any[]): Phaser.Time.TimerEvent {
		return this.time.delayedCall(Phaser.Math.Between(timeMin, timeMax), callback, params || [], this);
	}
}
