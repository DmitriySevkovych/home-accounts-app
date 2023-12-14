.PHONY: build-development
build-development:
	docker-compose -f docker/development/docker-compose.yml build \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_COMMIT=$(shell git rev-parse HEAD)

.PHONY: build-stage
build-stage:
	docker-compose -f docker/stage/docker-compose.yml build \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_COMMIT=$(shell git rev-parse HEAD) \
		--push
  
.PHONY: build-production
build-production:
	docker-compose -f docker/production/docker-compose.yml build \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_COMMIT=$(shell git rev-parse HEAD) \
		--push

.PHONY: all
all: build-stage build-production