const ExitCode = {
  success: 0,
  error: 1,
};
const or = (err) => {
  if (err) {
    console.log(err.message);
    process.exit(ExitCode.error);
  }
};

module.exports = { ExitCode, or };
