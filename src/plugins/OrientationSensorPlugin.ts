export class OrientationSensorPlugin extends Phaser.Plugins.BasePlugin {
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
		this.initSensor();
	}

	public get sensor() {
		return this.privateSensor;
	}

	public resetSensor() {
		this.initSensor();
		console.log('reset sensor');
	}

	private initSensor() {
		this.privateSensor = new RelativeOrientationSensor(this.sensorOptions);
		this.setupEvents();
		this.privateSensor.start();
	}

	private setupEvents() {
		this.privateSensor.onreading = () => {
			// console.log(this.privateSensor.quaternion);
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
