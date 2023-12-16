.PHONY: build-stage
build-stage:
	docker-compose -f docker/stage/docker-compose.yml build \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_COMMIT=$(shell git rev-parse HEAD) \
		--no-cache \
		--push
  
.PHONY: build-production
build-production:
	docker-compose -f docker/production/docker-compose.yml build \
		--build-arg GIT_BRANCH=$(shell git rev-parse --abbrev-ref HEAD) \
		--build-arg GIT_COMMIT=$(shell git rev-parse HEAD) \
		--no-cache \
		--push

.PHONY: all
all: build-stage build-production