module "bucket" {
  source          = "C:/Lucky/Coding/APT-4/terraform-repo/modules/google_storage_bucket"
  bucket_name     = "bittubanderbucket"
  bucket_location = "us-central1"
}

module "db_instance" {
  source            = "C:/Lucky/Coding/APT-4/terraform-repo/modules/google_sql_database_instance"
  instance_name     = "bittuinstance"
  instance_version  = "POSTGRES_15"
  instance_region   = "us-central1"
  instance_tier     = "db-f1-micro"
}

module "db" {
  source      = "C:/Lucky/Coding/APT-4/terraform-repo/modules/google_sql_database"
  db_name     = "bittudb"
  db_instance = "bittuinstance"
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