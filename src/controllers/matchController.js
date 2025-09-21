const catchAsync = require('../utils/catchAsync');
const matchService = require('../services/matchService');
const httpStatus = require('http-status-codes');

const findMatches = catchAsync(async (req, res) => {
  const { deliveryId } = req.body;
  // TODO: req.user.id can be used to ensure only the shipper of delivery can find matches
  // For now, assuming the service handles delivery ownership validation or it's not a requirement yet.
  const matches = await matchService.findMatches(deliveryId, req.user.id); // Passing req.user.id to the service for potential validation
  res.status(httpStatus.OK).send(matches);
});

module.exports = {
  findMatches
};