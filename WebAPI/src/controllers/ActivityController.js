const knex = require('../database/connection');

class ActivityController {

	async create(request, response) {
		const {
			activity_id, name, position_x, position_y,
			time, influenced_by, attributes, entities, agents } = request.body;

		const {game_id, device_id} = request.headers;

		if (!activity_id) {
			return response.status(400).json("Invalid activity id");
		}

		if (!name) {
			return response.status(400).json("Invalid activity name");
		}

		if (!time) {
			return response.status(400).json("Invalid activity time");
		}

		if (!agents) {
			return response.status(400).json("Invalid agents");
		}

		if (!entities) {
			return response.status(400).json("Invalid entities");
		}

		const trx = await knex.transaction();

        try{

			const { session_id } = await trx('session')
            .where('device_id', device_id)
            .andWhere('game_id', game_id)
            .orderBy([{ column: 'date', order: 'desc'}, { column: 'start_time', order: 'desc' }])
            .select('session_id')
            .first();
			
			const data = {
				session_id,
				activity_id,
				name,
				position_x,
				position_y,
				time,
				influenced_by,
				attributes: JSON.stringify(attributes),
				entities,
				agents,
			}
			
            return response.status(201).json(data);

            if(sessionUpdated){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: session});
            }


        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: err});
        }

	}
}

module.exports = ActivityController;
