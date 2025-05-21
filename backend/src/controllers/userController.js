const { v4: uuidv4 } = require('uuid');
const fs = require('fs-extra');
const path = require('path');

const USERS_DIR = path.join(__dirname, '../../users');

exports.register = async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });
  const userUuid = uuidv4();
  const username = name.trim().replace(/\s+/g, '_');
  const userFolder = `${username}_${userUuid}`;
  const userPath = path.join(USERS_DIR, userFolder);
  try {
    await fs.ensureDir(userPath);
    res.json({ uuid: userUuid, username, userFolder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create user folder' });
  }
};

exports.login = async (req, res) => {
  const { uuid } = req.body;
  if (!uuid) return res.status(400).json({ error: 'UUID is required' });
  // Find user folder by uuid
  try {
    const users = await fs.readdir(USERS_DIR);
    const userFolder = users.find(f => f.endsWith(uuid));
    if (!userFolder) return res.status(404).json({ error: 'User not found' });
    const username = userFolder.split('_').slice(0, -1).join('_');
    res.json({ success: true, username, userFolder });
  } catch (err) {
    res.status(500).json({ error: 'Failed to read users' });
  }
}; 