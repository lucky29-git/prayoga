const fs = require('fs-extra');
const path = require('path');
const yaml = require('js-yaml');
const { exec, spawn } = require('child_process');

const USERS_DIR = path.join(__dirname, '../../users');
const TERRAFORM_REPO = path.join(__dirname, '../../terraform-repo');

exports.provisionYaml = async (req, res) => {
  const { uuid, yaml: yamlString } = req.body;
  console.log(uuid, yamlString);
  if (!uuid || !yamlString) return res.status(400).json({ error: 'UUID and YAML are required' });
  try {
    const users = await fs.readdir(USERS_DIR);
    const userFolder = users.find(f => f.endsWith(uuid));
    if (!userFolder) return res.status(404).json({ error: 'User not found' });
    const userPath = path.join(USERS_DIR, userFolder);
    // Save YAML spec
    const specPath = path.join(userPath, 'spec.yaml');
    await fs.writeFile(specPath, yamlString);
    // Parse YAML and generate terragrunt.hcl for bucket
    const spec = yaml.load(yamlString);
    let tgHcl = `generate "provider" {
  path      = "provider.tf"
  if_exists = "overwrite"
  contents  = <<EOF
provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}
EOF
}

`;
    if (spec.bucket_name && spec.bucket_location) {
      tgHcl += `terraform {\n  source = "../../../terraform-repo/modules/google_storage_bucket"\n}\n\ninputs = {\n  bucket_name = \"${spec.bucket_name}\"\n  bucket_location = \"${spec.bucket_location}\"\n}\n`;
    }
    const tgPath = path.join(userPath, 'terragrunt.hcl');
    await fs.writeFile(tgPath, tgHcl);

    // Run terragrunt apply in the user's folder
    const terragrunt = spawn('terragrunt', ['apply', '-auto-approve'], { cwd: userPath, env: process.env });

    terragrunt.stdout.on('data', (data) => {
      process.stdout.write(data); // This will print to your backend console
    });

    terragrunt.stderr.on('data', (data) => {
      process.stderr.write(data); // This will print errors to your backend console
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
    bucket_name: "user-1-bucket",
    bucket_location: "us-central1"
  };
  res.type('yaml').send(yaml.dump(example));
}; 