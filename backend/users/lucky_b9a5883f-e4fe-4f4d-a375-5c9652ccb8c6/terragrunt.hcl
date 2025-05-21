generate "provider" {
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

terraform {
  source = "../../../terraform-repo/modules/google_storage_bucket"
}

inputs = {
  bucket_name = "lucky-2-bucket"
  bucket_location = "us-central1"
}
