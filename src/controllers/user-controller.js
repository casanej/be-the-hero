const connection = require('../database/connection');

module.exports = {
    async create(request, response) {
        const { id } = request.body;

        const ong = await connection('ongs').where('id', id).select('name').first();

        if(ong === undefined) return response.status(400).json({ success: false, message: "No ONG found with this ID " });

        return response.json({ success: true, data: ong })
    }
}