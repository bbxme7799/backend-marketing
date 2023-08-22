export const topup = (req, res, next) => {
  try {
    const {point} = req.body
  } catch (error) {
    console.log(error);
    next(error);
  }
};
