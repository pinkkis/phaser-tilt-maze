export class DeviceMotionPlugin extends Phaser.Plugins.BasePlugin {
	public supported = (window as any).DeviceMotionEvent !== undefined;

	constructor(pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);
	}

	public init(data: any) {
		console.log('motion plugin init');
		this.game = this.pluginManager.game;
		this.setupEvents();
	}

	private setupEvents() {
		window.addEventListener('devicemotion', (e: DeviceMotionEvent) => {
			this.game.events.emit('device:motion', e);
		});
		window.addEventListener('deviceorientation', (e: DeviceOrientationEvent) => {
			this.game.events.emit('device:orientation', e);
		});
	}
}
