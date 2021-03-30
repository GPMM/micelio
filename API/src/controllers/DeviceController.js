const knex = require('../database/connection');

class DeviceController{
    
	async create(request, response){

        const {device_id, system_name, model, screen_width, screen_height} = request.body;

        if(!device_id) {
            return response.status(400).json({error: "Invalid device id"});
        }

        if(!system_name) {
            return response.status(400).json({error: "Invalid system information"});
        }

        if(!model) {
            return response.status(400).json({error: "Invalid device model"});
        }

        if(!screen_width) {
            return response.status(400).json({error: "Invalid screen width"});
        }

        if(!screen_height) {
            return response.status(400).json({error: "Invalid screen height"});
        }

        try{

            const data = {
                device_id,
                system_name,
                model,
                screen_width,
                screen_height
            }
            
            const device = await knex('device').insert(data);
            
            if(device){
                return response.status(201).json({ok: true});
            }
            else{
                return response.status(400).json({error: device});
            }
     
        }
        catch(err){
            return response.status(400).json({error: err});

        }
        
    }

}

module.exports = DeviceController;