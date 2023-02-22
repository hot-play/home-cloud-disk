const User = new Object({
    login: { type: String, required: true, unique: true },
    passwor: { type: String, required: true },
    diskSpace: { type: Number, default: 1024 ** 3 * 10 },
    usedSpace: { type: Number, default: 0 },
    files: [{ type: ObjectId, ref: "File" }],
});

module.exports = model("User");
