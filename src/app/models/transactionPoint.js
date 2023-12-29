const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const transactionPointSchema = new Schema(
    {
        pointName: { type: String, required: true },
        idGathering: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "gatheringPoint",
            required: true,
        },
        nameGathering: {
            type: String,
            ref: "gatheringPoint",
            required: true,
        },
        leaderTransactionPoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true,
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model("user").findById(value);
                    return user && user.role === "leaderTransactionPoint";
                },
                message: 'leaderTransactionPoint must be a user with role "leaderTransactionPoint"',
            },
        },
        name: {
            type: String,
            ref: "user",
            required: true,
        },
        teller: [
            {
                idTeller: { type: mongoose.Schema.Types.ObjectId, ref: "user", require: true },
                name: { type: String, require: true },
            },
        ],
        note: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "note",
                    required: true,
                },
                name: { type: String, require: true },
                address: { type: String, require: true },
                phone: { type: String, require: true },
                type: { type: String, require: true }, //loại note
                Date: { type: String, require: true },
                Status: { type: String, require: true }, // trạng thái
                station: { type: String, require: true }, // trạm
                typeNote: { type: String, require: true }, // phiếu gì
            },
        ],
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("transaction", transactionPointSchema);
