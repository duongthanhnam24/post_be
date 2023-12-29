const Transaction = require("../models/transactionPoint");

const Gathering = require("../models/Gathering");
const { default: mongoose } = require("mongoose");
const createTransaction = async (req, res) => {
    const { pointName, leaderTransactionPoint, name, nameGathering, idGathering } = req.body;
    try {
        if (!pointName || !leaderTransactionPoint || !name || !nameGathering || !idGathering) {
            return res.status(400).json({ message: "Bạn thiếu gì đó" });
        }
        const newTransaction = await new Transaction({
            pointName,
            leaderTransactionPoint,
            name,
            idGathering,
            nameGathering,
        });
        const createTransaction = await newTransaction.save();
        const updatedGathering = await Gathering.updateOne(
            { _id: idGathering },
            {
                $push: {
                    transactions: {
                        pointName: createTransaction.pointName,
                        idTransaction: createTransaction._id,
                    },
                },
            }
        );
        return res.status(200).json({ message: "Tạo điểm giao dịch thành công" });
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
const allTransaction = async (req, res) => {
    try {
        const allTransaction = await Transaction.find();
        return res.status(200).json(allTransaction);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const id = req.params.id;
        const transaction = await Transaction.findOne({ _id: id });
        if (!transaction) {
            return res.status(400).json({ message: "không tồn tại" });
        }
        return res.status(200).json(transaction);
    } catch (error) {
        return res.status(400).json({ message: error });
    }
};
const sendGathering = async (req, res) => {
    try {
        const id = req.params.id;
        const idGathering = req.params.idGathering; // điểm tập kết
        console.log(idGathering);
        const { _id, name, address, phone, type, Status, station, typeNote } = req.body;

        const findGathering = await Gathering.updateOne(
            { _id: idGathering },
            {
                $push: {
                    note: { _id: _id, name, address, phone, type, Status, station, typeNote },
                },
            },
            { new: true, runValidators: true }
        );
        console.log(findGathering, 1);
        if (!findGathering) {
            return res.status(404).json({ message: "Không tìm thấy" });
        }
        const deleteNote = await Transaction.updateOne(
            {
                _id: id,
            },
            { $pull: { note: { _id: _id } } }
        );
        return res.status(200).json({ message: "Gửi thành công" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const upDate = async (req, res) => {
    const id = req.params.id;
    console.log(req.body.teller);
    try {
        if (req.body.teller.length <= 0) {
            return res.status(400).json({
                message: "Bạn quên thứ gì đó",
            });
        }

        const findTransaction = await Transaction.findOne({ _id: id });
        console.log(findTransaction);
        const isDuplicate = req.body.teller.some((item) => {
            const itemObjectId = new mongoose.Types.ObjectId(item.idTeller);
            return findTransaction.teller.some((teller) => teller.idTeller.equals(itemObjectId));
        });

        if (isDuplicate) {
            return res.status(400).json({
                message:
                    "Các giá trị trong req.body.teller đã tồn tại trong findTransaction.teller",
            });
        }
        // Use findByIdAndUpdate instead of just findById
        const updatedTransaction = await Transaction.updateOne(
            { _id: id },
            { $push: { teller: req.body.teller } },
            { new: true, runValidators: true } // To return the updated document and run validators
        );

        if (!updatedTransaction) {
            return res.status(404).json({ message: "updatedTransaction not found" });
        }

        return res.status(200).json({ message: "Thêm thành công" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createTransaction,
    getTransactionById,
    allTransaction,
    sendGathering,
    upDate,
};
