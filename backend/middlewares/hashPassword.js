const bcrypt = require('bcrypt');

const hashPassword = async function (next) {
    if (this.isModified && this.isModified('password')) {
        // Para operaciones de 'save'
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    } else if (this.getUpdate && this.getUpdate().password) {
        // Para operaciones 'findOneAndUpdate' o 'findByIdAndUpdate'
        const update = this.getUpdate();
        const salt = await bcrypt.genSalt(10);
        update.password = await bcrypt.hash(update.password, salt);
    }
    next();
};

module.exports = hashPassword;
