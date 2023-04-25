COMPOSE = ./docker-compose.yml
VOLUME_FOLDER= /Users/$(USER)/docker_volume

all : $(VOLUME_FOLDER)
	@echo "Starting all containers..."
	@docker compose -f $(COMPOSE) up -d
	@echo "All containers started successfully!"

down:
	@echo "Stopping all containers..."
	@docker compose -f $(COMPOSE) down
	@echo "All containers stopped successfully!"

clean :
	@echo "Cleaning up containers, images, networks and volumes..."
	-@if [ "$$(docker ps -q)" ]; then \
		docker stop $$(docker ps -aq); \
		docker rm $$(docker ps -aq); \
		echo "Containers removed successfully!"; \
	else \
		echo "No containers to remove"; \
	fi
	-@if [ "$$(docker images -q)" ]; then \
		docker rmi $$(docker images -q); \
		echo "Images removed successfully"; \
	else \
		echo "No images to remove"; \
	fi
	-@if [ "$$(docker network ls --filter "name=^(?!(bridge|host|none)$).*" -q)" ]; then \
		docker network rm $$(docker network ls --filter "name=^(?!(bridge|host|none)$).*" -q); \
		echo "Networks removed successfully!"; \
	else \
		echo "No networks to remove"; \
	fi
	-@if [ "$$(docker volume ls -q)" ]; then \
		docker volume rm $$(docker volume ls -q); \
		echo "Volumes removed successfully!"; \
	else \
		echo "No volumes to remove"; \
	fi

$(VOLUME_FOLDER):
	@mkdir -p $@

re-front:
	docker stop frontend
	docker rm frontend
	docker rmi trans-frontend
	make all

re-back:
	docker stop backend
	docker rm backend
	docker rmi trans-backend
	make all

re: clean all

delete-db:
	@echo deleting database
	@rm -rf $(VOLUME_FOLDER)

refresh :
	@echo begin to refresh container content ;
	@docker cp -a ./frontend/public frontend:/app;
	@docker cp -a ./frontend/src frontend:/app;
	@echo container content refreshed;

save:
	@git commit -am "$(MAKECMDGOALS)";
	@git push;

.PHONY: all re down clean save

# authentification gateway 
# chat en socket 
# ajouter bonus jeu