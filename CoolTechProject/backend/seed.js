const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const OU = require('./models/OU');
const Division = require('./models/Division');
const CredentialRepository = require('./models/CredentialRepository');

const mongoURI = 'mongodb+srv://hyperiondev:HyperionDev@capstonev.tfbrri6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority&appName=CapstoneV';

mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    await User.deleteMany({});
    await OU.deleteMany({});
    await Division.deleteMany({});
    await CredentialRepository.deleteMany({});

    // Create sample OUs
    const ou1 = await OU.create({ name: 'News Management' });
    const ou2 = await OU.create({ name: 'Software Reviews' });
    const ou3 = await OU.create({ name: 'Hardware Reviews' });
    const ou4 = await OU.create({ name: 'Opinion Publishing' });

    // Create sample Divisions for each OU
    const divisions = [];
    for (const ou of [ou1, ou2, ou3, ou4]) {
      for (const divisionName of ['Finances', 'IT', 'Writing', 'Development', 'Operations']) {
        const division = await Division.create({ name: divisionName, ou: ou._id });
        divisions.push(division);
        ou.divisions.push(division._id);
        await ou.save();
      }
    }
// Create sample Users with hashed passwords
const hashedPassword = await bcrypt.hash('password123', 10);
const user1 = await User.create({ username: 'john.doe', password: hashedPassword, role: 'Normal', organizationalUnits: [ou1._id], divisions: [divisions[0]._id] });
const user2 = await User.create({ username: 'jane.doe', password: hashedPassword, role: 'Admin', organizationalUnits: [ou1._id, ou2._id], divisions: [divisions[1]._id, divisions[6]._id] });
const user3 = await User.create({ username: 'james.doe', password: hashedPassword, role: 'Manager', organizationalUnits: [ou2._id], divisions: [divisions[2]._id] });

    // Add users to divisions
    for (const division of divisions) {
      division.users.push(user1._id, user2._id);
      await division.save();
    }

    // Create sample Credentials for each Division
    for (const division of divisions) {
      await CredentialRepository.create({ 
        username: 'admin', 
        password: 'pass123', 
        name: 'Admin Credential',  // Add the name field
        division: division._id 
      });
    }

    console.log('Data seeded!');
  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

seedData();
