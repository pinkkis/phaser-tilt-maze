export class OrientationSensorPlugin extends Phaser.Plugins.BasePlugin {
	public relative: boolean = true;
	public sensorOptions = {
		frequency: 20,
		coordinateSystem: 'screen',
	};

	private privateSensor: RelativeOrientationSensor | AbsoluteOrientationSensor;

	constructor(pluginManager: Phaser.Plugins.PluginManager) {
		super(pluginManager);
	}

	public init(data: any) {
		console.log('sensor plugin init');
		this.game = this.pluginManager.game;

		this.privateSensor = this.relative
			? new RelativeOrientationSensor(this.sensorOptions)
			: new AbsoluteOrientationSensor(this.sensorOptions);

		this.setupEvents();

		this.privateSensor.start();
	}

	public get sensor() {
		return this.privateSensor;
	}

	private setupEvents() {
		this.privateSensor.onreading = () => {
			console.log(this.privateSensor.quaternion);
			this.game.events.emit('sensor:reading',
				new Phaser.Math.Quaternion(
					this.privateSensor.quaternion[0],
					this.privateSensor.quaternion[1],
					this.privateSensor.quaternion[2],
					this.privateSensor.quaternion[3],
					),
				);
		};

		this.privateSensor.onerror = (event) => {
			if (event.error.name === 'NotReadableError') {
				this.game.registry.set('sensorError', event.error.name);
				console.warn('OrientationSensorPlugin: Sensor is not available.');
			}
		};
	}
}
