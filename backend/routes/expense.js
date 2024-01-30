const express = require('express');
const { body, validationResult } = require('express-validator');
const fetchUser = require('../middleware/fetchUser');
const User = require('../models/User');
const Group = require('../models/Group');
const Debt = require('../models/Debt');
const Expense = require('../models/Expense');
const router = express.Router();

router.post('/addexpense', fetchUser, [body('description').notEmpty().withMessage('Description is required'), body('amount').isNumeric().withMessage('Amount must be a number'), body('tags').notEmpty().withMessage('Tags is required')], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const userId = req.user.id;
  const { description, amount, tags, date, splitWith } = req.body;

  try {
    const user = await User.findById(userId);

    const expense = new Expense({
      user: userId,
      description,
      amount,
      tags,
      date: date || new Date(),
      splitWith: splitWith || [],
    });

    const savedExpense = await expense.save();

    await User.findByIdAndUpdate(userId, { $push: { expenses: savedExpense._id } });

    res.status(200).json({ message: 'Expense added successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post(
  '/splitexpense',
  fetchUser,
  [
    body('groupId').notEmpty().withMessage('Group ID is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('splitType').isIn(['equal', 'unequal']).withMessage('Invalid split type'),
    body('splitData').optional().isArray().withMessage('Invalid split data'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user.id;
    const { groupId, description, amount, splitType, splitData, date } = req.body;

    try {
      const group = await Group.findById(groupId);

      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }

      if (!group.members.includes(userId)) {
        return res.status(403).json({ error: 'You are not a member of this group' });
      }

      const user = await User.findById(userId);

      const expense = new Expense({
        user: userId,
        description,
        amount,
        date: date || new Date(),
        splitWith: group.members,
      });

      const savedExpense = await expense.save();

      if (splitType === 'equal') {
        const equalShare = amount / group.members.length;

        const debt = new Debt({
          debtors: group.members
            .filter((memberId) => memberId !== userId)
            .map((debtorId) => ({
              user: debtorId,
              amount: equalShare,
              settled: false,
            })),
          creditor: userId,
        });

        await debt.save();
      } else if (splitType === 'unequal' && splitData) {
        // Split the amount unequally based on provided data
        const debt = new Debt({
          debtors: splitData.map(({ memberId, share }) => ({
            user: memberId,
            amount: share,
            settled: false,
          })),
          creditor: userId,
        });

        await debt.save();
      }
      res.status(200).json({ message: 'Expense split successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
);

module.exports = router;
