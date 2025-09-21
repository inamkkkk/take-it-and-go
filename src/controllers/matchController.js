const catchAsync = require('../utils/catchAsync');
const matchService = require('../services/matchService');
const httpStatus = require('http-status-codes');

const findMatches = catchAsync(async (req, res) => {
  const { deliveryId } = req.body;
  // TODO: req.user.id can be used to ensure only the shipper of delivery can find matches
  const matches = await matchService.findMatches(deliveryId);
  res.status(httpStatus.OK).send(matches);
});

module.exports = {
  findMatches
};
