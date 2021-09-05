var express = require("express");
const { Book } = require("../models/book");
const { Reservation } = require("../models/reservation");
var router = express.Router();
const CronJob = require('cron').CronJob;
const {sendMail} = require('../middlewares/mail')
router.get("/allbooks/:page/:limit", (req, res) => {
  console.log(req.params.page);

  const options = {
    page: Number(req.params.page) + 1,
    limit: req.params.limit,
    // customLabels: myCustomLabels,
  };
  Book.paginate({}, options).then((books) => {
    res.status(200).json({ success: true, data: books });
  });
});
router.post("/newBook", (req, res) => {
  const { title, author, copies } = req.body;

  const book = new Book({
    title,
    author,
    copies,
    rating: 7,
  });

  book.save().then((x) => {
    res.status(200).json({ success: true, data: x });
  });
});

router.post("/booking", (req, res) => {

  const { id } = req.body;
  console.log('----------')
  console.log('612e21bfcbfa0e188c0391a2',id);

    const newRes = new Reservation({
    bookId: id,
    userId: '612e21bfcbfa0e188c0391a2',
  });
  console.log('----------')
  console.log(req.body.id)

  newRes.save().then(async(x) => {

    var job = new CronJob('0 */1 * * * *', function () {
      console.log('You will see this message every second');
      sendMail()
  }, null, true);
  job.start();

   await Book.findOneAndUpdate({_id:id},{$inc: { copies: -1}})

    res.status(200).json({ success: true, data: x });
  });
});




module.exports = router;
