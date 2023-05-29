import { type Express } from 'express'

import utils from './utils'

const mountRoutes = (app: Express) => {
    const baseUrl = process.env['API_BASE_URL']
    app.use(`${baseUrl}/utils`, utils())
}

export default mountRoutes
