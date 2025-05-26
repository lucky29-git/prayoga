module "bucket" {
  source          = "C:/Lucky/Coding/APT-4/terraform-repo/modules/google_storage_bucket"
  bucket_name     = "dfhhsefssadfasdf"
  bucket_location = "us-central1"
}

variable "project" {
  type = string
}
variable "region" {
  type = string
}
variable "zone" {
  type = string
}
