const axios = require('axios');
const crypto = require('crypto');
const Transaction = require('../models/Transaction.model');

const initiatePayment = async (req, res) => {
  try {
    const { amount, productId } = req.body;
    const userId = req.user.id; // Extract user ID from the token

    // Create a new transaction record
    const transaction = await Transaction.create({
      amount,
      productId,
      userId,
      status: 'PENDING',
    });

    // Generate signature
    const message = `total_amount=${amount},transaction_uuid=${transaction._id},product_code=EPAYTEST`;
    const signature = crypto
      .createHmac('sha256', process.env.SECRET)
      .update(message)
      .digest('base64');

    const paymentData = {
      amount: amount,
      failure_url: process.env.FAILURE_URL,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `${process.env.SUCCESS_URL}?tid=${transaction._id}`,
      tax_amount: "0",
      total_amount: amount,
      transaction_uuid: transaction._id,
    };

    res.status(200).json({
      success: true,
      data: paymentData,
      paymentUrl: process.env.ESEWAPAYMENT_URL,
    });
  } catch (error) {
    console.error('Payment initiation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initiate payment',
      error: error.message,
    });
  }
};

const verifyPayment = async (req, res) => {
  try {
    const { tid } = req.query;

    // Find the transaction
    const transaction = await Transaction.findById(tid);
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Check payment status from eSewa
    const response = await axios.get(
      `${process.env.ESEWAPAYMENT_STATUS_CHECK_URL}?transaction_uuid=${tid}`
    );

    // Update transaction status
    transaction.status = response.data.status;
    await transaction.save();

    res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify payment',
      error: error.message,
    });
  }
};

module.exports = {
  initiatePayment,
  verifyPayment,
};
