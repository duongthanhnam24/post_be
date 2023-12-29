const { default: mongoose } = require("mongoose");
const Gathering = require("../models/Gathering");
const Note = require("../models/noteDB");
const Transaction = require("../models/transactionPoint");
const createGathering = async (req, res) => {
    try {
        const { pointName, transactions, name, leaderGatheringPoint } = req.body;
        if (!pointName || !leaderGatheringPoint || !name || !transactions) {
            return res.status(404).json({ message: "Bạn quên thông tin nào đó!" });
        }
        const createGathering = await new Gathering({
            pointName: pointName,
            transactions: transactions,
            leaderGatheringPoint: leaderGatheringPoint,
            name: name,
        });
        const newGathering = await createGathering.save();
        return res.status(200).json({ message: "tạo điểm tập kết thành công" });
    } catch (error) {
        return res.status(200).json({ message: error });
    }
};
const getAll = async (req, res) => {
    try {
        const filter = req.query.type;
        if (filter) {
            const allGathering = await Gathering.find({ "note.typeNote": filter });
            return res.status(200).json(allGathering);
        }
        const allGathering = await Gathering.find();
        return res.status(200).json(allGathering);
    } catch (error) {
        return res.status(200).json({ message: error });
    }
};
const getGatheringId = async (req, res) => {
    try {
        const id = req.params.id;
        const OneGathering = await Gathering.findOne({ _id: id });
        return res.status(200).json(OneGathering);
    } catch (error) {
        return res.status(200).json({ message: error });
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

        const findGathering = await Gathering.findOne({ _id: id });
        const isDuplicate = req.body.teller.some((item) => {
            const itemObjectId = new mongoose.Types.ObjectId(item.idTeller);
            return findGathering.teller.some((teller) => teller.idTeller.equals(itemObjectId));
        });

        if (isDuplicate) {
            return res.status(400).json({
                message: "Các giá trị trong req.body.teller đã tồn tại trong findGathering.teller",
            });
        }
        // Use findByIdAndUpdate instead of just findById
        const updatedGathering = await Gathering.updateOne(
            { _id: id },
            { $push: { teller: req.body.teller } },
            { new: true, runValidators: true } // To return the updated document and run validators
        );

        if (!updatedGathering) {
            return res.status(404).json({ message: "Gathering not found" });
        }

        return res.status(200).json({ message: "Thêm thành công", data: updatedGathering });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const createNoteandAddtoGathering = async (req, res) => {
    try {
        const id = req.params.id;
        const { name, address, phone, type, Date, Status, station, typeNote } = req.body;
        const createNewNote = await new Note({
            name,
            address,
            phone,
            type,
            Date,
            Status,
            station,
            typeNote,
        });
        const saveNote = await createNewNote.save();
        const findGathering = await Gathering.find({ _id: id });

        const findTransaction = await Transaction.find({ _id: id });
        if (findGathering.length > 0) {
            const getGathering = await Gathering.updateOne(
                { _id: id },
                { $push: { note: saveNote } },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ message: "Thêm thành công" });
        } else if (findTransaction.length > 0) {
            const updateTransaction = await Transaction.updateOne(
                { _id: id },
                { $push: { note: saveNote } },
                { new: true, runValidators: true }
            );
            return res.status(200).json({ message: "Thêm thành công" });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const sendTotransactionPoint = async (req, res) => {
    try {
        const id = req.params.id;
        const idGathering = req.params.gathering; // điểm giao dịch
        const { _id, name, address, phone, type, Status, station, typeNote } = req.body;

        const findTransaction = await Transaction.updateOne(
            { _id: id },
            {
                $push: {
                    note: { _id: _id, name, address, phone, type, Status, station, typeNote },
                },
            },
            { new: true, runValidators: true }
        );
        if (!findTransaction) {
            return res.status(404).json({ message: "Không tìm thấy" });
        }
        const deleteNote = await Gathering.updateOne(
            {
                _id: idGathering,
            },
            { $pull: { note: { _id: _id } } }
        );
        return res.status(200).json({ message: "Gửi thành công" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
const sendToGathering = async (req, res) => {
    try {
        const id = req.params.id;
        const idGathering = req.params.gathering; // điểm tập kết
        console.log(id, idGathering);
        const { _id, name, address, phone, type, Status, station, typeNote } = req.body;

        const findGathering = await Gathering.updateOne(
            { _id: id },
            {
                $push: {
                    note: { _id: _id, name, address, phone, type, Status, station, typeNote },
                },
            },
            { new: true, runValidators: true }
        );
        if (!findGathering) {
            return res.status(404).json({ message: "Không tìm thấy" });
        }
        const deleteNote = await Gathering.updateOne(
            {
                _id: idGathering,
            },
            { $pull: { note: { _id: _id } } }
        );
        return res.status(200).json({ message: "Gửi thành công" });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
module.exports = {
    createGathering,
    getAll,
    getGatheringId,
    upDate,
    createNoteandAddtoGathering,
    sendTotransactionPoint,
    sendToGathering,
};
