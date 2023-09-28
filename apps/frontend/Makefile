.PHONY: build-development
build-development:
	docker-compose -f docker/development/docker-compose.yml build

.PHONY: build-stage
build-stage:
	docker-compose -f docker/stage/docker-compose.yml build --push
  
.PHONY: build-production
build-production:
	docker-compose -f docker/production/docker-compose.yml build --push

.PHONY: all
all: build-development build-stage build-production