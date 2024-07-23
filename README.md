## Project Description

MisplaceAI is a comprehensive system for identifying misplaced items using advanced computer vision techniques. The project employs TensorFlow's object detection API with pre-trained models to accurately detect items in images and videos.

### Key Technologies:
- **TensorFlow Object Detection API:** Utilised for object detection, providing the core functionality of identifying misplaced items.
- **React:** Powers the user interface, offering a dynamic and interactive experience for interacting with the system.
- **Django REST Framework:** Serves as the backend API, handling data processing and communication between the frontend and the database.
- **Docker:** Containerises the application, ensuring consistent development and production environments.
- **MySQL:** Manages the data storage required for system operations.

### System Architecture:
The project integrates these components into a cohesive system:
- **React Frontend:** Handles user interactions and visualisation.
- **Django REST API:** Manages backend processes and API requests.
- **MySQL Database:** Stores necessary data.
- **Docker:** Ensures consistent deployment across environments.



## Getting Started

To get started with MisplaceAI, follow these steps to set up the development environment using Docker. This will ensure a consistent and isolated setup for both the frontend and backend components.

### Prerequisites

- **Docker**: Ensure Docker is installed on your machine. You can download it from [Docker's official website](https://www.docker.com/products/docker-desktop).

### Setup and Installation

1. **Clone the Repository:**

   First, clone the repository to your local machine:
   ```bash
   git clone https://github.com/freddyimeri/-Identification-of-Misplaced-Items.git
   cd Identification-of-Misplaced-Items
   ```

2. **Build and Run Docker Containers:**

    The project uses Docker to manage the development environment. Navigate to the root directory of the project and build the Docker containers:
    ```bash
   docker-compose up --build
   ```
This command will:

- Build the Docker images as specified in the `Dockerfile` and `docker-compose.yml`.
- Start the containers for both the backend and frontend services.

### Access the Application

Once the containers are up and running, you can access the application via your web browser at [http://localhost:3000](http://localhost:3000). This is where the React frontend will be served.

### Stopping the Containers

To stop the Docker containers, run:
```bash
docker-compose down
```
This will stop and remove the running containers but keep your data intact.

### Additional Commands

#### View Logs

To view the logs for the running containers, you can use:
```bash
docker-compose logs
```

#### Access a Container

If you need to access a specific container’s shell, use:
```bash
docker exec -it <container_name> /bin/bash
```
Replace <container_name> with the name of the container you wish to access.

### Troubleshooting

If you encounter any issues, ensure that Docker is running correctly and that there are no port conflicts. Refer to the [Docker documentation](https://docs.docker.com) for more detailed troubleshooting information.

For further assistance, consult the [project's GitHub repository](https://github.com/freddyimeri/-Identification-of-Misplaced-Items.git) or open an issue if you need support.



## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License (CC BY-NC 4.0). You can read the full license [here](https://creativecommons.org/licenses/by-nc/4.0/).

For detailed terms and conditions, see the [LICENSE](./LICENSE) file.
