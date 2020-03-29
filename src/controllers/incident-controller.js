const connection = require('../database/connection');

module.exports = {
    async index (request, response) {
        const { page = 1, offset = 0, limit = 5 } = request.query
        const { ong } = request.params;

        let incidents = undefined;

        const [count] = await connection('incidents').count();

        if(ong !== undefined) {
            incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.id')
            .limit(limit)
            .offset((page-1)*limit)
            .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.city', 'ongs.uf'])
            .where('ong_id', ong);
        } else {
            incidents = await connection('incidents')
            .join('ongs', 'ongs.id', '=', 'incidents.ong_id')
            .limit(limit)
            .offset((page-1)*limit)
            .select(['incidents.*', 'ongs.name', 'ongs.email', 'ongs.city', 'ongs.uf']);
        }

        const meta = {
            total: count['count(*)'],
            limit: limit,
            offset: offset,
            page: parseInt(page),
            next: incidents.length < limit ? null : `${request.url}?page=${parseInt(page)+1}`,
            previous: parseInt(page) === 1 ? null : `${request.url}?page=${page-1}`
        }

        let payload = {success: true, meta: meta, objects: incidents}

        if(incidents.length === 0){
            if(ong !== undefined)  {
                payload = {success: false, meta: meta, message: `Don't have any incidente registered for ONG ${ong}`}
            }
        }
    
        return response.json(payload);
    },
    async create(request, response){ 
        const { title, description, value } = request.body;
        const ong_id = request.headers.authorization;

        const [id] = await connection('incidents').insert({
            title,
            description,
            value,
            ong_id
        });

        return response.json({ id })
    },
    async delete(request, response) {
        const { id } = request.params;
        const ong_id = request.headers.authorization;

        const incident = await(connection)('incidents').where('id', id).select('ong_id').first();

        
        if(incident === undefined) return response.json({ success: false, message: `Incident with ID ${id} not existe.` });
        if(incident.ong_id !== ong_id) return response.status(401).json({ success: false, message: "You're not the owner of this incident" });

        await connection('incidents').where('id', id).delete();

        return response.json({ success: true, message: "Incident delete with success" });
    }
}