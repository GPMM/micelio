const knex = require('../database/connection');
const idGenerator = require('../utils/generators/idGenerator');

class FormController {

	async get(request, response) {
		const {experiment_id} = request.params;

		const {txt_consent_term} = await knex('Experiment as e')
                                        .select('e.txt_consent_term')
                                        .where('e.experiment_id', experiment_id)
                                        .first();
	
		return response.json({ok: true, data: txt_consent_term});
	}
	

	async create(request, response) {

        const {experiment_id} = request.params
        const {username, email} = request.body;

		const group_id = Math.floor(Math.random()*(4))+1;

        if(!experiment_id){
            return response.status(400).json({error: "Missing experiment id"});
        }

        if(!username || !email){
            return response.status(400).json({error: "Missing username or email"});
        }

        const {txt_email} = await knex('Participant')
                                 .select('txt_email')
                                 .where('txt_email', email)
                                 .andWhere('experiment_id', experiment_id)
                                 .first();

        if(txt_email){
            return response.status(400).json({error: 'This email has already started this experiment'});
        }

		const participant_id = await idGenerator('Participant');

        const trx = await knex.transaction();

        try{

            const userData = {
                participant_id,
                txt_name: username,
                txt_email: email,
                group_id,
                experiment_id
			}

			const userInsert = await trx('participant').insert(userData);

            if(userInsert){
                await trx.commit();
                return response.status(201).json({ok: true});
            }
            else{
                await trx.rollback();
                return response.status(400).json({error: 'Cannot insert the participant, check the information sent'});
            }
        }
        catch(err){
            await trx.rollback();
            return response.status(400).json({error: 'Something went wrong, try again later'});
        }
	}
}

module.exports = FormController;
