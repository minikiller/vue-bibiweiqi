// const { createLogger, transports ,format} = require('winston');
// const logger = createLogger({
//   level: 'info',
//   format: format.combine(
//     format.json(),
//     format.timestamp()
// ),
//   transports: [
//     // - Write all logs error (and below) to `somefile.log`.
//     new transports.File({ filename: 'somefile.log', level: 'error' })
//   ]
// });
// logger.log('error', 'Hello log files!')
// logger.log('info', 'Hello is log files!')

var v =Math.random().toString().substr(2, 5)
  // Math.random()
  //   .toString(36)
  //   .substring(2, 15) +
  // Math.random()
  //   .toString(36)
  //   .substring(2, 15);
console.log(v);
