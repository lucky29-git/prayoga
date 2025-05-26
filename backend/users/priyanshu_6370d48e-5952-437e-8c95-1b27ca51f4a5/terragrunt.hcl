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
  source = "./"
}

  inputs = {
     project = "terra-460008"
     region  = "us-central1"
     zone    = "us-central1-c"
   }
