const knex = require('../database/connection');

const DeviceIDMiddleware = async (request, response, next) => {
	const device_id = request.headers.device_id;

	if (!device_id) {
		return response.status(401).json({ error: "The device information is missing.", code: "D-001"});
	}
	
	const bd_response = await knex('Device')
	.where('device_id', device_id)
	.select('device_id')
	.first();

	if (!bd_response){
		return response.status(404).json({  error: "The device information is wrong. Make sure you have resgistered the device before send any information.",
											code: "D-002" });
	}

	next();
}

module.exports = DeviceIDMiddleware;