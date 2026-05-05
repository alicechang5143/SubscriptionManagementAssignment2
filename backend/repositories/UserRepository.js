const BaseRepository = require('./BaseRepository');
const User = require('../models/User');

class UserRepository extends BaseRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findSafeById(id) {
    return this.findOne({ _id: id }, { select: '-password' });
  }
}

module.exports = UserRepository;
