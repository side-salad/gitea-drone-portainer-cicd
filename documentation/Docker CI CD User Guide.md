This guide explains how to integrate projects into the CI/CD pipeline using **Gitea**, **Drone CI**, **Portainer stacks**, and a **private Docker registry**.
## **Overview of the Workflow**
- **Gitea:** Hosts your source code.
- **Drone CI:** Builds Docker images and pushes to `main`.
- **Private Registry:** Stores built images.
- **Portainer Stack:** Runs containers from images defined in `docker-compose.yml`.
- **Webhooks:** Automatically redeploy updated stacks.
## **NEW PROJECT SETUP**

### **1. Prepare the Project**
- Use branches for development and code review.
- Only push to `main` when the project is ready for deployment.
### **2. Required Files**
Each project must include:
- **`Dockerfile`** – Defines how the image is built.
- **`docker-compose.yml`** – Defines how the container (or containers) run.
- **`.drone.yml`** – Configures Drone to build, push, and deploy the image.
- **`.dockerignore`** _(optional)_ – Excludes unnecessary files from builds.
### **3. Enable Repository in Drone**
1. Log in to **Drone CI** at port where the drone server lives
2. Find and **activate** your Gitea repository.
### **4. Create the Stack in Portainer**
1. Go to **Portainer → Stacks → Add Stack**.
2. Name the stack (e.g., `project-name`).
3. Paste your `docker-compose.yml`
4. Load environment variables
5. Deploy the stack.
### **5. Generate and Add Webhook**
1. Go to **Portainer → Stacks → project-name → Webhooks**.
2. Create a webhook and copy the URL.
3. Add a deploy step in `.drone.yml`
### **6. Push to Main**
- When you push to `main`, Drone:
    1. Builds the Docker image using your `Dockerfile`
    2. Tags and pushes it to the registry.
    3. Calls the Portainer webhook to redeploy the stack.

## **UPDATING EXISTING PROJECTS**
### **1. Deploying Updates**
- Push to `main` with code changes.
- Drone builds and redeploys container automatically with the latest image.
### **2. Rolling Back**
If the `latest` image fails:
1. List and find previous tags:
	- Replace `<project-name>` with image you're searching for
	- Replace `<username>:<password>` with correct auth
	- Output will be in JSON format
```bash
curl -H <your_token> https://registry.example.com/v2/<project-name>/tags/list

# Output
{ "name": "project-name", "tags": ["latest", "40", "41", "42"] }
```
2. Edit the stack in Portainer:
    - Change `image: project-name:latest` → `image: project-name:42`.
    - Redeploy the stack.
## **Best Practices**
- **Tagging:** Use both `latest` and build-specific tags (`${DRONE_BUILD_NUMBER}`) to allow rollbacks.
- **`.dockerignore`:** Exclude `.drone.yml`, `.git/`, `.venv/`, and unnecessary files.
- **Testing:** Add test steps in `.drone.yml` before building to avoid deploying broken code.
- **Portainer Stacks:** Always define container parameters (ports, env vars, volumes) in `docker-compose.yml`, not `docker run`.