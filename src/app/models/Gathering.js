const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Định nghĩa Schema cho điểm tập kết
const gatheringPointSchema = new Schema(
    {
        pointName: { type: String, required: true },
        transactions: [
            {
                idTransaction: { type: Schema.Types.ObjectId, ref: "transaction" },
                pointName: { type: String, ref: "transaction" },
            },
        ], // Mảng chứa khóa ngoại đến các điểm giao dịch
        leaderGatheringPoint: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            require: true,
            validate: {
                validator: async function (value) {
                    const user = await mongoose.model("user").findById(value);
                    return user && user.role === "leaderGatheringPoint";
                },
                message: "leaderGatheringPoint must be a user with role leaderGatheringPoint",
            },
        },
        name: {
            type: String,
            ref: "user",
            require: true,
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

module.exports = mongoose.model("gatheringPoint", gatheringPointSchema);
