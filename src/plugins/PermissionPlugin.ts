export class PermissionPlugin extends Phaser.Plugins.BasePlugin {
	public permitted: boolean;
	public error: string;
	public permissions: Promise<boolean|void>;

	constructor(pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);
	}

	public init(data: any) {
		console.log('permission plugin init');
		this.game = this.pluginManager.game;
		this.setupEvents();

		if (navigator.permissions) {
			// https://w3c.github.io/orientation-sensor/#model
			this.permissions = Promise.all([
				navigator.permissions.query({ name: 'accelerometer' }),
				navigator.permissions.query({ name: 'magnetometer' }),
				navigator.permissions.query({ name: 'gyroscope' }),
				])
				.then( (results) => {
					if (results.every((result) => result.state === 'granted')) {
						this.permitted = true;
						console.info('Permissions to sensors granted');
					} else {
						this.permitted = false;
						this.error = 'Permission to use sensor was denied.';
						console.warn(this.error);
					}

					return this.permitted;
				}).catch( (err) => {
					this.permitted = false;
					this.error = 'Failed to request permission to sensors';
					console.warn(this.error, err);
				});
		} else {
			this.permitted = true;
			this.error = 'No permission API';
			console.warn(this.error);
		}
	}

	private setupEvents() {
		// this.game.registry.events.on('changedata', (parent: any, key: string, data: any) => {
		// 	console.log('registry changedata', parent, key, data);
		// }, this);
	}
}
