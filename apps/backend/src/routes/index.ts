import { type Express } from 'express'

import utils from './utils'

const mountRoutes = async (app: Express) => {
    const baseUrl = process.env['API_BASE_URL']
    app.use(`${baseUrl}/utils`, await utils())
}

export default mountRoutes
