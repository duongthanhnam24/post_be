const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const slug = require("mongoose-slug-updater");

const note = new Schema(
    {
        // idUser: {
        //     type: mongoose.Schema.Types.ObjectId,
        //     ref: "user",
        //     require: true,
        // },
        name: { type: String, require: true },
        address: { type: String, require: true },
        phone: { type: String, require: true },
        type: { type: String, require: true }, //loại note
        Date: { type: String, require: true },
        Status: { type: String, require: true }, // trạng thái
        station: { type: String, require: true }, // trạm
        typeNote: { type: String, require: true }, // phiếu gì
    },
    {
        timestamps: true,
    }
);

mongoose.plugin(slug);

module.exports = mongoose.model("note", note);
