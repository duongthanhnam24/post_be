const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

const user = new Schema(
    {
        name: { type: String, require: true },
        userName: { type: String, require: true },
        password: { type: String, require: true },
        role: {
            type: String,
            enum: [
                "admin",
                "leaderTransactionPoint",
                "tellersTransactionPoint",
                "leaderGatheringPoint",
                "tellersGatheringPoint",
            ],
            require: true,
        },
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);

module.exports = mongoose.model("user", user);
