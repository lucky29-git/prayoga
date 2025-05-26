const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');

const USERS_DIR = path.join(__dirname, '../../users');

exports.getSpec = async (req, res) => {
  const { uuid } = req.user; // or from req.query/body
  const userPath = path.join(USERS_DIR, `user_${uuid}`);
  const specPath = path.join(userPath, 'spec.yaml');
  if (!(await fs.pathExists(specPath))) return res.json({ resources: [] });
  const spec = yaml.load(await fs.readFile(specPath, 'utf8'));
  res.json({ resources: spec.resources || {} });
};

exports.getState = async (req, res) => {
  const username = req.query.username;
  const uuid = req.query.uuid;
  if (!username || !uuid) {
    return res.status(400).json({ error: 'Missing username or uuid' });
  }
  const userPath = path.join(USERS_DIR, `${username}_${uuid}`);
  let statePath = path.join(userPath, 'terraform.tfstate');
  if (!(await fs.pathExists(statePath))) {
    // Try to find it in .terragrunt-cache
    const searchPath = path.join(userPath, '.terragrunt-cache', '**', 'terraform.tfstate').replace(/\\/g, '/');
    const matches = glob.sync(searchPath, { dot: true });
    if (matches.length > 0) {
      matches.sort((a, b) => fs.statSync(b).mtime - fs.statSync(a).mtime);
      statePath = matches[0];
    } else {
      return res.json({ resources: [] });
    }
  }
  const state = await fs.readJson(statePath);
  // Transform resources for frontend display
  let resources = [];
  if (Array.isArray(state.resources)) {
    for (const resource of state.resources) {
      if (resource.type === 'google_storage_bucket' && Array.isArray(resource.instances)) {
        for (const inst of resource.instances) {
          const attr = inst.attributes || {};
          resources.push({
            type: 'bucket',
            name: attr.name || '',
            location: attr.location || '',
            time_created: attr.time_created || '',
            updated: attr.updated || ''
          });
        }
      }
      // Add more resource type transforms here as needed
    }
  }
  res.json({ resources });
};
