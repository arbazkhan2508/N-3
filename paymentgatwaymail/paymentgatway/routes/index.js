var express = require('express');
var router = express.Router();
var Razorpay = require('razorpay')

//razorpay instance
var instance = new Razorpay({
  key_id: 'rzp_test_e0p4ROsVzyQ7xL',
  key_secret: 'DwGCKSi05b7yDJc6VijYVM6Y',
});

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index');
});

router.get('/success', function (req, res) {
  res.render('success');
});

router.post('/create/orderId', function (req, res) {
  var options = {
    amount: 50000,  // amount in the smallest currency unit
    currency: "INR",
    receipt: "order_rcptid_11"
  };
  instance.orders.create(options, function (err, order) {
    console.log(order);
    res.send(order)
  });
});


router.post("/api/payment/verify",(req,res)=>{

  let body=req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;
 
   var crypto = require("crypto");
   var expectedSignature = crypto.createHmac('sha256', 'DwGCKSi05b7yDJc6VijYVM6Y')
                                   .update(body.toString())
                                   .digest('hex');
                                   console.log("sig received " ,req.body.response.razorpay_signature);
                                   console.log("sig generated " ,expectedSignature);
   var response = {"signatureIsValid":"false"}
   if(expectedSignature === req.body.response.razorpay_signature)
    response={"signatureIsValid":"true"}
       res.send(response);
   });
 


module.exports = router;
