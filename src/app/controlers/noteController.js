const Note = require("../models/noteDB");
const Gathering = require("../models/Gathering");
const Transaction = require("../models/transactionPoint");
const findNote = async (req, res) => {
    try {
        const id = req.params.id;
        const find = await Note.findOne({ _id: id });
        return res.status(200).json(find);
    } catch (error) {
        return res.status(200).json({ message: error });
    }
};

const editNote = async (req, res) => {
    try {
        const id = req.params.id;
        const idOb = req.params.idOb;
        const updateNote = await Note.updateOne(
            {
                _id: id,
            },
            req.body
        );
        const findObGathering = await Gathering.findOne({ _id: idOb });
        const findObTransaction = await Transaction.findOne({ _id: idOb });
        if (findObGathering) {
            findObGathering.note.forEach(async (item) => {
                if (item._id == id) {
                    const updatedGathering = await Gathering.updateOne(
                        { "note._id": id },
                        { $set: { "note.$": req.body } }
                    );
                }
            });
            return res.status(200).json({ message: "sửa thành công" });
        }
        if (findObTransaction) {
            findObTransaction.note.forEach(async (item) => {
                if (item._id == id) {
                    console.log("here");

                    const updatedTransaction = await Transaction.updateOne(
                        { "note._id": id },
                        { $set: { "note.$": req.body } }
                    );
                }
            });
            return res.status(200).json({ message: "sửa thành công" });
        }
    } catch (error) {
        return res.status(200).json({ message: error });
    }
};

module.exports = {
    editNote,
    findNote,
};
