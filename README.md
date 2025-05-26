# Internal Development Platform (IDP) - Proof of Concept

## Overview
This project is a Proof of Concept (POC) for an Internal Development Platform (IDP) that enables users to provision and manage cloud infrastructure resources (such as GCP buckets, databases, etc.) through a user-friendly web interface. The platform leverages pre-built Terraform modules and Terragrunt for orchestration, with a Node.js/Express backend and a React (ShadCN UI) frontend.

---

## Folder Structure

```
APT-4/
├── backend/                # Node.js/Express backend
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── resource/           # Resource-related controllers
│   │   │   ├── auth/               # Auth-related controllers
│   │   │   └── index.js            # Exports all controllers
│   │   ├── routes/
│   │   │   ├── resource/           # Resource-related routes
│   │   │   ├── auth/               # Auth-related routes
│   │   │   └── index.js            # Exports all routes
│   │   └── index.js                # Main entry for src
│   ├── users/              # Per-user folders (username_uuid)
│   │   └── <username_uuid>/
│   │       └── .terragrunt-cache/  # Terragrunt state/cache
│   └── package.json
├── frontend/               # React frontend (ShadCN UI)
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── lib/
│   │   └── pages/          # Main pages (Home, Register, Login, Dashboard, Resources)
│   └── public/
├── terraform-repo/         # Terraform modules and base repo
│   ├── modules/
│   │   ├── google_storage_bucket/
│   │   ├── google_sql_database/
│   │   ├── google_sql_database_instance/
│   │   └── ...
│   └── users/              # Per-user Terragrunt cache (if used)
├── README.md               # Project documentation
└── ...
```

---

## Technologies Used

### Frontend
- **React** (with Vite or CRA)
- **ShadCN UI** (component library)
- **Axios** (API calls)
- **TypeScript** (recommended)

### Backend
- **Node.js** (Express.js)
- **fs-extra** (filesystem operations)
- **js-yaml** (YAML parsing)
- **glob** (file pattern matching)
- **Terragrunt/Terraform** (invoked via child process)

### Terraform Repo
- **Terraform** (infrastructure as code)
- **Terragrunt** (orchestration, DRY config)
- **GCP Provider** (Google Cloud Platform)
- **Custom modules** for each resource type

---

## Provisioning Flow

1. **User registers/logs in** via the frontend.
2. **Backend** creates a folder: `users/<username>_<uuid>/` and initializes Terragrunt files.
3. **User selects resources** (buckets, databases, etc.) via a form or YAML editor in the dashboard.
4. **Frontend** sends the spec to the backend.
5. **Backend** generates `main.tf` and `terragrunt.hcl` using the spec, supporting multiple resources of any type.
6. **Backend** runs `terragrunt apply` in the user folder.
7. **Terraform state** is stored in `.terragrunt-cache`.
8. **User visits Resources page** to see provisioned resources, which are parsed from the state file and displayed in a user-friendly way.

---

## API Endpoints (Backend)

- `POST /prayoga/api/v1/auth/register` — Register a new user
- `POST /prayoga/api/v1/auth/login` — Login
- `POST /prayoga/api/v1/provision/yaml` — Provision resources from YAML spec
- `GET /prayoga/api/v1/resources/state?username=<username>&uuid=<uuid>` — Get actual provisioned resources (parsed from state)
- `GET /prayoga/api/v1/resources/spec?username=<username>&uuid=<uuid>` — (Optional) Get desired state spec

---

## Frontend Pages & Components

- **Home** — Landing page
- **Register** — User registration form
- **Login** — User login form
- **Dashboard** —
  - Resource selection form (dynamic, supports multiple resources of any type)
  - YAML editor (live preview)
  - Provision button (submits spec to backend)
- **Resources** —
  - Fetches and displays provisioned resources (type, name, location, time created, updated, etc.)
  - Uses username and uuid from localStorage
- **UI Components** — Built with ShadCN UI (inputs, buttons, loaders, etc.)

---

## Terraform Repo & Modules

### google_storage_bucket
- **name** -              (required)
- **location** -          us-central1 (default)
- **storage_class** -     STANDARD (default)
- **force_destroy** -     false (default)
- **labels** -            {} (default)
- **public_access_prevention** - inherited (default)

### google_sql_database_instance
- **name** -              (required)
- **database_version** -  MYSQL_5_7 (default)
- **region** -            us-central1 (default)
- **tier** -              (required)
- **root_password** -     (required)
- **deletion_protection** - true (default)

### google_sql_database
- **name** -              (required)
- **instance_name** -     (required)
- **charset** -           UTF8 (default)
- **collation** -         en_US.UTF8 (default)

---

## Generic Resource Provisioning Logic

- **Spec format:**
  ```yaml
  resources:
    bucket:
      - name:               # required
        location: us-central1
        storage_class: STANDARD
        force_destroy: false
        labels: {}
        public_access_prevention: inherited
    db_instance:
      - name:               # required
        database_version: MYSQL_5_7
        region: us-central1
        tier:               # required
        root_password:      # required
        deletion_protection: true
    database:
      - name:               # required
        instance_name:      # required
        charset: UTF8
        collation: en_US.UTF8
  ```
- **Backend code generation:**
  - Loops over all resource types and instances
  - Generates a `module` block for each instance, using a mapping of resource type to module path
  - Supports easy extension for new resource types
- **State parsing:**
  - Loops over all resource types and instances in the state file
  - Returns a simplified, unified list to the frontend

---

## Extending the Platform

- **To add a new resource type:**
  1. Add a new Terraform module in `terraform-repo/modules/`
  2. Add the module path to the backend's resource type mapping
  3. Add the resource type and its fields to the frontend form/YAML schema
  4. No changes needed to the core backend logic

---

## Example User Flow

1. User registers/logs in
2. User selects multiple resources (any type/quantity)
3. Backend provisions all resources in one go
4. User sees all provisioned resources in the Resources page

---

## Contributors
- [Your Name]

---

## License
[MIT]
