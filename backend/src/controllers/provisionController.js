const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { spawn } = require('child_process');

const USERS_DIR = path.join(__dirname, '../../users');
const TERRAFORM_REPO = path.join(__dirname, '../../terraform-repo');

function generateModuleBlocks(resources) {
  let blocks = '';
  // Bucket
  if (resources.bucket && resources.bucket.name && resources.bucket.location) {
    blocks += `module "bucket" {\n  source          = \"C:/Lucky/Coding/APT-4/terraform-repo/modules/google_storage_bucket\"\n  bucket_name     = \"${resources.bucket.name}\"\n  bucket_location = \"${resources.bucket.location}\"\n}\n\n`;
  }
  // DB Instance
  if (resources.db && resources.db.instance_name) {
    blocks += `module "db_instance" {\n  source            = \"C:/Lucky/Coding/APT-4/terraform-repo/modules/google_sql_database_instance\"\n  instance_name     = \"${resources.db.instance_name}\"\n  instance_version  = \"${resources.db.instance_version || 'POSTGRES_15'}\"\n  instance_region   = \"${resources.db.instance_region || 'us-central1'}\"\n  instance_tier     = \"${resources.db.instance_tier || 'db-f1-micro'}\"\n}\n\n`;
  }
  // DB
  if (resources.db && resources.db.db_name && resources.db.instance_name) {
    blocks += `module "db" {\n  source      = \"C:/Lucky/Coding/APT-4/terraform-repo/modules/google_sql_database\"\n  db_name     = \"${resources.db.db_name}\"\n  db_instance = \"${resources.db.instance_name}\"\n}\n\n`;
  }
  // Add variable declarations for project, region, zone
  blocks += `variable \"project\" {\n  type = string\n}\nvariable \"region\" {\n  type = string\n}\nvariable \"zone\" {\n  type = string\n}\n`;
  return blocks;
}

exports.provisionYaml = async (req, res) => {
  const { uuid, yaml: yamlString } = req.body;
  if (!uuid || !yamlString) return res.status(400).json({ error: 'UUID and YAML are required' });
  try {
    const users = await fs.readdir(USERS_DIR);
    const userFolder = users.find(f => f.endsWith(uuid));
    if (!userFolder) return res.status(404).json({ error: 'User not found' });
    const userPath = path.join(USERS_DIR, userFolder);
    // Save YAML spec
    const specPath = path.join(userPath, 'spec.yaml');
    await fs.writeFile(specPath, yamlString);
    // Parse YAML and generate main.tf for all resources
    const spec = yaml.load(yamlString);
    const resources = spec.resources || {};
    const mainTf = generateModuleBlocks(resources);
    const mainTfPath = path.join(userPath, 'main.tf');
    await fs.writeFile(mainTfPath, mainTf);
    // Generate terragrunt.hcl with provider and source = ./ and inputs for project, region, zone
    const tgHcl = `generate \"provider\" {\n  path      = \"provider.tf\"\n  if_exists = \"overwrite\"\n  contents  = <<EOF\nprovider \"google\" {\n  project = var.project\n  region  = var.region\n  zone    = var.zone\n}\nEOF\n}\n\nterraform {\n  source = \"./\"\n}\n\n  inputs = {\n     project = \"terra-460008\"\n     region  = \"us-central1\"\n     zone    = \"us-central1-c\"\n   }\n`;
    const tgPath = path.join(userPath, 'terragrunt.hcl');
    await fs.writeFile(tgPath, tgHcl);

    // Run terragrunt apply in the user's folder
    const terragrunt = spawn('terragrunt', ['apply', '-auto-approve'], { cwd: userPath, env: process.env });

    terragrunt.stdout.on('data', (data) => {
      process.stdout.write(data);
    });

    terragrunt.stderr.on('data', (data) => {
      process.stderr.write(data);
    });

    terragrunt.on('close', (code) => {
      if (code !== 0) {
        return res.status(500).json({ error: 'Terragrunt apply failed', code });
      }
      res.json({ success: true, message: 'Provisioning complete' });
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to provision resource', details: err.message });
  }
};

exports.getSpecExample = (req, res) => {
  const example = {
    resources: {
      bucket: {
        name: "my-bucket",
        location: "us-central1"
      },
      db: {
        instance_name: "my-db-instance",
        db_name: "my-db"
      }
    }
  };
  res.type('yaml').send(yaml.dump(example));
}; 