const responseHandler = require("../handlers/responseHandler");
const db = require("../models");

/**
 * Renders test page when `/test` route is requested
 * @param req - Object - Express request
 * @param res - Object - Express response
 * @param next - Function - Express callback
 * @returns string
 */
module.exports.testSettings = async (req, res, next) => {
    responseHandler.handleSuccess(res, 'Test api hit successfully')
}